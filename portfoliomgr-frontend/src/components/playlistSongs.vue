<template>
  <div v-if="!error" class="dashboard-container">
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
          <li class="nav-item">
            <button class="btn btn-primary" @click="getPlaylists">
              Playlists
            </button>
          </li>
          <li class="nav-item logout">
            <router-link to="/" class="btn btn-primary">Logout</router-link>
          </li>
        </ul>
      </nav>

      <div style="display: flex; flex-wrap: wrap">
        <div v-for="song in songs" :key="song.Song_ID" class="card-wrapper">
          <div class="card" style="width: 18rem">
            <img
              :src="`http://127.0.0.1:5000/static/${song.Album_Image}`"
              alt="Album Image"
              height="300px"
            />

            <div class="card-body">
              <h5 class="card-title">{{ song.Song_Name }}</h5>
            </div>

            <div class="card-buttons">
              <router-link
                to="/song/:id"
                class="card-link play-link"
                title="Play Song"
                ><img src="../assets/Play.png" height="50px" weight="50px"
              /></router-link>

              <button
                class="playlist-button"
                @click="openModal(song.Song_ID)"
                title="Remove"
              >
                ❌
              </button>

              <div
                class="modal-overlay"
                v-if="showModal && currentSong == song.Song_ID"
              >
                <div class="modal-content">
                  <h3>Remove?</h3>
                  <button
                    @click="removeFromPlaylist(song.Playlist_ID, song.Song_ID)"
                  >
                    Remove from Playlist?
                  </button>
                  <button @click="closeModal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="error-message dashboard-container">
    <p class="text-danger">Error Occurred!</p>
    <router-link to="/" class="btn btn-dark btn-sm"
      >Go Back to Login</router-link
    >
  </div>
</template>

<script>
export default {
  name: "playlistSongsVue",
  data() {
    return {
      error: false,
      showModal: false,
      currentSong: null,
    };
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    music() {
      return JSON.parse(localStorage.getItem("music"));
    },
    songs() {
      return JSON.parse(localStorage.getItem("playlistSongs"));
    },
  },
  methods: {
    openModal(song) {
      this.currentSong = song;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async removeFromPlaylist(playlist_id, song_id) {
      try {
        const token = this.user.access_token;
        const response = await fetch(
          `http://127.0.0.1:5000/api/playlist/songs/${playlist_id}/${song_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          alert("Song removed!");
          this.$router.push("/playlists");
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
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

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

.dashboard-container {
  display: flex;
  background-image: url(../assets/Dashboard.jpeg);
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

.main-content {
  flex: 1;
  padding: 20px; /* Add padding to create space for the sidebar */
  margin-top: -19.8px;
  margin-left: -20px;
}
</style>
