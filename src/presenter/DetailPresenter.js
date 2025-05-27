import DetailModel from "../model/DetailModel.js";

const DetailPresenter = {
  async init(id, { showStory, showError, showMap }) {
    try {
      const story = await DetailModel.getStoryById(id);
      showStory(story);

      if (story.lat && story.lon && window.google) {
        showMap(story);
      }
    } catch (error) {
      console.error(error);
      showError("Gagal memuat data cerita.");
    }
  },
};

export default DetailPresenter;