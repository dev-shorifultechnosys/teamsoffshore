/* ==========================================================
   TeamsOffshore — Shared Vanilla JavaScript
   Progressive enhancement only: the website remains readable
   and navigable if JavaScript is unavailable.
   ========================================================== */

(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---------- Logo fallback ---------- */
  $$(".brand img, .footer-brand img").forEach((img) => {
    img.addEventListener("error", () => {
      const brand = img.closest(".brand");
      if (brand) brand.classList.add("logo-failed");
      img.style.display = "none";
    });
  });


  /* ---------- Sticky header state + homepage section highlighting ---------- */
  const siteHeader = $("[data-site-header]");
  if (siteHeader) {
    const syncHeaderState = () => siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
    syncHeaderState();
    window.addEventListener("scroll", syncHeaderState, { passive: true });
  }

  const scrollSpyLinks = $$('[data-scrollspy-link]');
  const scrollSpySections = $$('[data-scrollspy-section]');
  if (scrollSpyLinks.length && scrollSpySections.length && "IntersectionObserver" in window) {
    const setActiveScrollLink = (sectionId) => {
      scrollSpyLinks.forEach((link) => {
        const isActive = link.dataset.scrollspyLink === sectionId;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };

    const visibility = new Map();
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibility.set(entry.target.id, entry.intersectionRatio);
        else visibility.delete(entry.target.id);
      });

      const active = [...visibility.entries()]
        .sort((a, b) => b[1] - a[1])[0];
      if (active) setActiveScrollLink(active[0]);
    }, { rootMargin: "-24% 0px -58% 0px", threshold: [0.08, 0.2, 0.4, 0.65] });

    scrollSpySections.forEach((section) => spyObserver.observe(section));
    setActiveScrollLink("home");
  }

  /* ---------- Mobile navigation ---------- */
  const menuToggle = $(".menu-toggle");
  const mobileNav = $(".mobile-nav");

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
    });

    $$("a", mobileNav).forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        mobileNav.classList.remove("is-open");
      });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = $$(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Homepage process line animation ---------- */
  const processSteps = $("[data-process-steps]");
  if (processSteps) {
    if ("IntersectionObserver" in window) {
      const processObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-animated");
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.28 });
      processObserver.observe(processSteps);
    } else {
      processSteps.classList.add("is-animated");
    }
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const panelId = button.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      panel.classList.toggle("is-open", !isOpen);
    });
  });

  /* ---------- Homepage service image preview ---------- */
  const servicePreviewRoot = $("[data-service-preview-root]");
  if (servicePreviewRoot) {
    const servicePaths = $$(".service-path[data-preview-image]", servicePreviewRoot);
    const preview = $("[data-service-preview]", servicePreviewRoot);
    const previewImage = $("[data-service-preview-image]", servicePreviewRoot);
    const previewTitle = $("[data-service-preview-title]", servicePreviewRoot);
    const previewCaption = $("[data-service-preview-caption]", servicePreviewRoot);

    const activateServicePreview = (path) => {
      if (!path) return;
      servicePaths.forEach((item) => item.classList.toggle("is-preview-active", item === path));

      const image = path.dataset.previewImage;
      const title = path.dataset.previewTitle;
      const caption = path.dataset.previewCaption;
      const alt = path.dataset.previewAlt || title || "TeamsOffshore service";

      if (preview) preview.classList.add("is-changing");
      window.setTimeout(() => {
        if (previewImage && image) {
          previewImage.src = image;
          previewImage.alt = alt;
        }
        if (previewTitle && title) previewTitle.textContent = title;
        if (previewCaption && caption) previewCaption.textContent = caption;
        if (preview) preview.classList.remove("is-changing");
      }, 90);
    };

    servicePaths.forEach((path) => {
      path.addEventListener("pointerenter", () => activateServicePreview(path));
      path.addEventListener("focus", () => activateServicePreview(path));
    });
  }

  /* ---------- Homepage role selector ---------- */
  const roleBuilder = $("[data-role-builder]");
  if (roleBuilder) {
    const chips = $$(".role-chip", roleBuilder);
    const roleOutput = $("[data-role-output]", roleBuilder);
    const roleDescription = $("[data-role-description]", roleBuilder);
    const roleExamples = $("[data-role-examples]", roleBuilder);
    const roleLink = $("[data-role-link]", roleBuilder);
    const roleImage = $("[data-role-image]", roleBuilder);

    const roleDetails = {
      "Virtual Assistance": {
        description: "Recurring admin, scheduling and coordination support that protects higher-value time.",
        examples: ["Executive admin", "Calendar support", "Client coordination"],
        image: "https://static.wixstatic.com/media/2f7214_437b748421a14617946c13e3de0c8ced~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/pexels-ketut-subiyanto-4963433.jpg"
      },
      "Contact Centre": {
        description: "Customer-facing capacity for inbound, outbound, chat, email and overflow support.",
        examples: ["Customer service", "Live chat", "Appointment setting"],
        image: "https://static.wixstatic.com/media/2f7214_361cb338560d49e9a07227317bfecacd~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/Contact%20centre.jpg"
      },
      "Finance": {
        description: "Reliable support for routine finance operations, collections and transaction workflows.",
        examples: ["Accounts payable", "Accounts receivable", "Collections"],
        image: "https://static.wixstatic.com/media/2f7214_7a25c8660be044c1b16e1bee07d6f0d7~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/finance.jpg"
      },
      "Technology": {
        description: "Flexible delivery and technical support capability aligned to your product and systems.",
        examples: ["Web development", "QA support", "Service desk"],
        image: "https://static.wixstatic.com/media/2f7214_b4e97377935144c58ef64b7acb3c6581~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/tech%20dev.jpg"
      },
      "Operations": {
        description: "Extra operational capacity for recurring workflows, onboarding and business support.",
        examples: ["Operations admin", "Onboarding", "Account support"],
        image: "https://static.wixstatic.com/media/2f7214_6adf01a6e2544293bba7ddba789f351f~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/Ops%20support.jpg"
      },
      "Data": {
        description: "Structured support for data entry, validation, enrichment and recurring information workflows.",
        examples: ["Data entry", "Data validation", "CRM enrichment"],
        image: "https://static.wixstatic.com/media/2f7214_15f1cfcaa2904f4f8aa2ca48ea6adcb5~mv2.jpg/v1/fill/w_700,h_700,al_c,q_88,enc_auto/data%20management_edited.jpg"
      }
    };

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((item) => {
          item.classList.remove("is-selected");
          item.setAttribute("aria-pressed", "false");
        });

        chip.classList.add("is-selected");
        chip.setAttribute("aria-pressed", "true");

        const role = chip.dataset.role || "your role";
        const details = roleDetails[role];
        if (roleOutput) roleOutput.textContent = role;
        if (roleDescription && details) roleDescription.textContent = details.description;
        if (roleExamples && details) {
          roleExamples.innerHTML = details.examples.map((item) => `<span>${item}</span>`).join("");
        }
        if (roleImage && details?.image) {
          roleImage.style.opacity = "0.35";
          window.setTimeout(() => {
            roleImage.src = details.image;
            roleImage.style.opacity = "1";
          }, 90);
        }
        if (roleLink) roleLink.href = `contact.html?role=${encodeURIComponent(role)}`;
      });
    });
  }

  /* ---------- Contact form (front-end validation) ----------
     NOTE FOR DEVELOPER:
     Connect this form to the CMS / CRM endpoint during implementation.
     The current static build only validates fields and shows a success state.
  ----------------------------------------------------------- */
  const contactForm = $("[data-contact-form]");
  if (contactForm) {
    const status = $("[data-form-status]", contactForm.parentElement || document);
    const params = new URLSearchParams(window.location.search);
    const roleParam = params.get("role");
    const emailParam = params.get("email");
    const roleField = $("#interest", contactForm);
    const emailField = $("#email", contactForm);

    if (roleParam && roleField) {
      const matching = [...roleField.options].find(
        (option) => option.value.toLowerCase() === roleParam.toLowerCase()
      );
      if (matching) roleField.value = matching.value;
    }

    if (emailParam && emailField) {
      emailField.value = emailParam;
    }

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        if (status) {
          status.textContent = "Please complete the required fields before submitting.";
          status.className = "form-status is-visible error";
        }
        return;
      }

      if (status) {
        status.textContent = "Thanks — your enquiry is ready to send. Connect this form to the live CMS/CRM endpoint during implementation.";
        status.className = "form-status is-visible success";
      }
    });
  }
})();
