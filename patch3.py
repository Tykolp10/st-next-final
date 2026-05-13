import re

with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Append Counter & Epic Timeline at the end
additional_js = """
// ===== EPIC COUNTER (Anime.js) =====
const countUpEls = document.querySelectorAll('.count-up');
const counterObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      if (el.dataset.counted) return;
      el.dataset.counted = 'true';
      
      const text = el.textContent;
      const numMatches = text.match(/(\\d+)/);
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
  const timelineObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (timelineContainer.dataset.animated) return;
        timelineContainer.dataset.animated = 'true';
        
        // Hide elements initially via CSS or JS
        const items = timelineContainer.querySelectorAll('.timeline-epic');
        const dots = timelineContainer.querySelectorAll('.timeline__dot');
        
        items.forEach(item => { item.style.opacity = 0; item.style.transform = 'translateY(80px) scale(0.9)'; });
        dots.forEach(dot => { dot.style.opacity = 0; dot.style.transform = 'scale(0)'; });
        
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
"""

with open('assets/js/main.js', 'a', encoding='utf-8') as f:
    f.write(additional_js)
