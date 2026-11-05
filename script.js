'use strict';

// Progressive enhancement: all publication and news content works without JS.
const publications = [...document.querySelectorAll('.publication')];
const filters = [...document.querySelectorAll('[data-filter]')];
const resultCount = document.querySelector('.result-count');
function setFilter(value) {
  let count = 0;
  publications.forEach(publication => {
    const visible = value === 'all' || publication.dataset.type === value;
    publication.hidden = !visible;
    count += Number(visible);
  });
  filters.forEach(button => {
    const selected = button.dataset.filter === value;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (resultCount) resultCount.textContent = `${count} ${count === 1 ? 'work' : 'works'}`;
}
if (filters.length) {
  document.querySelector('.publication-tools').hidden = false;
  filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
}

function hashTarget(hash) {
  try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
  catch { return null; }
}
function revealPublication(hash) {
  const target = hashTarget(hash);
  if (target?.classList.contains('publication') && target.hidden) setFilter('all');
  return target;
}
document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.href);
  if (url.origin === location.origin && url.pathname === location.pathname && url.hash) {
    link.addEventListener('click', () => revealPublication(url.hash));
  }
});
window.addEventListener('hashchange', () => revealPublication(location.hash));
revealPublication(location.hash);

// The blog link is a real page, while homepage links follow visible sections.
const navLinks = [...document.querySelectorAll('#nav a')];
const sectionLinks = navLinks.filter(link => link.origin === location.origin && link.pathname === location.pathname && hashTarget(link.hash));
if ('IntersectionObserver' in window && sectionLinks.length) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      sectionLinks.forEach(link => {
        const selected = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', selected);
        if (selected) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
  }, { rootMargin: '-40px 0px -65% 0px', threshold: 0 });
  sectionLinks.forEach(link => observer.observe(hashTarget(link.hash)));
}

const newsWindow = document.getElementById('news-window');
const newsToggle = document.getElementById('news-toggle');
const newsHint = document.getElementById('news-hint');
if (newsWindow && newsToggle) {
  const updateNews = () => {
    const expanded = newsToggle.getAttribute('aria-expanded') === 'true';
    const overflowing = newsWindow.scrollHeight > newsWindow.clientHeight + 2;
    newsToggle.hidden = !expanded && !overflowing;
    if (newsHint) newsHint.hidden = expanded || !overflowing || newsWindow.scrollTop + newsWindow.clientHeight >= newsWindow.scrollHeight - 3;
  };
  newsToggle.addEventListener('click', () => {
    const expanded = newsToggle.getAttribute('aria-expanded') !== 'true';
    newsToggle.setAttribute('aria-expanded', String(expanded));
    newsToggle.textContent = expanded ? 'Show less' : 'Show all news';
    newsWindow.classList.toggle('is-expanded', expanded);
    updateNews();
  });
  newsWindow.addEventListener('scroll', updateNews, { passive: true });
  window.addEventListener('resize', updateNews, { passive: true });
  updateNews();
}

// Article links are only copied after a visitor chooses the action.
document.querySelectorAll('[data-copy-url]').forEach(button => {
  button.addEventListener('click', async () => {
    const original = button.textContent;
    try {
      await navigator.clipboard.writeText(button.dataset.copyUrl || location.href);
      button.textContent = 'Link copied';
    } catch {
      button.textContent = 'Copy the URL from your address bar';
    }
    window.setTimeout(() => { button.textContent = original; }, 2500);
  });
});
