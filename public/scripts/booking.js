// Booking popup functionality

// Constants
const SELECTORS = {
  POPUP: '#booking-popup',
  CLOSE: '#booking-close',
  FORM: '#booking-form',
  NAME: '#student-name',
  DATE: '#lesson-date',
  TYPE: '#lesson-type',
  EMAIL: '#contact-email',
  SMS: '#contact-sms',
  WHATSAPP: '#contact-whatsapp',
};

const CLASSES = {
  HIDDEN: 'hidden',
  FLEX: 'flex',
  OPACITY_0: 'opacity-0',
  SCALE_95: 'scale-95',
};

const TIMING = {
  TRANSITION: 300,
};

// Business configuration
const BUSINESS = {
  phone: '07832185711',
  email: 'mouradakkache@yahoo.com',
  name: 'Right School of Motoring',
};

// Utility functions
const Utils = {
  toggleBodyScroll(lock = true) {
    document.body.style.overflow = lock ? 'hidden' : '';
  },

  setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3); // 3 months from now
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const dateInput = document.querySelector(SELECTORS.DATE);
    dateInput?.setAttribute('min', today);
    dateInput?.setAttribute('max', maxDateStr);
  },

  validateForm(name, date) {
    if (!name || !date) {
      alert('Please fill in your name and preferred date first.');
      return false;
    }
    return true;
  },
};

// Animation controller
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

// Message generator
class MessageGenerator {
  getLessonTypeLabel(typeValue) {
    const selectElement = document.querySelector(SELECTORS.TYPE);
    const option = selectElement?.querySelector(`option[value="${typeValue}"]`);
    return option?.textContent || typeValue;
  }

  generate(name, date, type) {
    const lessonTypeLabel = this.getLessonTypeLabel(type);

    return `Hi ${BUSINESS.name},

I would like to book a driving lesson:

- Name: ${name}
- Preferred Date: ${date}
- Lesson Type: ${lessonTypeLabel}

Please let me know your availability.

Thank you!`;
  }
}

// Contact handler
class ContactHandler {
  constructor(messageGenerator) {
    this.messageGenerator = messageGenerator;
  }

  handle(method, name, date, type) {
    if (!Utils.validateForm(name, date)) return;

    const message = this.messageGenerator.generate(name, date, type);
    const encodedMessage = encodeURIComponent(message);

    const urls = {
      email: `mailto:${BUSINESS.email}?subject=${encodeURIComponent('Driving Lesson Booking Request')}&body=${encodedMessage}`,
      sms: `sms:${BUSINESS.phone}?body=${encodedMessage}`,
      whatsapp: `https://wa.me/44${BUSINESS.phone.substring(1)}?text=${encodedMessage}`,
    };

    const url = urls[method];
    if (url) {
      window.open(url, '_blank');
      return true;
    }
    return false;
  }
}

// Main booking popup class
export class BookingPopup {
  constructor() {
    this.elements = this.getElements();
    this.animation = new AnimationController(this.elements.popup);
    this.messageGenerator = new MessageGenerator();
    this.contactHandler = new ContactHandler(this.messageGenerator);

    this.bindEvents();
  }

  getElements() {
    return {
      popup: document.querySelector(SELECTORS.POPUP),
      closeBtn: document.querySelector(SELECTORS.CLOSE),
      form: document.querySelector(SELECTORS.FORM),
      nameInput: document.querySelector(SELECTORS.NAME),
      dateInput: document.querySelector(SELECTORS.DATE),
      typeSelect: document.querySelector(SELECTORS.TYPE),
    };
  }

  bindEvents() {
    // Close button only
    this.elements.closeBtn?.addEventListener('click', () => this.close());

    // Contact method buttons
    document
      .querySelector(SELECTORS.EMAIL)
      ?.addEventListener('click', () => this.handleContact('email'));
    document
      .querySelector(SELECTORS.SMS)
      ?.addEventListener('click', () => this.handleContact('sms'));
    document
      .querySelector(SELECTORS.WHATSAPP)
      ?.addEventListener('click', () => this.handleContact('whatsapp'));

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  open(lessonType = null) {
    Utils.setMinDate();

    // Pre-select lesson type if provided
    if (lessonType && this.elements.typeSelect) {
      this.elements.typeSelect.value = lessonType;
    }

    this.animation.show();
    Utils.toggleBodyScroll(true);
  }

  close() {
    this.animation.hide(() => {
      Utils.toggleBodyScroll(false);
      this.elements.form?.reset();
    });
  }

  handleContact(method) {
    const name = this.elements.nameInput?.value;
    const date = this.elements.dateInput?.value;
    const type = this.elements.typeSelect?.value;

    if (this.contactHandler.handle(method, name, date, type)) {
      this.close();
    }
  }

  isOpen() {
    return this.elements.popup?.classList.contains(CLASSES.FLEX);
  }
}

// Global function for opening popup
window.openBookingPopup = (lessonType = null) => {
  if (window.bookingPopupInstance) {
    window.bookingPopupInstance.open(lessonType);
  }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.bookingPopupInstance = new BookingPopup();
});
