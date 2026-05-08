"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("loader");
  
  setTimeout(() => {
    loader.classList.add("hidden");
    document.body.style.overflow = "auto";
  }, 2000);

  AOS.init({ duration: 1000, once: true });

  initNavigation();
  initThemeToggle();
  initScrollProgress();
  initCounters();
  initSkillBars();
  initPortfolioFilter();
  initProjectModal();
  initTestimonialsSlider();
  initBackToTop();
  initContactForm();
  initCursor();
});

function initNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
      
      if (navMenu.classList.contains("active")) {
        navMenu.style.display = "block";
      } else {
        setTimeout(() => {
          navMenu.style.display = "none";
        }, 300);
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger) hamburger.classList.remove("active");
      if (navMenu) {
        navMenu.classList.remove("active");
        navMenu.style.display = "none";
      }
    });
  });

  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      if (window.scrollY > 100) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    }

    let current = "";
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}

function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  if (localStorage.getItem("theme") === "dark") {
    html.classList.add("dark");
    if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      html.classList.toggle("dark");
      const isDark = html.classList.contains("dark");
      themeToggle.innerHTML = isDark
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }
}

function initScrollProgress() {
  const progressBar = document.getElementById("progress-bar");
  if (progressBar) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    });
  }
}

function initCounters() {
  const counters = document.querySelectorAll(".counter");
  let counted = false;

  const animateCounters = () => {
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      if (isNaN(target)) return;
      
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    });
  };

  const statsSection = document.querySelector("#stats");
  if (statsSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !counted) {
          animateCounters();
          counted = true;
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(statsSection);
  }
}

function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-bar-fill");
  window.addEventListener("scroll", () => {
    skillBars.forEach((bar) => {
      const rect = bar.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight - 100 && !bar.dataset.animated) {
        bar.dataset.animated = "true";
        const width = bar.getAttribute("data-width");
        setTimeout(() => {
          bar.style.width = width;
        }, 300);
      }
    });
  });
}

function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        
        if (filter === "all" || category === filter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.8)";
          setTimeout(() => {
            card.style.display = "none";
          }, 300);
        }
      });
    });
  });
}

function initProjectModal() {
  const modal = document.getElementById("project-modal");
  const closeModal = document.getElementById("close-modal");
  const viewBtns = document.querySelectorAll(".view-project");

  if (!modal) return;

  viewBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".project-card");
      if (!card) return;
      
      const title = card.querySelector(".project-title")?.textContent || "";
      const desc = card.querySelector(".project-description")?.textContent || "";
      const img = card.querySelector("img")?.src || "";
      const category = card.querySelector(".project-category")?.textContent || "";

      const modalImg = document.getElementById("modal-img");
      const modalTitle = document.getElementById("modal-title");
      const modalDesc = document.getElementById("modal-desc");
      const modalCategory = document.getElementById("modal-category");

      if (modalImg) modalImg.src = img;
      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = desc;
      if (modalCategory) modalCategory.textContent = category;

      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });
}

function initTestimonialsSlider() {
  const slider = document.getElementById("testimonial-slider");
  const slides = document.querySelectorAll(".testimonial-slide");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let autoSlideInterval;

  if (!slider || slides.length === 0) return;

  const showSlide = (index) => {
    const track = slider.querySelector(".testimonial-track");
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
    
    currentSlide = index;
  };

  const nextSlide = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  const prevSlide = () => {
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    showSlide(currentSlide);
  };

  const startAutoSlide = () => {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 5000);
  };

  const stopAutoSlide = () => {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startAutoSlide();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showSlide(index);
      startAutoSlide();
    });
  });

  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);

  showSlide(0);
  startAutoSlide();

  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      nextSlide();
    } else if (touchEndX - touchStartX > 50) {
      prevSlide();
    }
  });
}

function initBackToTop() {
  const backToTop = document.getElementById("back-to-top");
  if (!backToTop) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject");
    const message = formData.get("message");

    if (!name || !email || !subject || !message) {
      showNotification("Please fill in all fields", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showNotification("Please enter a valid email", "error");
      return;
    }

    const mailtoLink = `mailto:Omarhusseinadan88@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;
    window.location.href = mailtoLink;
    
    showNotification("Opening email client...", "success");
    form.reset();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 100);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

function initCursor() {
  const cursor = document.getElementById("cursor");
  if (!cursor) return;

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  const links = document.querySelectorAll("a, button");
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
      cursor.style.opacity = "0.5";
    });
    link.addEventListener("mouseleave", () => {
      cursor.style.transform = "translate(-50%, -50%) scale(1)";
      cursor.style.opacity = "0.7";
    });
  });
}