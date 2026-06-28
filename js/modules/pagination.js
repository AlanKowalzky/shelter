const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1280;

function getCardsPerPage() {
  if (window.innerWidth >= TABLET_BREAKPOINT) {
    return 8;
  }
  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    return 6;
  }
  return 3;
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function generate48Pets(pets) {
  const repeated = pets.flatMap((pet) => Array(6).fill(pet));

  function hasAdjacentDuplicates(list) {
    return list.some((pet, index) => index > 0 && pet.id === list[index - 1].id);
  }

  let result = shuffleArray(repeated);
  let attempt = 0;
  while (hasAdjacentDuplicates(result) && attempt < 1000) {
    result = shuffleArray(result);
    attempt += 1;
  }

  return result;
}

function buildCard(pet) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.petId = pet.id;
  card.innerHTML = `
    <img src="${pet.image}" alt="${pet.name} – ${pet.breed}" class="card__img">
    <div class="card__body">
      <h2 class="card__name">${pet.name}</h2>
      <p class="card__breed">${pet.type} · ${pet.breed}</p>
      <a href="#" class="btn btn--outline">Learn more</a>
    </div>
  `;
  return card;
}

export function initPagination(pets) {
  const grid = document.querySelector('.pets-friends__grid');
  const paginationContainer = document.querySelector('.pagination');
  const firstBtn = document.querySelector('.pagination__btn--first');
  const prevBtn = document.querySelector('.pagination__btn--prev');
  const nextBtn = document.querySelector('.pagination__btn--next');
  const lastBtn = document.querySelector('.pagination__btn--last');
  const pageIndicator = document.querySelector('.pagination__current');

  if (!grid || !paginationContainer || !firstBtn || !prevBtn || !nextBtn || !lastBtn || !pageIndicator) {
    return;
  }

  const cards = generate48Pets(pets);
  let currentPage = 1;
  let cardsPerPage = getCardsPerPage();
  let totalPages = Math.ceil(cards.length / cardsPerPage);

  function renderPage(page) {
    grid.innerHTML = '';
    const start = (page - 1) * cardsPerPage;
    const pageCards = cards.slice(start, start + cardsPerPage);
    pageCards.forEach((pet) => grid.appendChild(buildCard(pet)));
    pageIndicator.textContent = `${page} / ${totalPages}`;
    firstBtn.disabled = page === 1;
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
    lastBtn.disabled = page === totalPages;
    grid.classList.add('page-transition');
    setTimeout(() => {
      grid.classList.remove('page-transition');
    }, 500);
  }

  function updateLayout() {
    cardsPerPage = getCardsPerPage();
    totalPages = Math.ceil(cards.length / cardsPerPage);
    currentPage = Math.min(currentPage, totalPages);
    renderPage(currentPage);
  }

  firstBtn.addEventListener('click', () => {
    if (currentPage !== 1) {
      currentPage = 1;
      renderPage(currentPage);
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage -= 1;
      renderPage(currentPage);
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage += 1;
      renderPage(currentPage);
    }
  });

  lastBtn.addEventListener('click', () => {
    if (currentPage !== totalPages) {
      currentPage = totalPages;
      renderPage(currentPage);
    }
  });

  window.addEventListener('resize', updateLayout);

  updateLayout();
}
