// src/presenter/AuthPresenter.js
import AuthModel from "../model/AuthModel.js";
import { updateAuthLink } from "/scripts/app.js";


const AuthPresenter = {
  init() {
    this.setupEventListeners();
  },

  setupEventListeners() {
    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const feedback = document.getElementById("login-feedback");

    if (!form || !emailInput || !passwordInput) {
      console.error("Form atau input tidak ditemukan.");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      if (!email || !password) {
        feedback.textContent = "Email dan password wajib diisi.";
        feedback.style.color = "red";
        return;
      }

      feedback.textContent = "Memproses...";
      feedback.style.color = "black";

      try {
        const result = await AuthModel.login({ email, password });
        
          feedback.textContent = "Login berhasil!";

          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));

          updateAuthLink();
// Panggil updateAuthLink setelah login
          import("/scripts/app.js").then((module) => {
            module.updateAuthLink();
});

// Arahkan ke halaman utama
window.location.hash = "/";

      } catch (err) {
        feedback.textContent = err.message;
        feedback.style.color = "red";
      }
    });
  },
};

export default AuthPresenter;
