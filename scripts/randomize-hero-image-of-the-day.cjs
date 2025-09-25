const fs = require('fs');
const path = require('path');

class ConfigRepository {
  constructor(configPath) {
    this.configPath = configPath;
  }
  load() {
    return JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
  }
  save(config) {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }
}

class HeroImagePicker {
  constructor(images) {
    if (!Array.isArray(images) || images.length === 0) {
      throw new Error('No hero images provided');
    }
    this.images = images;
  }
  pickRandom() {
    return this.images[Math.floor(Math.random() * this.images.length)];
  }
}

class HeroImageOfTheDayService {
  constructor(configRepo) {
    this.configRepo = configRepo;
  }
  updateImageOfTheDay() {
    const config = this.configRepo.load();
    const heroImages = config.sections.hero.heroImages;
    const picker = new HeroImagePicker(heroImages);
    const chosen = picker.pickRandom();
    config.sections.hero.imageOfTheDay = chosen;
    this.configRepo.save(config);
    console.log(`Updated imageOfTheDay to: ${JSON.stringify(chosen)}`);
  }
}

// --- Main ---
const configPath = path.join(__dirname, '../src/data/siteConfig.json');
const configRepo = new ConfigRepository(configPath);
const service = new HeroImageOfTheDayService(configRepo);
service.updateImageOfTheDay();
