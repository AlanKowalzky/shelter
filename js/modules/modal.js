const MODAL_CLOSE_CLASS = 'modal-close';

function buildModalContent(pet) {
  const modal = document.createElement('div');
  modal.className = 'pet-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
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
          <li><strong>Inoculations:</strong> ${pet.inoculations.join(', ')}</li>
          <li><strong>Diseases:</strong> ${pet.diseases.join(', ')}</li>
          <li><strong>Parasites:</strong> ${pet.parasites.join(', ')}</li>
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

export function initModal(pets) {
  const body = document.body;
  let overlay = null;
  let modal = null;

  function closeModal() {
    if (!overlay || !modal) return;
    modal.classList.add('pet-modal--hidden');
    overlay.classList.add('modal-overlay--hidden');

    setTimeout(() => {
      overlay.remove();
      modal.remove();
      overlay = null;
      modal = null;
      body.style.overflow = '';
    }, 300);
  }

  function openModal(petId) {
    const pet = pets.find((item) => item.id === petId);
    if (!pet) return;

    overlay = createOverlay();
    modal = buildModalContent(pet);

    body.appendChild(overlay);
    body.appendChild(modal);
    body.style.overflow = 'hidden';

    overlay.addEventListener('click', closeModal);
    modal.querySelector(`.${MODAL_CLOSE_CLASS}`).addEventListener('click', closeModal);
    window.addEventListener('keydown', onKeyDown);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  }

  document.addEventListener('click', (event) => {
    const card = event.target.closest('.card');
    if (!card) return;
    const petId = card.dataset.petId;
    if (!petId) return;
    event.preventDefault();
    openModal(petId);
  });
}
