const MODAL_CLOSE_CLASS = 'modal-close';

function buildModalContent(pet) {
  const modal = document.createElement('div');
  modal.className = 'pet-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');

  const inoculationsText = pet.inoculations && pet.inoculations.length > 0 
    ? pet.inoculations.join(', ') 
    : 'none';
  const diseasesText = pet.diseases && pet.diseases.length > 0 
    ? pet.diseases.join(', ') 
    : 'none';
  const parasitesText = pet.parasites && pet.parasites.length > 0 
    ? pet.parasites.join(', ') 
    : 'none';

  modal.innerHTML = `
    <div class="pet-modal__body">
      <button class="pet-modal__close ${MODAL_CLOSE_CLASS}" aria-label="Close">×</button>
      <img src="${pet.image}" alt="${pet.name}" class="pet-modal__img">
      <div class="pet-modal__info">
        <h3 class="pet-modal__name">${pet.name}</h3>
        <p class="pet-modal__subtitle">${pet.type} · ${pet.breed}</p>
        <p class="pet-modal__description">${pet.description}</p>
        <ul class="pet-modal__list">
          <li><strong>Age:</strong> ${pet.age}</li>
          <li><strong>Inoculations:</strong> ${inoculationsText}</li>
          <li><strong>Diseases:</strong> ${diseasesText}</li>
          <li><strong>Parasites:</strong> ${parasitesText}</li>
        </ul>
      </div>
    </div>
  `;
  return modal;
}

function createOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  return overlay;
}

let currentModal = null;
let currentOverlay = null;
let escapeKeyHandler = null;

function closeModal() {
  if (!currentOverlay || !currentModal) return;

  currentModal.classList.add('pet-modal--hidden');
  currentOverlay.classList.add('modal-overlay--hidden');

  setTimeout(() => {
    if (currentOverlay && currentOverlay.parentElement) {
      currentOverlay.remove();
    }
    if (currentModal && currentModal.parentElement) {
      currentModal.remove();
    }
    currentModal = null;
    currentOverlay = null;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    if (escapeKeyHandler) {
      window.removeEventListener('keydown', escapeKeyHandler);
      escapeKeyHandler = null;
    }
  }, 300);
}

export function initModal(pets) {
  if (!pets || pets.length === 0) {
    return;
  }

  const petsMap = new Map(pets.map((pet) => [pet.id, pet]));

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  async function openModal(petId) {
    let pet = petsMap.get(petId);

    // Fallback: if pets weren't loaded earlier, try to fetch pets.json on demand
    if (!pet) {
      try {
        const resp = await fetch('assets/pets.json');
        if (resp.ok) {
          const data = await resp.json();
          const found = data.find((p) => p.id === petId);
          if (found) {
            pet = found;
            petsMap.set(petId, pet);
          }
        } else {
          console.warn('Fallback fetch pets.json failed:', resp.status);
        }
      } catch (err) {
        console.error('Error fetching pets.json fallback:', err);
      }
    }

    if (!pet) return;

    // Close any existing modal first
    if (currentModal) {
      closeModal();
    }

    currentOverlay = createOverlay();
    currentModal = buildModalContent(pet);

    document.body.appendChild(currentOverlay);
    // append modal into overlay so overlay flex centering works
    currentOverlay.appendChild(currentModal);
    // block scroll on both body and html
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    escapeKeyHandler = onKeyDown;
    window.addEventListener('keydown', escapeKeyHandler);

    currentOverlay.addEventListener('click', closeModal);
    currentModal.querySelector(`.${MODAL_CLOSE_CLASS}`).addEventListener('click', closeModal);

    // Start hidden, then make visible to ensure CSS transition (avoids race)
    currentOverlay.classList.add('modal-overlay--hidden');
    currentModal.classList.add('pet-modal--hidden');

    // Trigger animation by switching to visible state after a short delay
    setTimeout(() => {
      currentOverlay.classList.remove('modal-overlay--hidden');
      currentOverlay.classList.add('modal-overlay--visible');
      currentModal.classList.remove('pet-modal--hidden');
      currentModal.classList.add('pet-modal--visible');
    }, 20);
  }

  // Event delegation for all cards
  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-pet-id]');
    if (!target) return;

    const petId = target.dataset.petId;
    if (!petId) return;

    event.preventDefault();
    openModal(petId);
  });
}
