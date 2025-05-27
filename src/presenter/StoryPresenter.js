import StoryModel from "../model/StoryModel.js";

const StoryPresenter = {
  async init({ container, page = 1, withLocation = false, onPageChange }) {
    container.innerHTML = '<p class="loading">Memuat cerita...</p>';

    try {
      const size = 9;
      const stories = await StoryModel.getStories({
        location: withLocation ? 1 : 0,
        page,
        size,
      });

      const totalPages = 5; // Mock/hardcoded sementara

      if (!stories || stories.length === 0) {
        container.innerHTML = "<p>Tidak ada cerita ditemukan.</p>";
        return;
      }

      container.innerHTML = `
        <section>
          <div class="story-header">
            <h1>Daftar Cerita</h1>
            <button class="map-link">Lihat di Peta</button>
          </div>

          <div class="story-list">
            ${stories
              .map(
                (story) => `
              <article class="story-card" data-id="${story.id}">
                <img src="${story.photoUrl}" alt="${
                  story.name
                }" loading="lazy" />
                <div class="story-content">
                  <h2>${story.name}</h2>
                  <p class="story-description">${story.description}</p>
                  <div class="story-meta">
                    ${
                      story.lat && story.lon
                        ? `<span class="location">📍 ${story.lat.toFixed(
                            4
                          )}, ${story.lon.toFixed(4)}</span>`
                        : ""
                    }
                    <span class="date">🗓️ ${this.formatDate(
                      story.createdAt
                    )}</span>
                  </div>
                  <a href="#/detail/${
                    story.id
                  }" class="detail-link">Lihat Detail</a>
                </div>
              </article>
            `
              )
              .join("")}
          </div>

          ${this.renderPagination(page, totalPages)}

          

          ${
            withLocation
              ? `<div class="map-section" id="map-section">
                    <h2>Lokasi Cerita</h2>
                    <div id="storyMap" style="height: 400px;"></div>
                  </div>`
              : ""
          }
        </section>
      `;

      if (withLocation) {
        this.renderMap(stories.filter((story) => story.lat && story.lon));
      }

      this.attachPaginationEvents(container, page, totalPages, onPageChange);

      const mapButton = document.querySelector(".map-link");
      const mapSection = document.getElementById("map-section");

      mapButton?.addEventListener("click", () => {
        if (mapSection) {
          mapSection.style.display = "block"; // tampilkan section peta
          mapSection.scrollIntoView({ behavior: "smooth" }); // scroll ke peta

          // Inisialisasi peta di sini jika belum ada
          if (!mapSection.dataset.mapLoaded) {
            this.renderMap(stories); // fungsi untuk menampilkan peta & marker
            mapSection.dataset.mapLoaded = "true";
          }
        }
      });
    } catch (error) {
      container.innerHTML = `
        <p class="error">Gagal memuat cerita: ${error.message}</p>
        <button id="retry-btn">Coba Lagi</button>
      `;
      container.querySelector("#retry-btn").addEventListener("click", () => {
        this.init({ container, page, withLocation, onPageChange });
      });
    }
  },

  renderMap(stories) {
    const map = L.map("storyMap").setView([-2.5489, 118.0149], 4);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    stories.forEach((story) => {
      L.marker([story.lat, story.lon])
        .addTo(map)
        .bindPopup(
          `<b>${story.name}</b><br>${story.description.slice(0, 100)}...`
        );
    });
  },

  renderPagination(currentPage, totalPages) {
    const pageButtons = Array.from({ length: totalPages }, (_, i) => {
      const page = i + 1;
      return `
        <button class="page-btn" data-page="${page}" ${
        page === currentPage ? "disabled" : ""
      }>
          ${page}
        </button>
      `;
    });

    return `
      <div class="pagination">
        <button id="prev-btn" ${currentPage === 1 ? "disabled" : ""}>◀</button>
        ${pageButtons.join("")}
        <button id="next-btn" ${
          currentPage === totalPages ? "disabled" : ""
        }>▶</button>
      </div>
    `;
  },

  attachPaginationEvents(container, currentPage, totalPages, onPageChange) {
    container.querySelectorAll(".page-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = parseInt(btn.dataset.page, 10);
        onPageChange(page);
      });
    });

    const prev = container.querySelector("#prev-btn");
    const next = container.querySelector("#next-btn");

    if (prev)
      prev.addEventListener("click", () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
      });

    if (next)
      next.addEventListener("click", () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
      });
  },

  formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
};

export default StoryPresenter;
