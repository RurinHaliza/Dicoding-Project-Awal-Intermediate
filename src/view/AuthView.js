import AuthPresenter from "../presenter/AuthPresenter.js";

const AuthView = {
  render() {
    return `
      <section class="auth-section">
        <h1>Login</h1>
        <form id="login-form">
          <input type="email" id="email" />
          <input type="password" id="password" />
          <button id="login-btn">Login</button>
        </form>
        <p id="login-feedback" aria-live="polite"></p>
      </section>
    `;
  },

  afterRender() {
    AuthPresenter.init(); // Panggil hanya setelah elemen sudah ada di DOM
  },
};

export default AuthView;
