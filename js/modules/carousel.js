const ANIMATION_DURATION = 500;
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1280;

function getCardsPerView() {
  if (window.innerWidth >= TABLET_BREAKPOINT) {
    return 3;
  }
  if (window.innerWidth >= MOBILE_BREAKPOINT) {
    return 2;
  }
  return 1;
}

function getNextPets(allPets, currentPets, count) {
  const currentIds = new Set(currentPets.map((pet) => pet.id));
  const available = allPets.filter((pet) => !currentIds.has(pet.id));

  if (available.length < count) {
    return allPets.slice(0, count);
  }

  const selected = [];
  const copy = [...available];

  while (selected.length < count && copy.length > 0) {
    const index = Math.floor(Math.random() * copy.length);
    selected.push(copy.splice(index, 1)[0]);
  }

  return selected;
}

function buildCard(pet) {
  const card = document.createElement('article');
  card.className = 'card';
  card.dataset.petId = pet.id;

  card.innerHTML = `
    <img src="${pet.image}" alt="${pet.name} – ${pet.breed}" class="card__img">
    <div class="card__body">
      <h3 class="card__name">${pet.name}</h3>
      <p class="card__breed">${pet.type} · ${pet.breed}</p>
      <button class="btn btn--outline" data-pet-id="${pet.id}">Learn more</button>
    </div>
  `;

  return card;
}

export function initCarousel(pets) {
  const slider = document.querySelector('.our-friends__slider');
  const grid = document.querySelector('.our-friends__grid');
  const prevBtn = document.querySelector('.slider-btn--prev');
  const nextBtn = document.querySelector('.slider-btn--next');

  if (!slider || !grid || !prevBtn || !nextBtn || !pets || pets.length === 0) {
    return;
  }

  let isAnimating = false;
  let activePets = pets.slice(0, getCardsPerView());

  function renderCards(petItems) {
    grid.innerHTML = '';
    petItems.forEach((pet) => {
      grid.appendChild(buildCard(pet));
    });
  }

  function updateActivePets() {
    const count = getCardsPerView();
    if (activePets.length !== count) {
      activePets = pets.slice(0, count);
    }
    renderCards(activePets);
  }

  function switchCards(direction) {
    if (isAnimating) return;

    isAnimating = true;
    const count = getCardsPerView();
    const nextPets = getNextPets(pets, activePets, count);

    grid.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right');

    setTimeout(() => {
      renderCards(nextPets);
      activePets = nextPets;
      grid.classList.remove('slide-out-left', 'slide-out-right');
      grid.classList.add(direction === 'next' ? 'slide-in-right' : 'slide-in-left');

      setTimeout(() => {
        grid.classList.remove('slide-in-right', 'slide-in-left');
        isAnimating = false;
      }, ANIMATION_DURATION);
    }, ANIMATION_DURATION);
  }

  prevBtn.addEventListener('click', () => switchCards('prev'));
  nextBtn.addEventListener('click', () => switchCards('next'));

  window.addEventListener('resize', () => {
    if (isAnimating) return;
    updateActivePets();
  });

  updateActivePets();
}
