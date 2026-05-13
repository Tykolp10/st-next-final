import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Add count-up
content = re.sub(r'(<span)( style="font-family: \'Roboto\', sans-serif; font-size: 3rem; font-weight: 700; color: var\(--gold\); line-height: 1;">(?:34|8600\+|100%)</span>)', r'\1 class="count-up"\2', content)
content = re.sub(r'(<span class="stat-num)(>10</span>)', r'\1 count-up\2', content)
content = re.sub(r'(<span class="stat-num)(>700\+</span>)', r'\1 count-up\2', content)
content = re.sub(r'(<span class="stat-num)(>70\+</span>)', r'\1 count-up\2', content)

# Timeline epic class
content = content.replace('<div class="timeline__item reveal-left">', '<div class="timeline__item timeline-epic">')
content = content.replace('<div class="timeline__item reveal-right">', '<div class="timeline__item timeline-epic">')
# Change the container to trigger intersection observer
content = content.replace('<div class="timeline">', '<div class="timeline" id="timeline-container">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)
