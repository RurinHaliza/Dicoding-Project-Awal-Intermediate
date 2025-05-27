import HomeView from './view/HomeView.js';
import AddView from './view/AddView.js';
import NotFoundView from './view/NotFoundView.js';
import DetailView from './view/DetailView.js';
import AuthView from './view/AuthView.js';
import AuthModel from './model/AuthModel.js';

const routes = {
  '/': HomeView,
  '/login': AuthView,
  '/add': AddView,
  '/detail/:id': DetailView,
  '/404': NotFoundView
};

const router = async () => {
  const hash = window.location.hash.slice(1).toLowerCase() || '/';
  const content = document.getElementById('main-content');

  let page = routes[hash];

  if (!page && hash.startsWith('/detail/')) {
    page = routes['/detail/:id'];
  }

  if (!page) {
    page = routes['/404'];
  }

  const protectedRoutes = ['/add'];
  if (protectedRoutes.includes(hash) && !AuthModel.isLoggedIn()) {
    window.location.hash = '/login';
    return;
  }

  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      content.innerHTML = await page.render();
      if (page.afterRender) await page.afterRender();
    });
  } else {
    content.innerHTML = await page.render();
    if (page.afterRender) await page.afterRender();
  }
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

export default router;