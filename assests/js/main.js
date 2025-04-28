/* ===== CONSTANTES ET VARIABLES GLOBALES ===== */
const navMenu = document.getElementById("nav-menu"),
      navToggle = document.getElementById("nav-toggle"),
      navClose = document.getElementById("nav-close"),
      themeButton = document.getElementById("theme-button"),
      contactForm = document.getElementById("contactForm"),
      typingElement = document.getElementById("typing-text"),
      sections = document.querySelectorAll("section[id]"),
      scrollUpButton = document.getElementById("scroll-up");

const textArray = [
  "Je suis",
  "GNETO Schiphra Grace",
  "Étudiante en Science informatique",
  "Passionnée par l'informatique",
  "Amoureuse de la technologie",
];

// Variables pour l'animation de texte
let textIndex = 0,
    charIndex = 0,
    isDeleting = false,
    typingSpeed = 100,
    deletingSpeed = 50,
    pauseTime = 1500;

/* ===== FONCTIONS D'ANIMATION ===== */

/**
 * Effet machine à écrire
 * @param {HTMLElement} element - Élément HTML cible
 * @param {string} text - Texte à afficher
 * @param {number} i - Index de caractère courant
 */
function typeWriter(element, text, i = 0) {
  if (element && i < text.length) {
    element.innerHTML += text.charAt(i);
    i++;
    setTimeout(() => typeWriter(element, text, i), 100 + Math.random() * 50);
  }
}

/**
 * Animation de texte automatique
 */
function typeText() {
  if (!typingElement) return;

  const currentText = textArray[textIndex];

  if (isDeleting) {
    typingElement.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = deletingSpeed;

    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % textArray.length;
      typingSpeed = pauseTime;
    }
  } else {
    typingElement.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 100;

    if (charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = pauseTime;
    }
  }

  setTimeout(typeText, typingSpeed);
}

/**
 * Animation des compétences en cercle
 */
function animateSkillsCircles() {
  const circles = document.querySelectorAll('.skill-circle');
  circles.forEach(circle => {
    const percent = circle.getAttribute('data-percent');
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (percent / 100) * circumference;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = offset;
    circle.style.animation = `skill-animate 1.5s ease-in-out forwards`;
  });
}

/* ===== GESTION DU MENU ===== */
function setupMenu() {
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
      anime({
        targets: '.nav__item',
        translateX: [-50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        easing: 'easeOutExpo'
      });
    });
  }

  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  // Fermer le menu au clic sur un lien
  const navLinks = document.querySelectorAll(".nav__link");
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
      anime({
        targets: '.nav__item',
        translateX: [0, -50],
        opacity: [1, 0],
        delay: anime.stagger(100, {direction: 'reverse'}),
        easing: 'easeInExpo'
      });
    });
  });
}

/* ===== GESTION DU THÈME ===== */
function setupTheme() {
  if (!themeButton) return;

  const darkTheme = "dark-theme";
  const iconTheme = "uil-sun";

  // Vérifier le thème précédent
  const selectedTheme = localStorage.getItem("selected-theme");
  const selectedIcon = localStorage.getItem("selected-icon");

  if (selectedTheme) {
    document.body.classList[selectedTheme === "dark" ? "add" : "remove"](darkTheme);
    themeButton.classList[selectedIcon === "uil-moon" ? "add" : "remove"](iconTheme);
  }

  // Basculer le thème avec animation
  themeButton.addEventListener("click", () => {
    document.body.classList.toggle(darkTheme);
    themeButton.classList.toggle(iconTheme);

    anime({
      targets: 'body',
      backgroundColor: document.body.classList.contains(darkTheme) ? '#1a202c' : '#f7fafc',
      duration: 800,
      easing: 'easeInOutQuad'
    });

    localStorage.setItem("selected-theme", getCurrentTheme());
    localStorage.setItem("selected-icon", getCurrentIcon());
  });

  function getCurrentTheme() {
    return document.body.classList.contains(darkTheme) ? "dark" : "light";
  }

  function getCurrentIcon() {
    return themeButton.classList.contains(iconTheme) ? "uil-moon" : "uil-sun";
  }
}

/* ===== GESTION DU FORMULAIRE ===== */

function setupContactForm() {
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formResponse = document.getElementById('formResponse');
    const formData = new FormData(contactForm);

    // Désactiver le bouton pendant l'envoi
    submitButton.disabled = true;
    submitButton.innerHTML = 'Envoi en cours... <i class="uil uil-spinner-alt button__icon spin"></i>';

    fetch(contactForm.action, {
      method: contactForm.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) throw new Error('Erreur réseau');
      return response.json();
    })
    .then(data => {
      if (data.error) {
        formResponse.innerHTML = `<div class="error"> </div>`;
      } else {
        // Afficher deux messages de succès
        formResponse.innerHTML = `
          <div class="success">Succès </div>
          <div class="success">Réussi : Votre message a été envoyé avec succès !</div>
        `;
        contactForm.reset(); // Réinitialiser le formulaire
      }
    })
    .catch(error => {
      formResponse.innerHTML = `<div class="error">Erreur : </div>`;
    })
    .finally(() => {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Envoyer le message <i class="uil uil-message button__icon"></i>';
    });
  });
}

/* ===== GESTION DU SCROLL ===== */
function setupScroll() {
  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 200;
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav__menu a[href*="${sectionId}"]`)?.classList.add("active-link");
        
        if (!current.classList.contains('animated')) {
          current.classList.add('animated');
          anime({
            targets: current.querySelectorAll('h2, h3, p, img, .button'),
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuad'
          });
        }
      } else {
        document.querySelector(`.nav__menu a[href*="${sectionId}"]`)?.classList.remove("active-link");
      }
    });
  }

  function handleScrollUp() {
    if (!scrollUpButton) return;

    if (window.scrollY >= 560) {
      scrollUpButton.classList.add("show-scroll");
    } else {
      scrollUpButton.classList.remove("show-scroll");
    }
  }

  window.addEventListener("scroll", () => {
    scrollActive();
    handleScrollUp();
  });

  // Bouton scroll to top
  scrollUpButton?.addEventListener("click", (e) => {
    e.preventDefault();
    anime({
      targets: 'html, body',
      scrollTop: 0,
      duration: 1000,
      easing: 'easeInOutQuad'
    });
  });
}

/* ===== INITIALISATION DES COMPOSANTS ===== */
function initSwiper() {
  // Swiper About
  new Swiper('.about-swiper', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 150,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    loop: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });

  // Swiper Portfolio
  new Swiper(".portfolio__container", {
    cssMode: true,
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

function setupQualificationTabs() {
  const tabs = document.querySelectorAll("[data-target]"),
        tabContents = document.querySelectorAll("[data-content]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = document.querySelector(tab.dataset.target);

      tabContents.forEach((tabContent) => {
        tabContent.classList.remove("qualification__active");
      });
      target.classList.add("qualification__active");

      tabs.forEach((tab) => {
        tab.classList.remove("qualification__active");
      });
      tab.classList.add("qualification__active");
    });
  });
}

function setupServicesModal() {
  const modalViews = document.querySelectorAll(".services__modal"),
        modalBtns = document.querySelectorAll(".services__button"),
        modalCloses = document.querySelectorAll(".services__modal-close");

  modalBtns.forEach((modalBtn, i) => {
    modalBtn.addEventListener("click", () => {
      modalViews[i].classList.add("active-modal");
    });
  });

  modalCloses.forEach((modalClose) => {
    modalClose.addEventListener("click", () => {
      modalViews.forEach((modalView) => {
        modalView.classList.remove("active-modal");
      });
    });
  });
}

function setupSkillsAccordion() {
  const skillsContents = document.querySelectorAll(".skills__content"),
        skillsHeaders = document.querySelectorAll(".skills__header");

  skillsHeaders.forEach(header => {
    header.addEventListener("click", function() {
      const parent = this.parentElement;
      const isOpen = parent.classList.contains("skills__open");

      // Fermer tous les autres
      skillsContents.forEach(content => {
        content.classList.remove("skills__open");
        content.classList.add("skills__close");
      });

      // Ouvrir celui-ci si ce n'était pas déjà ouvert
      if (!isOpen) {
        parent.classList.remove("skills__close");
        parent.classList.add("skills__open");
        
        anime({
          targets: parent.querySelector('.skills__list'),
          height: ['0', 'auto'],
          opacity: [0, 1],
          duration: 500,
          easing: 'easeOutQuad'
        });
      }
    });
  });
}

/* ===== OBSERVER POUR LES ANIMATIONS ===== */
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        
        if (entry.target.classList.contains('section')) {
          anime({
            targets: entry.target.querySelectorAll('h2, h3, p, .button'),
            translateY: [50, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 800,
            easing: 'easeOutQuad'
          });
        }
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.section, .service-card, .project').forEach(el => {
    observer.observe(el);
  });
}

/* ===== EFFET DE PARTICULES ===== */
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '-1';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = window.innerWidth < 768 ? 30 : 100;

  // Créer des particules
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1 - 0.5,
      color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, 255, 0.5)`
    });
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      // Mouvement
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      // Rebond sur les bords
      if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Redimensionnement
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

/* ===== INITIALISATION AU CHARGEMENT ===== */
document.addEventListener('DOMContentLoaded', () => {
  // Machine à écrire
  const heroTitle = document.querySelector('.home__title');
  if (heroTitle) {
    heroTitle.innerHTML = '';
    typeWriter(heroTitle, "Salut tout le monde, ");
  }

  // Animation des compétences après 1s
  setTimeout(animateSkillsCircles, 1000);

  // Initialisation des composants
  setupMenu();
  setupTheme();
  setupContactForm();
  setupScroll();
  initSwiper();
  setupQualificationTabs();
  setupServicesModal();
  setupSkillsAccordion();
  setupIntersectionObserver();

  // Démarrer l'animation de texte
  if (typingElement) {
    typeText();
  }
});

// Démarrer les particules après le chargement complet
window.addEventListener('load', initParticles);
