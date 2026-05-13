import re

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Age Gate to include epic hero entrance
age_gate_search = """if (sessionStorage.getItem('st-age-verified')) {
  ageGate.style.display = 'none';
  mainSite.classList.remove('hidden');
} else {"""
age_gate_replace = """function playEpicHeroEntrance() {
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
  document.addEventListener('DOMContentLoaded', playEpicHeroEntrance);
} else {"""

content = content.replace(age_gate_search, age_gate_replace)

# Also patch the playEpicHeroEntrance inside ageYes
yes_search = """    setTimeout(() => { mainSite.style.transition = 'opacity 0.6s'; mainSite.style.opacity = '1'; }, 50);"""
yes_replace = """    setTimeout(() => { 
      mainSite.style.transition = 'opacity 0.6s'; 
      mainSite.style.opacity = '1'; 
      playEpicHeroEntrance();
    }, 50);"""

content = content.replace(yes_search, yes_replace)

# 2. Update Scroll Reveal
reveal_search = """const revealOptions = {
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
}, revealOptions);"""

reveal_replace = """// Set initial states so elements don't flicker before observer fires
revealEls.forEach(el => {
  el.style.opacity = 0;
  if (el.classList.contains('reveal-up')) el.style.transform = 'translateY(50px)';
  if (el.classList.contains('reveal-left')) el.style.transform = 'translateX(-50px)';
  if (el.classList.contains('reveal-right')) el.style.transform = 'translateX(50px)';
});

const revealOptions = {
  root: null,
  rootMargin: '0px 0px -10% 0px',
  threshold: 0
};

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;
      
      let translateX = 0;
      let translateY = 0;
      if (el.classList.contains('reveal-up')) translateY = [50, 0];
      if (el.classList.contains('reveal-left')) translateX = [-50, 0];
      if (el.classList.contains('reveal-right')) translateX = [50, 0];
      
      if (typeof anime !== 'undefined') {
        anime({
          targets: el,
          opacity: [0, 1],
          translateX: translateX || 0,
          translateY: translateY || 0,
          duration: 1200,
          delay: delay,
          easing: 'easeOutElastic(1, .8)'
        });
      } else {
        el.style.transition = 'all 1s ease';
        el.style.opacity = 1;
        el.style.transform = 'translate(0,0)';
      }
      
      obs.unobserve(el);
    }
  });
}, revealOptions);"""

content = content.replace(reveal_search, reveal_replace)

# 3. Epic modal Open
modal_open_search = """    e.preventDefault();
    locatorModal.classList.add('is-open');
    locatorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('locator-input').focus(), 300);"""

modal_open_replace = """    e.preventDefault();
    locatorModal.classList.add('is-open');
    locatorModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    if (typeof anime !== 'undefined') {
      anime({
        targets: locatorModal.querySelector('.locator-modal__content'),
        translateY: [20, 0],
        scale: [0.95, 1],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutElastic(1, .6)'
      });
      anime({
        targets: locatorModal.querySelectorAll('.city-chip'),
        scale: [0.8, 1],
        opacity: [0, 1],
        delay: anime.stagger(50, {start: 300}),
        duration: 600,
        easing: 'easeOutBack'
      });
    }
    
    setTimeout(() => document.getElementById('locator-input').focus(), 300);"""

content = content.replace(modal_open_search, modal_open_replace)

# 4. Epic modal Close
modal_close_search = """  function closeLocator() {
    locatorModal.classList.remove('is-open');
    locatorModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }"""

modal_close_replace = """  function closeLocator() {
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
  }"""

content = content.replace(modal_close_search, modal_close_replace)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched main.js")
