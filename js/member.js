
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
          ? `<img src="assets/members/${item.image}" alt="${item.title}" class="news-image" />`
          : "";

        div.innerHTML = `
          ${imageHTML}
          <div class="news-text">
            <p style="font-size:1.39rem; font-weight:700; line-height:1.5; margin:0;">
              <strong>${item.name}</strong>
            </p>
            <hr class="name-line">
            <p>${item.position}</p>
            <p>${linkify(item.description).replace(/\n/g, '<br>')}</p>
          </div>
        `;
        container.appendChild(div);
       /*<p>
          <hr class="member-line">
        ${item.education}<br>
        ${item.email}
        </p>*/
      });
    });
}
loadHighlights("assets/member.json")