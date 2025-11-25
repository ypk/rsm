const fs = require('fs');
const path = require('path');
const siteConfig = require('../src/data/siteConfig.json');

class BingVerificationFileGenerator {
  constructor(config) {
    this.verificationString = config.seo?.bingSiteVerification;
    if (!this.verificationString) {
      throw new Error('No Bing site verification string found in siteConfig.json');
    }
    this.outputPath = path.join(__dirname, '../public', `${this.verificationString}.txt`);
  }

  generate() {
    fs.writeFileSync(this.outputPath, this.verificationString);
    console.log(`Bing verification file created: ${this.outputPath}`);
  }
}

// --- Main ---
const generator = new BingVerificationFileGenerator(siteConfig);
generator.generate();
