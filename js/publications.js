
function boldifyName(text, name = "Xu, L") {
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, "g");
  return text.replace(regex, `<strong>${name}</strong>`);
}

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      i += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift();
  return rows
    .filter(values => values.some(Boolean))
    .map(values => Object.fromEntries(headers.map((header, index) => [header, values[index] || ""])));
}

function loadCSV(path) {
  fetch(path)
    .then(resp => resp.text())
    .then(text => {
      const list = document.getElementById("pub-list");
      const doiIcon = `<img src="assets/images/DOI_logo.jpg" alt="DOI" class="pub-icon" loading="lazy" decoding="async" />`;
      const pdfIcon = `<img src="assets/images/PDF_file_icon.jpg" alt="PDF" class="pub-icon" loading="lazy" decoding="async" />`;

      const sorted = parseCSV(text)
        .filter(pub => pub.year && !Number.isNaN(Number(pub.year)))
        .sort((a, b) => Number(b.year) - Number(a.year));

      sorted.forEach(pub => {
        if (!pub.authors) return;
        const authors = boldifyName(pub.authors);
        const journal = `<strong>${pub.journal}</strong>`;
        const item = document.createElement("li");

        const doiHTML = pub.link
          ? `<a href="${pub.link}" target="_blank" rel="noopener noreferrer" title="DOI">${doiIcon}</a>`
          : "";
        const pdfHTML = pub.pdf
          ? `<a href="assets/publications/${pub.pdf}" target="_blank" rel="noopener noreferrer" title="PDF">${pdfIcon}</a>`
          : "";
        item.innerHTML = `${authors}, <em>${pub.title}</em>, ${journal} ${pub.year}.
          ${doiHTML}
          ${pdfHTML}`;
        list.appendChild(item);
      });
    });
}

loadCSV("assets/publications.csv");
