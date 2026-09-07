const toggle = document.querySelector('.chapters-toggle');
const nav = document.querySelector('.chapter-nav');
const main = document.querySelector('main');

const chapters = Array.from({ length: 14 }, (_, i) => String(i + 1));

function buildChapterNav() {
  nav.querySelectorAll('a').forEach(link => link.remove());
  chapters.forEach(number => {
    const link = document.createElement('a');
    link.href = `#chapter-${number}`;
    link.textContent = number;
    link.addEventListener('click', closeNav);
    nav.appendChild(link);
  });
}

function closeNav() {
  nav.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-hidden', 'true');
  toggle.textContent = 'главы';
}

async function openChapters() {
  main.querySelectorAll('.chapter:not(#chapter-1), .interlude').forEach(el => el.remove());

  const chapter1 = document.querySelector('#chapter-1');
  if (!chapter1) return;

  const firstNumber = chapter1.querySelector('.chapter-number');
  if (firstNumber) firstNumber.textContent = '1';

  let anchor = chapter1;

  for (const number of chapters.slice(1)) {
    try {
      const response = await fetch(`chapter-${number}.html?v=14`, { cache: 'no-store' });
      if (!response.ok) {
        console.warn(`Глава ${number} не найдена: ${response.status}`);
        continue;
      }

      const html = await response.text();
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const section = template.content.firstElementChild;
      if (!section) continue;

      const chapterNumber = section.querySelector('.chapter-number');
      if (chapterNumber) chapterNumber.textContent = number;

      anchor.insertAdjacentElement('afterend', section);
      anchor = section;
    } catch (error) {
      console.warn(`Не удалось загрузить главу ${number}`, error);
    }
  }
}

buildChapterNav();

toggle.addEventListener('click', async () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-hidden', !open);
  toggle.textContent = open ? 'закрыть' : 'главы';

  if (open) await openChapters();
});

openChapters();
