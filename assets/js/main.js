// ===== DEVICE DETECTOR & CLASS TOGGLER =====
function updateDeviceClasses() {
  const width = window.innerWidth;
  const body = document.body;
  if (!body) return;
  
  body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
  
  if (width < 640) {
    body.classList.add('is-mobile');
  } else if (width >= 640 && width < 1024) {
    body.classList.add('is-tablet');
  } else {
    body.classList.add('is-desktop');
  }
}
window.addEventListener('resize', updateDeviceClasses);
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateDeviceClasses);
} else {
  updateDeviceClasses();
}

// ===== AGE GATE =====
const ageGate = document.getElementById('age-gate');
const mainSite = document.getElementById('main-site');
const ageYes = document.getElementById('age-yes');
const ageNo = document.getElementById('age-no');

function playEpicHeroEntrance() {
  if (typeof anime === 'undefined') return;
  anime({
    targets: '.hero__title-img',
    scale: [0.85, 1],
    opacity: [0, 1],
    duration: 1800,
    easing: 'easeOutElastic(1, .6)',
    delay: 200
  });
  anime({
    targets: ['.hero__eyebrow', '.hero__subtitle', '.hero__content .btn', '.hero__content a'],
    translateY: [20, 0],
    opacity: [0, 1],
    duration: 1200,
    delay: anime.stagger(150, {start: 500}),
    easing: 'easeOutExpo'
  });
  anime({
    targets: ['.sacred-bar', '.navbar'],
    translateY: [-50, 0],
    opacity: [0, 1],
    duration: 1200,
    delay: anime.stagger(100),
    easing: 'easeOutExpo'
  });
}

if (sessionStorage.getItem('st-age-verified')) {
  ageGate.style.display = 'none';
  mainSite.classList.remove('hidden');
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', playEpicHeroEntrance);
  } else {
    playEpicHeroEntrance();
  }
} else {
  ageYes.addEventListener('click', () => {
    sessionStorage.setItem('st-age-verified', '1');
    ageGate.style.opacity = '0';
    ageGate.style.transition = 'opacity 0.8s ease';
    setTimeout(() => { ageGate.style.display = 'none'; }, 800);
    mainSite.classList.remove('hidden');
    mainSite.style.opacity = '0';
    setTimeout(() => { 
      mainSite.style.transition = 'opacity 0.6s'; 
      mainSite.style.opacity = '1'; 
      playEpicHeroEntrance();
    }, 50);
  });
  ageNo.addEventListener('click', () => {
    // Lebih lembut: tampilkan pesan terima kasih, jangan langsung redirect
    document.querySelector('.age-gate__content').innerHTML =
      '<p class="age-gate__tagline">Terima Kasih</p>' +
      '<h2 class="age-gate__title">Sampai Jumpa Lagi</h2>' +
      '<p class="age-gate__desc">Situs ini hanya untuk pengunjung dewasa berusia 21 tahun ke atas. ' +
      'Terima kasih atas kunjungan Anda.</p>' +
      '<p class="age-gate__warning">Merokok membunuh. Iklan ini ditujukan untuk perokok dewasa.</p>';
  });
  // Auto-focus tombol "Ya" untuk keyboard nav
  setTimeout(() => ageYes && ageYes.focus(), 100);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ===== HAMBURGER + BACKDROP =====
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');
const navBackdrop = document.getElementById('nav-backdrop');

function setMenuOpen(open) {
  mainNav.classList.toggle('open', open);
  hamburger.classList.toggle('is-open', open);
  navBackdrop.classList.toggle('is-visible', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', () => {
  setMenuOpen(!mainNav.classList.contains('open'));
});
navBackdrop.addEventListener('click', () => setMenuOpen(false));
mainNav.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => setMenuOpen(false));
});
// Close mobile menu dengan Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mainNav.classList.contains('open')) setMenuOpen(false);
});

// ===== HERO SLIDER =====
const slides = document.querySelectorAll('.hero__slide');
const dots = document.querySelectorAll('.hero__dot');
const heroSection = document.getElementById('hero');
let currentSlide = 0;
let sliderTimer;
const SLIDE_INTERVAL = 5500;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  const activeDot = dots[currentSlide];
  activeDot.classList.remove('active');
  void activeDot.offsetWidth;
  activeDot.classList.add('active');
}

function startSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => goToSlide(currentSlide + 1), SLIDE_INTERVAL);
}
function pauseSlider() { clearInterval(sliderTimer); }

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.idx));
    startSlider();
  });
});

// Pause-on-hover
heroSection.addEventListener('mouseenter', pauseSlider);
heroSection.addEventListener('mouseleave', startSlider);

// Keyboard navigation (←/→) saat hero terlihat
document.addEventListener('keydown', e => {
  const heroVisible = heroSection.getBoundingClientRect().bottom > 0;
  if (!heroVisible) return;
  if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); startSlider(); }
  if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); startSlider(); }
});

startSlider();

// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealOptions = {
  root: null,
  rootMargin: '0px 0px -8% 0px',
  threshold: 0
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const el = entry.target;
    if (entry.isIntersecting) {
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      if (delay > 0) {
        if (el.dataset.timeoutId) {
          clearTimeout(parseInt(el.dataset.timeoutId));
        }
        const timeoutId = setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        el.dataset.timeoutId = timeoutId;
      } else {
        el.classList.add('visible');
      }
    } else {
      if (el.dataset.timeoutId) {
        clearTimeout(parseInt(el.dataset.timeoutId));
        el.dataset.timeoutId = '';
      }
      el.classList.remove('visible');
    }
  });
}, revealOptions);

revealEls.forEach(el => revealObserver.observe(el));

// ===== SMOOTH NAV SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#' || href.length < 2) return; // skip dummy links
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ===== CONTACT FORM → WHATSAPP =====
const form = document.getElementById('contact-form');
const formNote = document.getElementById('form-note');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama = form.nama.value.trim();
    const email = form.email.value.trim();
    const kategori = form.kategori.value;
    const pesan = form.pesan.value.trim();
    
    if (!nama || !pesan || !kategori) {
      formNote.textContent = '⚠ Mohon isi Kategori, Nama, dan Pesan.';
      formNote.style.color = '#cc8a2a';
      return;
    }

    const templates = {
      stok: `Halo min, saya ingin tanya tentang stok produk.`,
      agen: `Halo min, saya tertarik untuk menjadi agen/mitra distribusi resmi Sehat Tentrem.`,
      kerjasama: `Halo min, kami tertarik untuk berkolaborasi / menjalin kerjasama.`,
      media: `Halo min, saya ingin menanyakan perihal kemitraan media.`,
      lainnya: `Halo min, saya ingin menyampaikan hal berikut.`
    };

    const kategoriLabels = {
      stok: 'Pertanyaan Stok / Distribusi',
      agen: 'Jadi Agen / Mitra Distribusi',
      kerjasama: 'Kolaborasi / Kerjasama',
      media: 'Pertanyaan Media',
      lainnya: 'Lainnya'
    };
    const kategoriLabel = kategoriLabels[kategori] || kategori;

    const messageText =
      `*Pesan dari Website InfoST*\n\n` +
      `*Pengirim:* ${nama}\n` +
      (email ? `*Email:* ${email}\n` : '') +
      `*Kategori:* ${kategoriLabel}\n\n` +
      `*Pesan:*\n${templates[kategori] ? templates[kategori] + '\n' : ''}${pesan}`;
      
    // ST_CONFIG loaded from config.js
    const waUrl = typeof ST_CONFIG !== 'undefined' 
      ? ST_CONFIG.buildWhatsappUrl(messageText) 
      : `https://wa.me/6281335730002?text=${encodeURIComponent(messageText)}`;
      
    window.open(waUrl, '_blank', 'noopener');
    formNote.textContent = '✓ Membuka WhatsApp...';
    formNote.style.color = 'var(--gold)';
  });
}

// ===== ACTIVE NAV HIGHLIGHT (class-based) =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${current}`);
  });
}, { passive: true });

// ===== PRODUCT FILTER =====
const filterChips = document.querySelectorAll('.filter-chip');
const productCards = document.querySelectorAll('#products-grid .product-card');
filterChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const filter = chip.dataset.filter;
    filterChips.forEach(c => {
      c.classList.toggle('is-active', c === chip);
      c.setAttribute('aria-selected', c === chip ? 'true' : 'false');
    });
    productCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

// ===== BACK TO TOP =====
const backTop = document.getElementById('back-to-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('is-visible', window.scrollY > 600);
  }, { passive: true });
  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== STORE LOCATOR PROTOTYPE LOGIC =====
if (typeof ST_CONFIG !== 'undefined') {
  const locatorModal = document.getElementById('locator-modal');
  const locatorClose = document.getElementById('locator-close');
  const locatorBg = document.getElementById('locator-bg');
  const locatorForm = document.getElementById('locator-form');
  const locatorInput = document.getElementById('locator-input');

  function openLocator(utmCampaign = 'general', utmContent = 'button-click') {
    // Redirect langsung ke URL luar dengan parameter UTM sesuai feedback atasan
    const targetUrl = ST_CONFIG.buildStoreLocatorUrl({
      utm_campaign: utmCampaign,
      utm_content: utmContent
    });
    window.open(targetUrl, '_blank', 'noopener');
  }

  function closeLocator() {
    if (!locatorModal) return;
    if (typeof anime !== 'undefined') {
      anime({
        targets: locatorModal.querySelector('.locator-modal__content'),
        scale: [1, 0.95],
        opacity: [1, 0],
        duration: 300,
        easing: 'easeInSine',
        complete: () => {
          locatorModal.classList.remove('is-open');
          locatorModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
          locatorModal.querySelector('.locator-modal__content').style.opacity = 1;
          locatorModal.querySelector('.locator-modal__content').style.transform = 'translateY(20px)';
        }
      });
    } else {
      locatorModal.classList.remove('is-open');
      locatorModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (locatorClose) locatorClose.addEventListener('click', closeLocator);
  if (locatorBg) locatorBg.addEventListener('click', closeLocator);

  // Close on ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && locatorModal && locatorModal.classList.contains('is-open')) {
      closeLocator();
    }
  });

  // Handle Form Submit
  if (locatorForm) {
    locatorForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = locatorInput.value.trim();
      const campaign = locatorForm.dataset.utmCampaign || 'modal-search';
      const content = locatorForm.dataset.utmContent || 'submit';
      const targetUrl = ST_CONFIG.buildStoreLocatorUrl({
        utm_campaign: campaign,
        utm_content: content,
        city: city || undefined
      });
      window.open(targetUrl, '_blank', 'noopener');
      closeLocator();
    });
  }

  // Handle City Chips
  if (locatorModal) {
    locatorModal.querySelectorAll('.city-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const city = chip.textContent.trim();
        if (locatorInput) {
          locatorInput.value = city;
          // Trigger form submit
          const submitEvent = new Event('submit', { cancelable: true });
          locatorForm.dispatchEvent(submitEvent);
        }
      });
    });
  }

  // Hero CTA Button
  const heroCtaStore = document.getElementById('hero-cta-store');
  if (heroCtaStore) {
    heroCtaStore.addEventListener('click', (e) => {
      e.preventDefault();
      openLocator('hero-cta', 'primary-button');
    });
  }

  // Product Card CTAs
  document.querySelectorAll('.product-card__overlay a, .cta-store-locator').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const product = link.dataset.product || 'general';
      const ctaType = link.dataset.ctaType || 'product-card';
      openLocator(ctaType, product);
    });
  });

  // Sticky Mobile CTA
  const stickyCtaMobile = document.getElementById('sticky-cta-mobile');
  const stickyBtn = document.getElementById('sticky-btn');
  if (stickyCtaMobile && stickyBtn) {
    stickyBtn.addEventListener('click', () => {
      openLocator('sticky-mobile', 'persistent-cta');
    });

    // Hide when hero is in view
    const heroObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        stickyCtaMobile.classList.remove('is-visible');
      } else {
        stickyCtaMobile.classList.add('is-visible');
      }
    }, { rootMargin: '-10% 0px 0px 0px', threshold: 0 });
    if (heroSection) heroObserver.observe(heroSection);
  }

  // Hero WhatsApp Fallback
  const heroWaFallback = document.getElementById('hero-wa-fallback');
  if (heroWaFallback) {
    heroWaFallback.addEventListener('click', (e) => {
      e.preventDefault();
      const city = document.getElementById('hero-city-input')?.value || '';
      const message = city
        ? `Halo ST, saya di ${city}. Bisa info di mana saya bisa beli ST di sekitar sini?`
        : `Halo ST, saya ingin tanya di mana toko ST terdekat dari lokasi saya.`;
      window.location.href = ST_CONFIG.buildWhatsappUrl(message);
    });
  }
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq__question').forEach(button => {
  button.addEventListener('click', () => {
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    const answer = button.nextElementSibling;
    if (!isExpanded) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      answer.style.maxHeight = null;
    }
  });
});

// ===== MOBILE TIMELINE ACCORDION =====
document.querySelectorAll('.timeline__title').forEach(title => {
  title.addEventListener('click', () => {
    if (window.innerWidth <= 640) {
      const item = title.closest('.timeline__item');
      item.classList.toggle('is-open');
    }
  });
});



// ===== EPIC COUNTER (Anime.js) =====
const countUpEls = document.querySelectorAll('.count-up');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      
      const text = el.textContent;
      const numMatches = text.match(/(\d+)/);
      if (!numMatches) return;
      const targetNum = parseInt(numMatches[0]);
      const suffix = text.replace(numMatches[0], '');
      
      const obj = { val: 0 };
      anime({
        targets: obj,
        val: targetNum,
        round: 1,
        duration: 2500,
        easing: 'easeOutExpo',
        update: function() {
          el.textContent = obj.val + suffix;
        }
      });
      obs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
countUpEls.forEach(el => counterObserver.observe(el));

// ===== EPIC TIMELINE OVERVIEW (Anime.js) =====
const timelineContainer = document.getElementById('timeline-container');
if (timelineContainer) {
  const items = timelineContainer.querySelectorAll('.timeline-epic');
  const dots = timelineContainer.querySelectorAll('.timeline__dot');
  items.forEach(item => { item.style.opacity = 0; item.style.transform = 'translateY(80px) scale(0.9)'; });
  dots.forEach(dot => { dot.style.opacity = 0; dot.style.transform = 'scale(0)'; });
  
  const timelineObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (timelineContainer.dataset.animated) return;
        timelineContainer.dataset.animated = 'true';
        
        const items = timelineContainer.querySelectorAll('.timeline-epic');
        const dots = timelineContainer.querySelectorAll('.timeline__dot');
        
        // Timeline Animation
        const tl = anime.timeline({
          easing: 'easeOutElastic(1, .6)'
        });
        
        tl.add({
          targets: dots,
          scale: [0, 1],
          opacity: [0, 1],
          delay: anime.stagger(150),
          duration: 800
        }).add({
          targets: items,
          translateY: [80, 0],
          scale: [0.9, 1],
          opacity: [0, 1],
          delay: anime.stagger(150),
          duration: 1200
        }, '-=600');
        
        obs.unobserve(timelineContainer);
      }
    });
  }, { threshold: 0.2 });
  timelineObserver.observe(timelineContainer);
}
