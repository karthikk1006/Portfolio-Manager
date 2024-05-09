<template>
  <div class="dashboard-container">
    <div class="main-content">
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
      <div style="display: flex; flex-wrap: wrap">
        <div v-for="song in songs" :key="song.Song_ID" class="card-wrapper">
          <div class="card" style="width: 18rem; margin: 10px">
            <div
              class="image-container"
              @mouseenter="hovering = true"
              @mouseleave="hovering = false"
            >
              <img
                :src="`http://127.0.0.1:5000/static/${song.Album_Image}`"
                alt="Album Image"
                height="300px"
              />
              <div class="rating-screen" v-if="hovering && !rated">
                <p style="color: black">Current rating : {{ song.Rating }}</p>
                <p style="color: black">Rate this song:</p>

                <div class="rating-stars">
                  <span
                    v-for="index in 5"
                    :key="index"
                    class="star"
                    :class="{ filled: index <= filledStars }"
                    @click="setRating(index)"
                  >
                    &#9733;
                  </span>
                </div>
                <button
                  class="btn btn-primary"
                  style="color: black"
                  @click="submitRating(song.Song_Name)"
                >
                  Submit Rating
                </button>
              </div>

              <div class="rating-screen" v-if="hovering && rated">
                <p style="color: black">Already Rated!✅</p>
              </div>
            </div>

            <div class="card-body">
              <h3 class="card-title">{{ song.Song_Name }}</h3>
              <p>From {{ song.Album_Name }}</p>
              <p>By {{ song.Creator_Name }}</p>
            </div>

            <div class="card-buttons">
              <button
                @click="getSongUrl(song)"
                class="card-link play-link"
                title="Play Song"
              >
                <img src="../assets/Play.png" height="50px" weight="50px" />
              </button>
              <router-link
                class="like-button"
                :to="getFlagURL(song)"
                title="Flag/Report"
              >
                🚩
              </router-link>
              <button
                class="playlist-button"
                @click="openModal(song.Song_ID)"
                title="+ Playlist"
              >
                📁
              </button>

              <div
                class="modal-overlay"
                v-if="showModal && currentSong == song.Song_ID"
              >
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AlbumSongsVue",
  data() {
    return {
      selectedPlaylist: null,
      showModal: false,
      currentSong: null,
      albumName: this.$route.params.album_name,
      hovering: false,
      filledStars: 0,
      hoveredStars: 0,
      rated: false,
      flagged: false,
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    setRating(stars) {
      this.filledStars = stars;
    },
    async load() {
      try {
        const token = this.user.access_token;
        const response = await fetch("http://127.0.0.1:5000/load", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const res = await response.json();
          const music = {
            songs: res.Songs,
            albums: res.Albums,
            playlists: res.Playlists,
            flagged: res.Flagged,
          };
          localStorage.setItem("music", JSON.stringify(music));

          this.updateMusic();
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    updateMusic() {
      this.$forceUpdate();
    },
    getFlagURL(song) {
      return `/flag/${song.Song_ID}`;
    },
    async submitRating(song_name) {
      try {
        const token = this.user.access_token;
        const response = await fetch("http://127.0.0.1:5000/api/rate", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rating: this.filledStars,
            songName: song_name,
          }),
        });
        if (response.ok) {
          this.rated = true;
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    getSongUrl(song) {
      localStorage.setItem("playSong", JSON.stringify(song));

      this.$router.push(`/song/${song.Song_Name}`);
    },
    openModal(song) {
      this.currentSong = song;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async getPlaylists() {
      try {
        const token = this.user.access_token;
        const response = await fetch(
          `http://127.0.0.1:5000/api/playlist/${this.user.user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const res = await response.json();

          this.music.playlists = res.playlists;
          localStorage.setItem("music", JSON.stringify(this.music));

          this.$router.push("/playlists");
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
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
          this.$router.push("/dashboard");
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
    songs() {
      let filteredSongs = [];
      for (const song of this.music.songs) {
        if (song.Album_Name === this.albumName) {
          filteredSongs.push(song);
        }
      }
      return filteredSongs;
    },
    playlists() {
      return this.music.playlists;
    },
  },
};
</script>

<style scoped>
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

.card {
  width: 18rem;
  margin: 20px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  background-color: #080808;
  color: #ffffff;
  text-decoration: solid;
  font-weight: bold;
}

.card-stats {
  width: 30rem;
  margin: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}

.card-body {
  padding: 15px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.card-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  margin-right: 15px;
  transition: color 0.3s ease-in-out;
}

.card-link:hover {
  color: #0056b3;
}

.card-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align buttons at the bottom */
  padding: 0 10px;
  margin-bottom: 10%; /* Add margin-top to adjust vertical alignment */
}

.card-link,
.like-button,
.playlist-button {
  background: none;
  border: none;
  padding: 0;
  font-family: inherit;
  font-size: 2rem;
  cursor: pointer;
  text-align: left;
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
.card-link:hover::after,
.like-button:hover::after {
  content: attr(title);
  position: absolute;
  top: -10px; /* Adjust the distance above the symbol */
  background-color: #333;
  color: #fff;
  padding: 2px;
  border-radius: 5px;
  font-size: 0.8rem;
}
.card-link:hover,
.like-button:hover,
.playlist-button:hover {
  color: #0056b3; /* Change to your preferred hover color */
}

.image-container {
  position: relative;
}

.image-container img {
  width: 100%;
  transition: filter 0.3s ease;
}

.rating-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Semi-transparent white background */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none; /* Prevents interactions with the rating screen when hidden */
  transition: opacity 0.3s ease;
}

.image-container:hover .rating-screen {
  opacity: 1;
  pointer-events: auto; /* Enable interactions with the rating screen on hover */
}

/* Style the stars for rating */
.rating-stars {
  font-size: 24px; /* Adjust size as needed */
}

/* Adjust styles for when the star is selected */
.star.selected {
  color: #ffbb00; /* Selected star color */
}

.star {
  cursor: pointer;
  color: #ddd; /* Default star color */
}

.star.filled {
  color: #333; /* Filled star color */
}

.dashboard-container {
  display: flex;
  background-image: url(../assets/Dashboard.jpeg);
  background-size: cover;
  background-repeat: repeat;
  background-position: center center;
  min-height: 100vh;

  /* Set the height of the container to 100% of the viewport height */
}

.main-content {
  flex: 1;
  padding: 20px; /* Add padding to create space for the sidebar */
  margin-top: -19.8px;
  margin-left: -20px;
}
</style>
