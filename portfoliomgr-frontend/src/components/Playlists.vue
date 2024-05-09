<template>
  <div v-if="!error">
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <h3>{{ user.user_name }}'s Playlists</h3>
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <router-link to="/liked-songs" class="sidebar-link">
          Liked Songs
        </router-link>
        <router-link to="/dashboard" class="btn btn-primary"
          >Dashboard</router-link
        >

        <router-link to="/search" class="sidebar-link">Search 🔍</router-link>
      </div>

      <div class="main-content">
        <nav class="navbar">
          <ul class="nav-list">
            <li class="nav-item">
              <router-link to="/about" class="btn btn-primary"
                >About Us</router-link
              >
            </li>
          </ul>
          <ul class="nav-list justify-content-end">
            <li class="nav-item">
              <router-link to="/newPlaylist" class="btn btn-primary"
                >+ Playlist</router-link
              >
            </li>
            <li class="nav-item logout">
              <router-link to="/" class="btn btn-primary">Logout</router-link>
            </li>
          </ul>
        </nav>

        <div class="playlist-container">
          <div
            v-for="playlist in allPlaylists"
            :key="playlist.Playlist_ID"
            class="card-wrapper"
          >
            <div
              class="card"
              style="
                width: 18rem;
                margin: 10px;
                height: 15rem;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              "
            >
              <div
                class="card-body d-flex flex-column justify-content-center align-items-center"
              >
                <h5 class="card-title mb-3" style="font-size: 1.5rem">
                  {{ playlist.Playlist_Name }}
                </h5>
              </div>

              <div class="card-buttons mt-auto">
                <button
                  class="btn btn-light"
                  @click="getSongs(playlist.Playlist_ID)"
                >
                  View Songs
                </button>
                <button
                  class="btn btn-light ml-2"
                  @click="deletePlaylist(playlist.Playlist_ID)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="error-message">
    <p class="text-danger">Error Occurred!</p>
    <router-link to="/" class="btn btn-dark btn-sm"
      >Go Back to Login</router-link
    >
  </div>
</template>

<script>
import { useStore } from "../stores/store";
export default {
  name: "PlaylistVue",
  data() {
    return {
      error: false,
      loaded: false,
    };
  },
  mounted() {
    this.load();
  },

  computed: {
    userstore() {
      return useStore();
    },
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    music() {
      return JSON.parse(localStorage.getItem("music"));
    },
    allPlaylists() {
      return this.music.playlists;
    },
  },
  methods: {
    updateMusic() {
      this.$forceUpdate();
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
          const new_music = {
            new_music_data: res.new_music_data,
          };
          localStorage.setItem("music", JSON.stringify(music));
          localStorage.setItem("new_music", JSON.stringify(new_music));

          this.updateMusic();
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    async deletePlaylist(playlist_id) {
      const token = this.user.access_token;
      const response = await fetch(
        "http://127.0.0.1:5000/api/playlist/delete/" + playlist_id,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Playlist deleted!");
        this.$router.push("/dashboard");
      } else {
        this.error = true;
      }
    },

    async getSongs(playlist_id) {
      const token = this.user.access_token;
      const response = await fetch(
        `http://127.0.0.1:5000/api/playlist/songs/${playlist_id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const res = await response.json();
        const songs = res.playlistSongs;
        localStorage.setItem("playlistSongs", JSON.stringify(songs));
        this.$router.push("/playlists/songs");
      } else {
        this.error = true;
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

.card-buttons {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; /* Align buttons at the bottom */
  padding: 0 10px;

  margin-bottom: 10%; /* Add margin-top to adjust vertical alignment */
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}

.sidebar {
  height: 100%;
  width: 250px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #000000;
  padding-top: 20px;
  color: #818181;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 20px;
}

.dashboard-container {
  display: flex;
  background-image: url(../assets/Dashboard.jpeg);
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px;
  margin-top: -19.8px;
  margin-left: -20px;
}
.playlist-container {
  margin-left: 20%;
  display: flex;
  flex-wrap: wrap;
}
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}
</style>
