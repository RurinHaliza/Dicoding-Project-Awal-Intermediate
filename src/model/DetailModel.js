// src/model/StoryModel.js
import AuthModel from "./AuthModel.js";

const DetailModel = {
  async getStoryById(id) {
    const token = AuthModel.getToken();

    const response = await fetch(
      `https://story-api.dicoding.dev/v1/stories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil data cerita");
    }

    const data = await response.json();
    return data.story;
  },
};

export default DetailModel;
