
function linkify(text) {
  const urlRegex = /(\bhttps?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}
function formatDateISO(rawDate) {
  const cleanDate = rawDate.replace(/,/g, '/');
  const date = new Date(cleanDate);
  return date.toISOString().split('T')[0]; // "2025-06-19"
}
function loadHighlights(path) {
  fetch(path)
    .then(resp => resp.json())
    .then(data => {
      const container = document.getElementById("news-list");
  
      const sorted = data.sort((a, b) => b.year - a.year);
  
      sorted.forEach(item => {
        const div = document.createElement("div");
        div.className = "news-item";
  
        const imageHTML = item.image
          ? `<img src="assets/highlights/${item.image}" alt="${item.title}" class="news-image" />`
          : "";
  
        let meta = "";
        if (item.type === "publication") {
          meta = `${item.authors}. ${item.title} (${item.year}), <em>${linkify(item.journal)}</em>.`;
          worktitle = `Our work is published in <em>${linkify(item.journal)}</em>!`;
        } 
        else {
          meta = `<p><em>${item.event_title}</em></p>`;
          worktitle = `${item.title}`;
        }

        const dateStr = item.date ? formatDateISO(item.date) : '';
  
        const link = item.link
          ? `<a href="${item.link}" target="_blank">Read more</a>`
          : "";
  
        div.innerHTML = `
          ${imageHTML}
          <div class="news-text">
            <p><strong>${dateStr} — ${worktitle}</strong></p>
            <p>${linkify(item.description)}</p>
            <p>${meta} ${link}</p>
          </div>
        `;
        container.appendChild(div);
      });
    });
}
loadHighlights("assets/highlights.json")