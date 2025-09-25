// hero.js - SOLID version, reads hero images from data-hero-images attribute
class HeroRandomizer {
  constructor(imageSelector, dataSelector) {
    this.imageSelector = imageSelector;
    this.dataSelector = dataSelector;
    this.imgEl = null;
    this.images = [];
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => {
      const heroDiv = document.querySelector(this.dataSelector);
      this.imgEl = document.querySelector(this.imageSelector);
      if (!heroDiv || !this.imgEl) return;
      try {
        this.images = JSON.parse(heroDiv.getAttribute('data-hero-images'));
      } catch (e) {
        this.images = [];
      }
      if (!Array.isArray(this.images) || this.images.length === 0) return;
      const random = this.images[Math.floor(Math.random() * this.images.length)];
      this.imgEl.src = random.src;
      this.imgEl.className = `w-full h-full object-cover ${random.class || ''}`;
    });
  }
}

// Usage
const hero = new HeroRandomizer('.hero-image img', '.hero-image[data-hero-images]');
hero.init();
