const toggle = document.querySelector('.chapters-toggle');
const nav = document.querySelector('.chapter-nav');
const main = document.querySelector('main');

const chapters = [
  ['1', '#chapter-1'],
  ['2', '#chapter-2'],
  ['3', '#chapter-3'],
  ['4', '#chapter-4'],
  ['5', '#chapter-5'],
  ['6', '#chapter-6'],
  ['7', '#chapter-7'],
  ['8', '#chapter-8'],
  ['9', '#chapter-9'],
  ['10', '#chapter-10'],
  ['11', '#chapter-11'],
  ['12', '#chapter-12']
];

const chapterFiles = chapters.slice(1).map(([number]) => [number, `chapter-${number}.html`]);

async function openChapters() {
  // Remove old placeholder/interlude chapters.
  main.querySelectorAll('.placeholder, .interlude').forEach(el => el.remove());

  // Remove any previously loaded real chapters so the function is safe to rerun.
  main.querySelectorAll('.real-chapter:not(#chapter-1)').forEach(el => el.remove());

  // Keep the chapters together directly after chapter 1.
  const chapter1 = document.querySelector('#chapter-1');
  let anchor = chapter1;

  for (const [, file] of chapterFiles) {
    try {
      const response = await fetch(file);
      if (!response.ok) continue;

      const html = await response.text();
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const section = template.content.firstElementChild;

      if (section) {
        anchor.insertAdjacentElement('afterend', section);
        anchor = section;
      }
    } catch (error) {
      console.warn(`Не удалось загрузить ${file}`, error);
    }
  }

  // Rebuild the table of contents with Arabic numbers.
  nav.querySelectorAll('a').forEach(link => link.remove());
  chapters.forEach(([number, href]) => {
    const link = document.createElement('a');
    link.href = href;
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

toggle.addEventListener('click', async () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-hidden', !open);
  toggle.textContent = open ? 'закрыть' : 'главы';

  if (open) await openChapters();
});

// Load the real chapters immediately, without waiting for the menu to open.
openChapters();
