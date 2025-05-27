// src/presenter/AddPresenter.js
import StoryModel from "../model/StoryModel.js";

const AddPresenter = {
  stream: null,
  selectedFile: null,
  map: null,
  marker: null,

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.initCamera();
    this.initMap();

    window.addEventListener("hashchange", () => {
      if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    });
  },

  cacheDOM() {
    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.preview = document.getElementById("preview");
    this.fileInput = document.getElementById("file-input");
    this.captureBtn = document.getElementById("capture-btn");
    this.uploadBtn = document.getElementById("upload-btn");
    this.locationBtn = document.getElementById("current-location-btn");
    this.submitBtn = document.getElementById("submit-btn");
    this.form = document.getElementById("add-story-form");
  },

  bindEvents() {
    if (!this.captureBtn || !this.form)
      return console.warn("DOM belum lengkap");

    this.captureBtn.addEventListener("click", () => this.capturePhoto());
    this.uploadBtn.addEventListener("click", () => this.fileInput.click());

    this.fileInput.addEventListener("change", (e) => this.handleFile(e));

    this.locationBtn.addEventListener("click", () => this.useCurrentLocation());

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  },

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      this.video.srcObject = this.stream;
    } catch (err) {
      console.error("Camera error:", err);
      if (this.captureBtn) this.captureBtn.style.display = "none";
    }
  },

  initMap() {
    const mapElement = document.getElementById("map");
    if (!mapElement) return;

    const defaultCenter = { lat: -2.5489, lng: 118.0149 };

    this.map = new google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: 5,
      mapTypeControl: true,
      streetViewControl: false,
      styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
    });

    this.map.addListener("click", (e) => {
      this.setLocation(e.latLng.lat(), e.latLng.lng());
    });
  },

  setLocation(lat, lng) {
    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lng;

    const pos = new google.maps.LatLng(lat, lng);

    if (this.marker) {
      this.marker.setPosition(pos);
    } else {
      this.marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        draggable: true,
        title: "Lokasi dipilih",
      });

      this.marker.addListener("dragend", (e) => {
        this.setLocation(e.latLng.lat(), e.latLng.lng());
      });
    }

    this.map.panTo(pos);
  },

  capturePhoto() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    const ctx = this.canvas.getContext("2d");
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    this.canvas.toBlob(
      (blob) => {
        this.selectedFile = new File([blob], "capture.jpg", {
          type: "image/jpeg",
        });
        this.showPreview(blob);
      },
      "image/jpeg",
      0.8
    );
  },

  handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 1000000) {
      alert("Ukuran file melebihi 1MB");
      return;
    }

    this.selectedFile = file;
    this.showPreview(file);
  },

  showPreview(fileOrBlob) {
    const url = URL.createObjectURL(fileOrBlob);
    this.preview.src = url;
    this.preview.style.display = "block";
    this.video.style.display = "none";

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  },

  useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => this.setLocation(pos.coords.latitude, pos.coords.longitude),
      (err) => alert("Tidak bisa mendapatkan lokasi: " + err.message)
    );
  },

  async handleSubmit(e) {
    e.preventDefault();
    this.submitBtn.disabled = true;
    this.submitBtn.textContent = "Menyimpan...";

    const formData = new FormData();
    formData.append(
      "description",
      document.getElementById("description").value.trim()
    );
    formData.append("photo", this.selectedFile);

    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;
    if (lat && lon) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    try {
      await StoryModel.addStory(formData);
      alert("Cerita berhasil ditambahkan!");
      window.location.hash = "/";
    } catch (err) {
      console.error("Gagal simpan cerita:", err);
      alert("Gagal: " + err.message);
    } finally {
      this.submitBtn.disabled = false;
      this.submitBtn.textContent = "💾 Simpan Cerita";
    }
  },
};

export default AddPresenter;
