const toggle = document.querySelector('.chapters-toggle');
const nav = document.querySelector('.chapter-nav');

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
  nav.setAttribute('aria-hidden', !open);
  toggle.textContent = open ? 'закрыть' : 'главы';
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', false);
    nav.setAttribute('aria-hidden', true);
    toggle.textContent = 'главы';
  });
});
