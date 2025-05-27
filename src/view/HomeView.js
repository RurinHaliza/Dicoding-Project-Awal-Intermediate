import StoryPresenter from "../presenter/StoryPresenter.js";

const HomeView = {
  render() {
    return `
      <section id="story-container">
        <div id="story-list">
          <p>Memuat cerita...</p>
        </div>
      </section>
    `;
  },

  afterRender() {
    const container = document.getElementById("story-list");
    let currentPage = 1;

    const renderStories = (page = 1) => {
      StoryPresenter.init({
        container,
        page,
        withLocation: true,
        onPageChange: renderStories,
      });
    };

    renderStories(currentPage);
  },
};

export default HomeView;
