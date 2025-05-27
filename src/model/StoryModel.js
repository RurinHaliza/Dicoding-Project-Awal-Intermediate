import AuthModel from "./AuthModel.js";

const BASE_URL = "https://story-api.dicoding.dev/v1";

const StoryModel = {
  async getStories({ page = 1, size = 10, location = 0 } = {}) {
    try {
      const token = AuthModel.getToken();
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
        { headers }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch stories");
      }

      const data = await response.json();
      return data.listStory || [];
    } catch (error) {
      console.error("StoryModel.getStories error:", error);
      throw error;
    }
  },

  async addStory(formData) {
    const token = AuthModel.getToken();
    if (!token) throw new Error("Harap login terlebih dahulu");

    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Gagal menambahkan cerita");
    }

    return await response.json();
  },

  async getStoryDetail(id) {
    try {
      const token = AuthModel.getToken();
      const headers = {};

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${BASE_URL}/stories/${id}`, { headers });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch story detail");
      }

      const data = await response.json();
      return data.story || null;
    } catch (error) {
      console.error("StoryModel.getStoryDetail error:", error);
      throw error;
    }
  },

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

export default StoryModel;
