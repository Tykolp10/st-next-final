with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

search = """        // Hide elements initially via CSS or JS
        const items = timelineContainer.querySelectorAll('.timeline-epic');
        const dots = timelineContainer.querySelectorAll('.timeline__dot');
        
        items.forEach(item => { item.style.opacity = 0; item.style.transform = 'translateY(80px) scale(0.9)'; });
        dots.forEach(dot => { dot.style.opacity = 0; dot.style.transform = 'scale(0)'; });"""

replace = """        const items = timelineContainer.querySelectorAll('.timeline-epic');
        const dots = timelineContainer.querySelectorAll('.timeline__dot');"""

content = content.replace(search, replace)

initial_hide = """// ===== EPIC TIMELINE OVERVIEW (Anime.js) =====
const timelineContainer = document.getElementById('timeline-container');
if (timelineContainer) {
  const items = timelineContainer.querySelectorAll('.timeline-epic');
  const dots = timelineContainer.querySelectorAll('.timeline__dot');
  items.forEach(item => { item.style.opacity = 0; item.style.transform = 'translateY(80px) scale(0.9)'; });
  dots.forEach(dot => { dot.style.opacity = 0; dot.style.transform = 'scale(0)'; });
  
  const timelineObserver = new IntersectionObserver((entries, obs) => {"""

content = content.replace("""// ===== EPIC TIMELINE OVERVIEW (Anime.js) =====
const timelineContainer = document.getElementById('timeline-container');
if (timelineContainer) {
  const timelineObserver = new IntersectionObserver((entries, obs) => {""", initial_hide)

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(content)
