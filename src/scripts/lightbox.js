// Constants
const SELECTORS = {
  LIGHTBOX: '#lightbox',
  IMAGE: '#lightbox-image',
  CAPTION: '#lightbox-caption',
  CLOSE: '#lightbox-close',
  PREV: '#lightbox-prev',
  NEXT: '#lightbox-next',
  TRIGGER: '[data-lightbox-trigger]'
};

const CLASSES = {
  HIDDEN: 'hidden',
  FLEX: 'flex',
  OPACITY_0: 'opacity-0',
  SCALE_95: 'scale-95'
};

const TIMING = {
  DEBOUNCE: 150,
  TRANSITION: 300,
  IMAGE_FADE: 100
};

// Utility functions
const Utils = {
  debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },

  toggleBodyScroll(lock = true) {
    document.body.style.overflow = lock ? 'hidden' : '';
  },

  parseImageData(element) {
    const { image, alt, caption, index } = element.dataset;
    return { src: image, alt, caption, index: parseInt(index) };
  }
};

// Animation handler
class AnimationController {
  constructor(element) {
    this.element = element;
    this.modal = element.querySelector('.transform');
  }

  show() {
    this.element.classList.remove(CLASSES.HIDDEN);
    this.element.classList.add(CLASSES.FLEX);
    
    requestAnimationFrame(() => {
      this.element.classList.remove(CLASSES.OPACITY_0);
      this.modal.classList.remove(CLASSES.SCALE_95);
    });
  }

  hide(callback) {
    this.element.classList.add(CLASSES.OPACITY_0);
    this.modal.classList.add(CLASSES.SCALE_95);
    
    setTimeout(() => {
      this.element.classList.add(CLASSES.HIDDEN);
      this.element.classList.remove(CLASSES.FLEX);
      callback?.();
    }, TIMING.TRANSITION);
  }
}

// Image manager
class ImageManager {
  constructor(imageElement, captionElement) {
    this.image = imageElement;
    this.caption = captionElement;
    this.isTransitioning = false;
  }

  update(imageData) {
    if (this.isTransitioning) return;
    
    this.isTransitioning = true;
    this.image.style.opacity = '0.5';
    
    setTimeout(() => {
      this.image.src = imageData.src;
      this.image.alt = imageData.alt;
      this.caption.textContent = imageData.caption;
      this.image.style.opacity = '1';
      this.isTransitioning = false;
    }, TIMING.IMAGE_FADE);
  }
}

// Navigation controller
class NavigationController {
  constructor(images) {
    this.images = images;
    this.currentIndex = 0;
  }

  setIndex(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
  }

  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
    return this.getCurrentImage();
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
    return this.getCurrentImage();
  }

  isAtStart() {
    return this.currentIndex === 0;
  }

  isAtEnd() {
    return this.currentIndex === this.images.length - 1;
  }

  getCurrentImage() {
    return this.images[this.currentIndex];
  }
}

// Main lightbox class
export class Lightbox {
  constructor() {
    this.elements = this.getElements();
    this.images = this.collectImages();
    this.navigation = new NavigationController(this.images);
    this.animation = new AnimationController(this.elements.lightbox);
    this.imageManager = new ImageManager(this.elements.image, this.elements.caption);
    
    this.bindEvents();
  }

  getElements() {
    return {
      lightbox: document.querySelector(SELECTORS.LIGHTBOX),
      image: document.querySelector(SELECTORS.IMAGE),
      caption: document.querySelector(SELECTORS.CAPTION)
    };
  }

  collectImages() {
    return Array.from(document.querySelectorAll(SELECTORS.TRIGGER))
      .map(Utils.parseImageData);
  }

  bindEvents() {
    // Event delegation
    document.addEventListener('click', this.handleClick.bind(this));
    document.addEventListener('keydown', Utils.debounce(this.handleKeydown.bind(this), TIMING.DEBOUNCE));
    
    // Touch events for mobile drag
    this.elements.lightbox.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    this.elements.lightbox.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  handleClick(e) {
    const actions = {
      [SELECTORS.TRIGGER]: () => this.open(parseInt(e.target.closest(SELECTORS.TRIGGER).dataset.index)),
      [SELECTORS.CLOSE]: () => this.close(),
      [SELECTORS.PREV]: () => this.navigate('prev'),
      [SELECTORS.NEXT]: () => this.navigate('next')
    };

    const target = Object.keys(actions).find(selector => 
      e.target.closest(selector) || e.target === this.elements.lightbox
    );

    if (target) {
      e.preventDefault();
      actions[target]();
    }
  }

  handleKeydown(e) {
    if (!this.isOpen()) return;

    const keyActions = {
      'Escape': () => this.close(),
      'ArrowLeft': () => this.navigate('prev'),
      'ArrowRight': () => this.navigate('next')
    };

    keyActions[e.key]?.();
  }

  open(index) {
    this.navigation.setIndex(index);
    this.imageManager.update(this.navigation.getCurrentImage());
    this.updateNavigationButtons();
    this.animation.show();
    Utils.toggleBodyScroll(true);
  }

  close() {
    this.animation.hide(() => Utils.toggleBodyScroll(false));
  }

  navigate(direction) {
    if (this.imageManager.isTransitioning) return;
    
    // Check boundaries before navigating
    if (direction === 'next' && this.navigation.isAtEnd()) return;
    if (direction === 'prev' && this.navigation.isAtStart()) return;
    
    const imageData = direction === 'next' 
      ? this.navigation.next() 
      : this.navigation.prev();
    
    this.imageManager.update(imageData);
    this.updateNavigationButtons();
  }

  isOpen() {
    return this.elements.lightbox.classList.contains(CLASSES.FLEX);
  }

  updateNavigationButtons() {
    const prevBtn = document.querySelector('#lightbox-prev');
    const nextBtn = document.querySelector('#lightbox-next');
    
    // Hide/show buttons based on position
    prevBtn.style.opacity = this.navigation.isAtStart() ? '0.3' : '1';
    nextBtn.style.opacity = this.navigation.isAtEnd() ? '0.3' : '1';
    
    prevBtn.style.pointerEvents = this.navigation.isAtStart() ? 'none' : 'auto';
    nextBtn.style.pointerEvents = this.navigation.isAtEnd() ? 'none' : 'auto';
  }

  handleTouchStart(e) {
    if (!this.isOpen() || e.target !== this.elements.lightbox) return;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartY = e.touches[0].clientY;
  }

  handleTouchEnd(e) {
    if (!this.isOpen() || !this.touchStartX || e.target !== this.elements.lightbox) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - this.touchStartX;
    const deltaY = touchEndY - this.touchStartY;
    
    // Only trigger if horizontal swipe is dominant and significant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        // Swipe right - previous image
        this.navigate('prev');
      } else {
        // Swipe left - next image
        this.navigate('next');
      }
    }
    
    // Reset touch coordinates
    this.touchStartX = null;
    this.touchStartY = null;
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => new Lightbox());