const fs = require('fs');
const path = require('path');
const siteConfig = require('../src/data/siteConfig.json');


class PostalAddress {
  constructor(streetAddress, addressLocality, postalCode, addressCountry = 'GB') {
    this['@type'] = 'PostalAddress';
    this.streetAddress = streetAddress;
    this.addressLocality = addressLocality;
    this.postalCode = postalCode;
    this.addressCountry = addressCountry;
  }
}

class ContactPoint {
  constructor(telephone, contactType, areaServed, availableLanguage = ['English']) {
    this['@type'] = 'ContactPoint';
    this.telephone = telephone;
    this.contactType = contactType;
    this.areaServed = areaServed;
    this.availableLanguage = availableLanguage;
  }
}

class Organization {
  constructor({ name, url, email, telephone, address, contactPoints }) {
    this['@context'] = 'https://schema.org';
    this['@type'] = 'Organization';
    this.name = name;
    this.url = url;
    this.email = email;
    this.telephone = telephone;
    this.address = address;
    this.contactPoint = contactPoints;
  }
}

// Prepare address fields
const businessAddress = siteConfig.common.business.address;
const addressLines = businessAddress.split('\n');
const streetAddress = addressLines[0];
const addressLocality = addressLines[1];
const postalCode = addressLines[2];
const businessPhone = siteConfig.common.business.phone;
const phoneInternational = '+44' + businessPhone.replace(/\D/g, '').replace(/^0/, '');
const businessServiceArea = siteConfig.common.business.serviceArea;

const address = new PostalAddress(streetAddress, addressLocality, postalCode);
const contactPoint = new ContactPoint(
  phoneInternational,
  'customer service',
  businessServiceArea
);
const organization = new Organization({
  name: siteConfig.common.site.name,
  url: siteConfig.common.site.url,
  email: siteConfig.common.business.email,
  telephone: phoneInternational,
  address,
  contactPoints: [contactPoint]
});

const output = JSON.stringify(organization, null, 2);
const outPath = path.join(__dirname, '../public/schema-org.json');
fs.writeFileSync(outPath, output);
console.log('Schema.org JSON-LD generated at', outPath);
