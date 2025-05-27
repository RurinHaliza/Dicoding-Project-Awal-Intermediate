import AddPresenter from "../presenter/AddPresenter.js";

const AddView = {
  render: () => `
    <section class="add-story-section">
      <h2>Tambah Cerita Baru</h2>
      <form id="add-story-form">
        <div class="form-group">
          <label for="description">Deskripsi</label>
          <textarea 
            id="description" 
            required 
            placeholder="Cerita Anda"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Foto</label>
          <div class="media-container">
            <!-- Camera Feed -->
            <video id="video" autoplay playsinline muted></video>
            <!-- Capture Controls -->
            <div class="camera-controls">
              <button type="button" id="capture-btn" class="btn-capture">
                📷 Ambil Foto
              </button>
              <span class="or-divider">atau</span>
              <button type="button" id="upload-btn" class="btn-upload">
                📁 Pilih File
              </button>
              <input type="file" id="file-input" accept="image/*" style="display:none;" />
            </div>
            <!-- Preview -->
            <canvas id="canvas" style="display:none;"></canvas>
            <img id="preview" class="preview-image" alt="Preview" style="display:none;"/>
          </div>
          <p class="file-hint">Format: JPG/PNG (Maks. 1MB)</p>
        </div>

        <div class="form-group">
          <label>Lokasi (Opsional)</label>
          <div id="map"></div>
          <div class="location-fields">
            <input type="hidden" id="lat" />
            <input type="hidden" id="lon" />
            <button type="button" id="current-location-btn" class="btn-location">
              📍 Gunakan Lokasi Sekarang
            </button>
          </div>
        </div>

        <button type="submit" id="submit-btn" class="btn-submit">
          💾 Simpan Cerita
        </button>
      </form>
    </section>
  `,

  afterRender: () => {
    AddPresenter.init();
  },
};

export default AddView;
