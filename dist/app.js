const root = document.documentElement;
const themeButton = document.querySelector('.theme-toggle');
function syncThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  document.querySelector('meta[name="theme-color"]').content = dark ? '#17151e' : '#faf9fc';
}
syncThemeLabel();
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('nattakit-theme', root.dataset.theme); } catch (error) {}
  syncThemeLabel();
});
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
function closeMenu() {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  let visible = 0;
  document.querySelectorAll('.project-card').forEach(card => {
    card.hidden = selected !== 'all' && card.dataset.category !== selected;
    if (!card.hidden) visible++;
  });
  document.querySelectorAll('.filter').forEach(filter => {
    const active = button === filter;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  document.querySelector('#filter-status').textContent = `Showing ${visible} ${selected === 'all' ? '' : selected + ' '}project${visible === 1 ? '' : 's'}`;
}));
document.querySelector('.copy-email').addEventListener('click', async event => {
  const label = event.currentTarget.querySelector('span');
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText('npreesak@gmail.com');
    label.textContent = 'Email copied!';
    status.textContent = 'Email address copied to clipboard.';
    setTimeout(() => { label.textContent = 'Copy email'; }, 2500);
  } catch (error) {
    status.textContent = 'Copy is unavailable. The email address is npreesak@gmail.com.';
    label.textContent = 'npreesak@gmail.com';
  }
});
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        nav.querySelectorAll('a').forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('current', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-12% 0px -58% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
