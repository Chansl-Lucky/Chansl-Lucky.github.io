'use strict';
const articles = [...document.querySelectorAll('.publication')];
const filters = [...document.querySelectorAll('[data-filter]')];
const status = document.querySelector('.result-count');
function setFilter(value) {
  let count = 0;
  articles.forEach(article => {
    const visible = value === 'all' || article.dataset.type === value;
    article.hidden = !visible;
    if (visible) count += 1;
  });
  filters.forEach(button => {
    const selected = button.dataset.filter === value;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  status.textContent = `${count} ${count === 1 ? 'work' : 'works'}`;
}
filters.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.querySelector('.publication-tools').hidden = false;
// News links remain usable even when a publication filter has hidden their target.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.hash.slice(1));
    if (target && target.classList.contains('publication') && target.hidden) setFilter('all');
  });
});
function revealHashTarget() {
  const target = document.getElementById(location.hash.slice(1));
  if (target && target.classList.contains('publication') && target.hidden) {
    setFilter('all');
    target.scrollIntoView();
  }
}
window.addEventListener('hashchange', revealHashTarget);
const navLinks = [...document.querySelectorAll('#nav a')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) navLinks.forEach(link => {
        const active = link.hash === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, {rootMargin:'-100px 0px -65% 0px', threshold:0});
  navLinks.forEach(link => observer.observe(document.querySelector(link.hash)));
}
