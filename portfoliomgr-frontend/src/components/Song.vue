<template>
  <div class="page-container">
    <nav class="navbar">
      <ul class="nav-list">
        <li class="nav-item">
          <router-link to="/about" class="btn btn-primary"
            >About Us</router-link
          >
        </li>
        <li class="nav-item">
          <router-link to="/dashboard" class="btn btn-primary"
            >Dashboard</router-link
          >
        </li>
      </ul>
      <ul class="nav-list justify-content-end">
        <li class="nav-item logout">
          <router-link to="/" class="btn btn-primary">Logout</router-link>
        </li>
      </ul>
    </nav>
    <div class="container">
      <div class="song-info-card card">
        <div class="card-body">
          <h5 class="card-title">{{ song.Song_Name }}</h5>
          <div class="song-details">
            <p><strong>Album Name:</strong> {{ song.Album_Name }}</p>
            <p><strong>Creator Name:</strong> {{ song.Creator_Name }}</p>
            <p><strong>Rating:</strong> {{ song.Rating }}</p>
            <p>
              <strong>Created Date:</strong>
              {{ song.Created_Date.slice(5, 16) }}
            </p>
          </div>
        </div>
      </div>

      <div class="song-card card">
        <img
          :src="`http://127.0.0.1:5000/static/${song.Album_Image}`"
          alt="Album Image"
          height="300px"
        />
        <div class="card-body">
          <h5 class="card-title">{{ song.Song_Name }}</h5>
          <br />
          <audio controls autoplay>
            <source
              :src="`http://127.0.0.1:5000/static/music/${song.Song_File}`"
              type="audio/mp3"
            />
            Your browser does not support the audio element.
          </audio>
          <div class="card-buttons">
            <button
              class="playlist-button"
              @click="openModal(song.Song_ID)"
              title="+ Playlist"
            >
              📁
            </button>
            <div class="modal-overlay" v-if="showModal">
              <div
                class="modal-content"
                style="
                  background-color: black;
                  color: #ffffff;
                  outline: 2px solid white;
                "
              >
                <h3>Select Playlist</h3>
                <select v-model="selectedPlaylist">
                  <option
                    v-for="playlist in playlists"
                    :key="playlist.Playlist_ID"
                  >
                    {{ playlist.Playlist_Name }}
                  </option>
                </select>
                <button
                  class="btn btn-primary"
                  @click="addToPlaylist(selectedPlaylist, song.Song_ID)"
                >
                  Add to Playlist
                </button>
                <button class="btn btn-primary" @click="closeModal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="lyrics-container card">
        <div class="card-body">
          <pre style="color: #ffffff">{{ lyrics }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SongVue",
  data() {
    return {
      showModal: false,
      currentSong: null,
      selectedPlaylist: null,
      lyrics: null,
      error: false,
    };
  },
  mounted() {
    console.log(this.song);
    this.fetchLyrics();
  },
  methods: {
    async fetchLyrics() {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/static/music/${this.song.Lyrics_File}`
        );
        if (response.ok) {
          const lyricsData = await response.text();
          this.lyrics = lyricsData;
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
    openModal() {
      console.log(this.song);
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async addToPlaylist(playlist_name, song_id) {
      try {
        const token = this.user.access_token;
        const response = await fetch(
          "http://127.0.0.1:5000/api/playlist/songs/" + playlist_name,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              Song_ID: song_id,
              User_ID: this.user.user_id,
              User_Name: this.user.user_name,
            }),
          }
        );

        if (response.ok) {
          alert("Song added to playlist!");
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },

  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    music() {
      return JSON.parse(localStorage.getItem("music"));
    },
    song() {
      return JSON.parse(localStorage.getItem("playSong"));
    },
    playlists() {
      return this.music.playlists;
    },
  },
};
</script>

<style scoped>
.page-container {
  background-color: #f8f9fa;
  background-image: url(../assets/BG.png);
  background-size: cover;
  min-height: 100vh;
}

.btn.btn-primary,
.sidebar-link {
  background-color: transparent;
  border: none;
  color: #aeaeae;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.3s ease;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 1px;
  outline: none;
}

.btn.btn-primary:hover,
.btn.btn-primary:focus,
.btn.btn-primary:active,
.sidebar-link:hover {
  background-color: transparent;
  color: #ffffff; /* White text on hover, focus, and active */
  border: none;
  box-shadow: none; /* Remove any box-shadow */
  text-decoration: none;
}

.nav-list {
  list-style: none;
  display: flex;
  justify-content: space-between; /* Space between items */
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-right: 15px;
}

.logout a {
  color: #fff; /* White text color for logout link */
}

/* Navbar Styling */
.navbar {
  background-color: #000000;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  width: 102%;
}

.container {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.card {
  width: 30%;
  margin: 20px;
  background-color: #080808;
  color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card img {
  width: 100%;
}

.card-body {
  padding: 20px;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
}

.playlist-button {
  font-size: 24px;
}
.song-info-card {
  width: 30%;
  height: 30%;
  margin: 20px;
  background-color: #000000;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.song-info-card .card-body {
  padding: 20px;
}

.song-info-card .card-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.song-info-card .song-details p {
  margin: 0;
  padding: 5px 0;
}

.song-info-card .song-details p strong {
  font-weight: bold;
}

.song-info-card .song-details p:nth-child(even) {
  background-color: #d13636;
}

.song-card {
  width: 30%;
  height: 40%;
}

.lyrics-container {
  width: 25%;
  background-color: #080808;
  color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.lyrics-container .card-body {
  padding: 20px;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .card,
  .lyrics-container {
    width: 100%;
    margin-bottom: 20px;
  }
}

.playlist-button {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 2rem;
  cursor: pointer;
  margin-left: 50%;
  color: #007bff; /* Change to your preferred color */
  transition: color 0.3s ease; /* Add a smooth transition effect */
  position: relative; /* Enable positioning */
}

.playlist-button:hover::after {
  content: attr(title);
  position: absolute;
  top: -10px; /* Adjust the distance above the symbol */
  left: -50px; /* Center horizontally */
  background-color: #333;
  color: #fff;
  padding: 2px;
  border-radius: 5px;
  font-size: 0.8rem;
}
</style>
