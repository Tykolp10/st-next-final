// assets/js/config.js
const ST_CONFIG = {
  storeLocatorUrl: document.querySelector('meta[name="store-locator-url"]')?.content
    || 'https://info-st.com/location',

  whatsappNumber: document.querySelector('meta[name="whatsapp-fallback"]')?.content
    || '6281335730002',

  // UTM defaults — wajib di semua redirect
  utmDefaults: {
    utm_source: 'st-proto',
    utm_medium: 'website'
  },

  // Build URL helper — gunakan ini di SEMUA CTA store locator
  buildStoreLocatorUrl(params = {}) {
    const url = new URL(this.storeLocatorUrl);
    const allParams = { ...this.utmDefaults, ...params };
    Object.entries(allParams).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
    return url.toString();
  },

  // WA fallback helper
  buildWhatsappUrl(message) {
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }
};
