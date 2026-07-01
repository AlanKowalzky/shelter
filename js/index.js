import { loadPets } from './modules/dataLoader.js';
import { initBurgerMenu } from './modules/burgerMenu.js';
import { initCarousel } from './modules/carousel.js';
import { initPagination } from './modules/pagination.js';
import { initModal } from './modules/modal.js';

async function bootstrap() {
  try {
    // init burger menu early so it works even if fetching pets fails
    initBurgerMenu();

    const pets = await loadPets();
    initModal(pets);

    if (document.querySelector('.our-friends__slider')) {
      initCarousel(pets);
    }

    if (document.querySelector('.pets-friends__grid') && document.querySelector('.pagination')) {
      initPagination(pets);
    }
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
