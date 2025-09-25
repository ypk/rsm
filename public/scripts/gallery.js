document.addEventListener('DOMContentLoaded', function () {
  const grid = document.querySelector('[role="list"][aria-label*="gallery"]');
  if (!grid) return;
  const items = Array.from(grid.children);

  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    grid.appendChild(items[j]);
  }

  items.forEach(function (el, idx) {
    el.style.display = idx < 9 ? '' : 'none';
  });
});
