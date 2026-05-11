// ===== AGE GATE =====
const ageGate = document.getElementById('age-gate');
const mainSite = document.getElementById('main-site');
const ageYes = document.getElementById('age-yes');
const ageNo = document.getElementById('age-no');

if (sessionStorage.getItem('st-age-verified')) {
  ageGate.style.display = 'none';
  mainSite.classList.remove('hidden');
} else {
  ageYes.addEventListener('click', () => {
    sessionStorage.setItem('st-age-verified', '1');
    ageGate.style.opacity = '0';
    ageGate.style.transition = 'opacity 0.8s ease';
    setTimeout(() => { ageGate.style.display = 'none'; }, 800);
    mainSite.classList.remove('hidden');
    mainSite.style.opacity = '0';
    setTimeout(() => { mainSite.style.transition = 'opacity 0.6s'; mainSite.style.opacity = '1'; }, 50);
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
  rootMargin: '0px 0px -15% 0px',
  threshold: 0
};
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const delay = entry.target.dataset.delay ? parseInt(entry.target.dataset.delay) : 0;
    if (entry.isIntersecting) {
      if (delay > 0) {
        setTimeout(() => entry.target.classList.add('visible'), delay);
      } else {
        entry.target.classList.add('visible');
      }
    } else {
      // Menghapus class agar bisa muncul lagi ketika di-scroll kembali
      entry.target.classList.remove('visible');
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
const WA_NUMBER = '6281335730002'; // Nomor WA resmi ST (tanpa +)
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const nama  = form.nama.value.trim();
    const email = form.email.value.trim();
    const pesan = form.pesan.value.trim();
    if (!nama || !pesan) {
      formNote.textContent = '⚠ Mohon isi Nama dan Pesan terlebih dahulu.';
      formNote.style.color = '#cc8a2a';
      return;
    }
    const text =
      `*Pesan dari Website ST Sehat Tentrem*%0A%0A` +
      `*Nama:* ${encodeURIComponent(nama)}%0A` +
      (email ? `*Email:* ${encodeURIComponent(email)}%0A` : '') +
      `*Pesan:*%0A${encodeURIComponent(pesan)}`;
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${text}`;
    window.open(waUrl, '_blank', 'noopener');
    formNote.textContent = '✓ Membuka WhatsApp... Lanjutkan kirim pesan dari aplikasi WA Anda.';
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
