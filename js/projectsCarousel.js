/**
 * Projects Carousel Configuration for Trịnh Hữu Dương Portfolio
 * Matches the interactive Swiper carousel from https://thangnt.vercel.app/
 */

function initProjectsCarousel() {
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper library not loaded. Falling back to grid.');
    fallbackToGrid();
    return;
  }

  const carouselContainer = document.querySelector('.projectsSwiper');
  if (!carouselContainer) {
    return;
  }

  const projectsSwiper = new Swiper('.projectsSwiper', {
    // Responsive slides
    slidesPerView: 1,
    spaceBetween: 24,

    // Loop & Auto-play
    loop: true,
    autoplay: {
      delay: 5500,
      pauseOnMouseEnter: true,
      disableOnInteraction: false,
    },

    // Responsive breakpoints
    breakpoints: {
      640: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 32,
      },
    },

    // Navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },

    // Accessibility
    a11y: {
      prevSlideMessage: 'Dự án trước',
      nextSlideMessage: 'Dự án tiếp theo',
    },

    // Performance & Transition
    speed: 500,
    effect: 'slide',

    // Keyboard navigation
    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    // Mouse wheel control
    mousewheel: {
      forceToAxis: true,
    },
  });

  // Pause autoplay on mouse enter
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (projectsSwiper.autoplay && projectsSwiper.autoplay.running) {
        projectsSwiper.autoplay.pause();
      }
    });

    card.addEventListener('mouseleave', () => {
      if (projectsSwiper.autoplay && !projectsSwiper.autoplay.running) {
        projectsSwiper.autoplay.start();
      }
    });
  });

  // Reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    projectsSwiper.params.speed = 0;
    projectsSwiper.autoplay.stop();
  }

  window.__projectsSwiper = projectsSwiper;
}

// Fallback function if Swiper fails
function fallbackToGrid() {
  const swiperWrapper = document.querySelector('.swiper-wrapper');
  const swiperContainer = document.querySelector('.projectsSwiper');

  if (swiperWrapper && swiperContainer) {
    swiperWrapper.classList.remove('swiper-wrapper');
    swiperContainer.classList.remove('swiper', 'projectsSwiper');
    swiperWrapper.style.display = 'grid';
    swiperWrapper.style.gridTemplateColumns = 'repeat(auto-fit, minmax(320px, 1fr))';
    swiperWrapper.style.gap = '1.5rem';

    const slides = swiperWrapper.querySelectorAll('.swiper-slide');
    slides.forEach(slide => {
      const card = slide.querySelector('.project-card');
      if (card) {
        swiperWrapper.appendChild(card);
        slide.remove();
      }
    });

    const navElements = document.querySelectorAll('.swiper-button-prev, .swiper-button-next, .swiper-pagination');
    navElements.forEach(el => el.style.display = 'none');
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCarousel);
} else {
  initProjectsCarousel();
}
