
function boldifyName(text, name = "Xu, L") {
  const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, "g");
  return text.replace(regex, `<strong>${name}</strong>`);
}

function loadCSV(path) {
  Papa.parse(path, {
    download: true,
    header: true,
    complete: function(results) {
      const list = document.getElementById("pub-list");
      const doiIcon = `<img src="assets/images/DOI_logo.jpg" alt="DOI" class="pub-icon" />`;
      const pdfIcon = `<img src="assets/images/PDF_file_icon.jpg" alt="PDF" class="pub-icon" />`;

      /* sort by year */
      const sorted = results.data
        .filter(pub => pub.year && !isNaN(pub.year))
        .sort((a, b) => parseInt(b.year) - parseInt(a.year));

      sorted.forEach(pub => {
        if (!pub.authors) return;
        const authors = boldifyName(pub.authors);
        const journal = `<strong>${pub.journal}</strong>`;
        const item = document.createElement("li");
/*        item.innerHTML = `${authors}, <em>${pub.title}</em>, ${journal} ${pub.year}. 
          <a href="${pub.link}" target="_blank" title="DOI">${doiIcon}</a>
          <a href="assets/publications/${pub.pdf}" target="_blank" title="PDF">${pdfIcon}</a>`;
        list.appendChild(item);
*/
        const doiHTML = pub.link
          ? `<a href="${pub.link}" target="_blank" title="DOI">${doiIcon}</a>`
          : "";
        const pdfHTML = pub.pdf
          ? `<a href="assets/publications/${pub.pdf}" target="_blank" title="PDF">${pdfIcon}</a>`
          : "";
        item.innerHTML = `${authors}, <em>${pub.title}</em>, ${journal} ${pub.year}.
          ${doiHTML}
          ${pdfHTML}`;
        list.appendChild(item);
      });
    }
  });
}

loadCSV("assets/publications.csv");
