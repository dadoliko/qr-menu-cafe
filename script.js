// Ürünler HTML'de durur; kategori ve arama birlikte görünürlüğü belirler.
const categoryNav = document.querySelector('.category-nav');
const categoryButtons = document.querySelectorAll('[data-filter]');
const menuCards = document.querySelectorAll('[data-category]');
const menuStatus = document.querySelector('#menu-status');
const searchPanel = document.querySelector('.menu-search');
const searchInput = document.querySelector('#product-search');
const clearSearchButton = document.querySelector('#clear-search');
const noResults = document.querySelector('#no-results');
let selectedButton = document.querySelector('[data-filter="all"]');

// Türkçedeki İ/i ve I/ı eşleşmelerini doğru değerlendirir.
function normalizeSearch(text) {
  return text.normalize('NFC').toLocaleLowerCase('tr-TR').trim();
}

const searchableProducts = Array.from(menuCards, (card) => ({
  card,
  text: normalizeSearch(`${card.querySelector('h3').textContent} ${card.querySelector('p').textContent}`)
}));

function filterMenu() {
  const selectedCategory = selectedButton.dataset.filter;
  const query = normalizeSearch(searchInput.value);
  let visibleCount = 0;

  searchableProducts.forEach(({ card, text }) => {
    const matchesCategory = selectedCategory === 'all' || card.dataset.category === selectedCategory;
    const isVisible = matchesCategory && text.includes(query);
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  const categoryName = selectedCategory === 'all'
    ? 'Tümü'
    : selectedButton.textContent.trim().replace(/^[^\p{L}]+/u, '');
  noResults.hidden = visibleCount !== 0;
  clearSearchButton.disabled = searchInput.value.length === 0;
  // Aynı canlı alan hem sonuç sayısını hem sonuç bulunamamasını duyurur.
  menuStatus.textContent = visibleCount === 0
    ? `${categoryName} · Aradığınız ürün bulunamadı`
    : `${categoryName} · ${visibleCount} lezzet`;
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedButton = button;

    categoryButtons.forEach((categoryButton) => {
      const isSelected = categoryButton === button;
      categoryButton.classList.toggle('is-active', isSelected);
      categoryButton.setAttribute('aria-pressed', String(isSelected));
    });

    filterMenu();
  });
});

searchInput.addEventListener('input', filterMenu);
clearSearchButton.addEventListener('click', () => {
  searchInput.value = '';
  filterMenu();
  searchInput.focus();
});

// JavaScript kapalıysa bütün ürünler okunabilir, işlevsiz düğmeler gizli kalır.
categoryNav.hidden = false;
searchPanel.hidden = false;
filterMenu();
