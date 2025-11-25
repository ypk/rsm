// Gallery grid show more functionality using JS class

const SELECTORS = {
  GRID: '#gallery-grid',
  SHOW_MORE: '#show-more-gallery',
  ITEM: '[data-gallery-index]',
};

const CLASSES = {
  HIDDEN: 'hidden',
};

class Gallery {
  constructor(gridSelector, buttonSelector, itemSelector) {
    this.grid = document.querySelector(gridSelector);
    this.button = document.querySelector(buttonSelector);
    this.items = this.grid ? this.grid.querySelectorAll(itemSelector) : [];
    this.init();
  }

  showAll() {
    this.items.forEach((el) => el.classList.remove(CLASSES.HIDDEN));
    if (this.button) this.button.style.display = 'none';
  }

  init() {
    if (this.button) {
      this.button.addEventListener('click', () => this.showAll());
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  new Gallery(SELECTORS.GRID, SELECTORS.SHOW_MORE, SELECTORS.ITEM);
});
