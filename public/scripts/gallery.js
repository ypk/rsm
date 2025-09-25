// gallery.js - SOLID version

class GalleryRandomizer {
  constructor(gridSelector, maxVisible) {
    this.gridSelector = gridSelector;
    this.maxVisible = maxVisible;
    this.grid = null;
    this.items = [];
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      this.grid = document.querySelector(this.gridSelector);
      if (!this.grid) return;
      this.items = Array.from(this.grid.children);
      this.shuffleItems();
      this.showLimitedItems();
    });
  }

  shuffleItems() {
    for (let i = this.items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      this.grid.appendChild(this.items[j]);
    }
  }

  showLimitedItems() {
    this.items.forEach((el, idx) => {
      el.style.display = idx < this.maxVisible ? '' : 'none';
    });
  }
}

// Usage
const gallery = new GalleryRandomizer('[role="list"][aria-label*="gallery"]', 9);
gallery.init();
