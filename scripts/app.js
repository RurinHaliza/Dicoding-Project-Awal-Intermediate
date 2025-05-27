export function updateAuthLink() {
  const authLink = document.getElementById("auth-link");
  const isLoggedIn = !!localStorage.getItem("token");

  if (!authLink) return;

  if (isLoggedIn) {
    authLink.textContent = "Logout";
    authLink.onclick = (e) => {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.hash = "/login";
      updateAuthLink(); 
    };
  } else {
    authLink.textContent = "Login";
    authLink.onclick = () => {
      window.location.hash = "/login";
    };
  }
}

window.addEventListener("DOMContentLoaded", () => {
  updateAuthLink();
});
