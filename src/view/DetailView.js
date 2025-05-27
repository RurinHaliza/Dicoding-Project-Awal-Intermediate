// import AuthModel from '../model/AuthModel.js';

// const DetailView = {
//   render: () => `
//     <section id="story-detail" class="detail-section">
//       <h2>Detail Cerita</h2>
//       <div id="detail-container" class="detail-box"></div>
//       <div id="detail-map" class="detail-map"></div>
//     </section>
//   `,

//   afterRender: async () => {
//     const id = window.location.hash.split('/')[2];
//     const token = AuthModel.getToken();

//     try {
//       const response = await fetch(`https://story-api.dicoding.dev/v1/stories/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       });

//       const { story } = await response.json();

//       const createdAt = new Date(story.createdAt).toLocaleString('id-ID', {
//         weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
//         hour: '2-digit', minute: '2-digit'
//       });

//       document.getElementById('detail-container').innerHTML = `
//         <div class="detail-card">
//           <img src="${story.photoUrl}" alt="${story.name}" class="detail-image" />
//           <div class="detail-info">
//             <h3>${story.name}</h3>
//             <p><strong>Deskripsi:</strong> ${story.description}</p>
//             <p><strong>Dibuat pada:</strong> ${createdAt}</p>
//             ${story.lat && story.lon ? `
//               <p><strong>Lokasi:</strong> ${story.lat.toFixed(4)}, ${story.lon.toFixed(4)}</p>
//             ` : `<p><em>Lokasi tidak tersedia</em></p>`}
//           </div>
//         </div>
//       `;

//       if (story.lat && story.lon && window.google) {
//         const map = new google.maps.Map(document.getElementById('detail-map'), {
//           center: { lat: story.lat, lng: story.lon },
//           zoom: 12
//         });

//         const marker = new google.maps.Marker({
//           position: { lat: story.lat, lng: story.lon },
//           map: map,
//           title: story.name
//         });

//         const infoWindow = new google.maps.InfoWindow({
//           content: `<strong>${story.name}</strong><br>${story.description}`
//         });

//         marker.addListener('click', () => {
//           infoWindow.open(map, marker);
//         });

//         marker.addListener('mouseover', () => {
//           infoWindow.open(map, marker);
//         });

//         marker.addListener('mouseout', () => {
//           infoWindow.close();
//         });
//       }

//     } catch (error) {
//       console.error("Gagal memuat data:", error);
//       document.getElementById('detail-container').innerHTML = '<p>Gagal memuat data cerita.</p>';
//     }
//   }
// };

// export default DetailView;

// src/view/DetailView.js
import DetailPresenter from "../presenter/DetailPresenter.js";

const DetailView = {
  render: () => `
    <section id="story-detail" class="detail-section">
      <h2>Detail Cerita</h2>
      <div id="detail-container" class="detail-box"></div>
      <div id="detail-map" class="detail-map"></div>
    </section>
  `,

  afterRender: async () => {
    const id = window.location.hash.split("/")[2];

    await DetailPresenter.init(id, {
      showStory: (story) => {
        const createdAt = new Date(story.createdAt).toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        document.getElementById("detail-container").innerHTML = `
          <div class="detail-card">
            <img src="${story.photoUrl}" alt="${
          story.name
        }" class="detail-image" />
            <div class="detail-info">
              <h3>${story.name}</h3>
              <p><strong>Deskripsi:</strong> ${story.description}</p>
              <p><strong>Dibuat pada:</strong> ${createdAt}</p>
              ${
                story.lat && story.lon
                  ? `
                <p><strong>Lokasi:</strong> ${story.lat.toFixed(
                  4
                )}, ${story.lon.toFixed(4)}</p>
              `
                  : `<p><em>Lokasi tidak tersedia</em></p>`
              }
            </div>
          </div>
        `;
      },

      showError: (message) => {
        document.getElementById(
          "detail-container"
        ).innerHTML = `<p>${message}</p>`;
      },

      showMap: (story) => {
        const map = new google.maps.Map(document.getElementById("detail-map"), {
          center: { lat: story.lat, lng: story.lon },
          zoom: 12,
        });

        const marker = new google.maps.Marker({
          position: { lat: story.lat, lng: story.lon },
          map: map,
          title: story.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<strong>${story.name}</strong><br>${story.description}`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        marker.addListener("mouseover", () => infoWindow.open(map, marker));
        marker.addListener("mouseout", () => infoWindow.close());
      },
    });
  },
};

export default DetailView;
