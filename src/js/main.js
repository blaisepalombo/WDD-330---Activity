import { loadHeaderFooter, updateCartCount } from "./utils.mjs";

const GIVEAWAY_MODAL_KEY = "so-registration-giveaway-seen";

function createGiveawayModal() {
  const modal = document.createElement("div");
  modal.className = "giveaway-modal";
  modal.id = "giveawayModal";
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;

  modal.innerHTML = `
    <div
      class="giveaway-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="giveawayModalTitle"
    >
      <button
        class="giveaway-modal__close"
        id="giveawayModalClose"
        type="button"
        aria-label="Close registration giveaway message"
      >
        ×
      </button>

      <p class="giveaway-modal__eyebrow">New visitor special</p>
      <h2 id="giveawayModalTitle">Create an account and enter our giveaway</h2>
      <p>
        Register with Sleep Outside for a chance to win a camping starter kit.
        New registered users are automatically entered into this month’s
        giveaway and will also get faster checkout and order tracking.
      </p>
      <p>
        Sign up today to get your entry in before the giveaway closes.
      </p>

      <div class="giveaway-modal__actions">
        <button class="button-link giveaway-register-link" id="giveawayRegisterNow" type="button">
          Register Now
        </button>
        <button class="giveaway-modal__secondary" id="giveawayModalLater" type="button">
          Maybe Later
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function createRegisterModal() {
  const modal = document.createElement("div");
  modal.className = "register-modal";
  modal.id = "registerModal";
  modal.setAttribute("aria-hidden", "true");
  modal.hidden = true;

  modal.innerHTML = `
    <div
      class="register-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registerModalTitle"
    >
      <button
        class="register-modal__close"
        id="registerModalClose"
        type="button"
        aria-label="Close registration form"
      >
        ×
      </button>

      <p class="register-modal__eyebrow">Quick signup</p>
      <h2 id="registerModalTitle">Create your account</h2>
      <p class="register-modal__intro">
        Register below to enter the giveaway and start tracking your orders.
      </p>

      <form class="register-modal__form" id="registerModalForm">
        <label for="registerName">Full Name</label>
        <input type="text" id="registerName" name="registerName" required />

        <label for="registerEmail">Email Address</label>
        <input type="email" id="registerEmail" name="registerEmail" required />

        <label for="registerPassword">Password</label>
        <input type="password" id="registerPassword" name="registerPassword" required />

        <button type="submit">Create Account</button>
      </form>

      <p class="register-modal__note" id="registerModalMessage"></p>
    </div>
  `;

  document.body.appendChild(modal);
  return modal;
}

function setupGiveawayFlow() {
  if (localStorage.getItem(GIVEAWAY_MODAL_KEY)) return;

  const giveawayModal = createGiveawayModal();
  const registerModal = createRegisterModal();

  const giveawayClose = giveawayModal.querySelector("#giveawayModalClose");
  const giveawayLater = giveawayModal.querySelector("#giveawayModalLater");
  const giveawayRegisterNow = giveawayModal.querySelector("#giveawayRegisterNow");

  const registerClose = registerModal.querySelector("#registerModalClose");
  const registerForm = registerModal.querySelector("#registerModalForm");
  const registerMessage = registerModal.querySelector("#registerModalMessage");

  function hideGiveawayModal(markSeen = true) {
    giveawayModal.hidden = true;
    giveawayModal.setAttribute("aria-hidden", "true");

    if (markSeen) {
      localStorage.setItem(GIVEAWAY_MODAL_KEY, "true");
    }
  }

  function showGiveawayModal() {
    giveawayModal.hidden = false;
    giveawayModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function hideRegisterModal() {
    registerModal.hidden = true;
    registerModal.setAttribute("aria-hidden", "true");

    if (giveawayModal.hidden) {
      document.body.classList.remove("modal-open");
    }
  }

  function showRegisterModal() {
    registerModal.hidden = false;
    registerModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closeEverything() {
    hideGiveawayModal(true);
    hideRegisterModal();
    document.body.classList.remove("modal-open");
  }

  showGiveawayModal();

  giveawayClose.addEventListener("click", closeEverything);

  giveawayLater.addEventListener("click", closeEverything);

  giveawayRegisterNow.addEventListener("click", () => {
    hideGiveawayModal(false);
    showRegisterModal();
  });

  registerClose.addEventListener("click", closeEverything);

  giveawayModal.addEventListener("click", (event) => {
    if (event.target === giveawayModal) {
      closeEverything();
    }
  });

  registerModal.addEventListener("click", (event) => {
    if (event.target === registerModal) {
      closeEverything();
    }
  });

  registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = registerForm.registerName.value.trim();

    registerMessage.textContent = `Thanks${name ? `, ${name}` : ""}! Your account has been created and your giveaway entry has been received.`;

    localStorage.setItem(GIVEAWAY_MODAL_KEY, "true");
    registerForm.reset();

    setTimeout(() => {
      closeEverything();
    }, 1200);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!registerModal.hidden || !giveawayModal.hidden) {
        closeEverything();
      }
    }
  });
}

loadHeaderFooter();
updateCartCount();
setupGiveawayFlow();