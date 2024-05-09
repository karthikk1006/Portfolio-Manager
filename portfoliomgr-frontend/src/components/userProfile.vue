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

      <div class="container-fluid mt-3">
        <div class="row">
          <div class="col-md-8">
            <div v-if="showPlaylists">
              <!-- Cards for creator songs -->
              <div class="heading-container">
                <h2
                  class="heading"
                  style="
                    font-size: 2rem;
                    margin-bottom: 10px;
                    margin-top: 10px;
                    color: #ffffff;
                    margin-left: 0;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: bold;
                  "
                >
                  {{ user.user_name }}'s Playlists
                </h2>
              </div>

              <div class="card-deck">
                <!-- Example card (replace with dynamic content) -->

                <div
                  v-for="playlist in playlists"
                  :key="playlist.Playlist_ID"
                  class="card-wrapper"
                >
                  <div v-if="playlist.User_ID == user.user_id">
                    <div class="card" style="width: 18rem; margin: 10px">
                      <div class="card-body">
                        <h5 class="card-title">{{ playlist.Playlist_Name }}</h5>
                      </div>

                      <div class="card-buttons">
                        <button
                          class="btn btn-primary"
                          @click="removePlaylist(playlist.Playlist_ID)"
                          style="margin-left: 85px"
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

          <!-- Right side for statistics -->
          <div class="col-md-4">
            <div class="profile-card">
              <div class="card-body">
                <h5 class="card-title">{{ user.user_name }}'s Profile</h5>
                <div class="d-flex justify-content-center">
                  <img
                    class="rounded-circle profile-picture"
                    :src="`http://127.0.0.1:5000/static/users/${user.profile}`"
                    alt="`http://127.0.0.1:5000/static/users/user.jpeg`"
                    height="220px"
                    width="180px"
                  />
                </div>
                <div class="d-flex justify-content-around">
                  <div class="rounded-circle text-center profile-stat mt-5">
                    <!-- Added mt-4 class for margin top -->
                    <h6 class="mb-0">{{ user_no_of_playlists }}</h6>
                    <p class="mb-0">playlists</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="heading-container">
              <h2
                class="heading"
                style="
                  font-size: 2rem;
                  margin-bottom: 10px;
                  margin-top: 10px;
                  color: #ffffff;
                  margin-left: 0;
                  text-transform: uppercase;
                  letter-spacing: 2px;
                  font-weight: bold;
                "
              >
                {{ user.user_name }}'s Flagged Songs
              </h2>
            </div>
            <div class="card-deck">
              <!-- Example card (replace with dynamic content) -->

              <div
                v-for="flagsong in flagged"
                :key="flagsong.Song_ID"
                class="card-wrapper"
              >
                <div v-if="flagsong.User_ID == user.user_id">
                  <div v-for="song in songs" :key="song.Song_ID">
                    <div v-if="song.Song_ID == flagsong.Song_ID">
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
                          <div class="rating-screen" v-if="hovering">
                            <p style="color: black">
                              Current rating : {{ song.Rating }}
                            </p>
                          </div>
                        </div>

                        <div class="card-body">
                          <h5 class="card-title">{{ song.Song_Name }}</h5>
                          <p>Reason : {{ flagsong.Reason }}</p>
                        </div>

                        <div class="card-buttons">
                          <button
                            @click="getSongUrl(song)"
                            class="card-link play-link"
                            title="Play Song"
                            style="margin-left: 100px"
                          >
                            <img
                              src="../assets/Play.png"
                              height="50px"
                              weight="50px"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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
  name: "UserProfileVue",
  data() {
    return {
      hovering: false,
      showModal: false,
      showPlaylists: true,
      playlist_name: "",
      user_no_of_playlists: 0,
      error: "",
    };
  },
  mounted() {
    this.load();
    for (const playlist of this.playlists) {
      if (this.user.user_id == playlist.User_ID) {
        this.user_no_of_playlists++;
      }
    }
  },
  methods: {
    async getSongUrl(song) {
      localStorage.setItem("playSong", JSON.stringify(song));
      try {
        const token = this.user.access_token;
        const response = await fetch("http://127.0.0.1:5000/listener/data", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            User_ID: this.user.user_id,
            Song_ID: song.Song_ID,
          }),
        });

        if (response.ok) {
          this.$router.push(`/song/${song.Song_Name}`);
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
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
    getAlbumURL(album_name) {
      return `/edit/albums/${album_name}`;
    },
    getSongURL(song_name) {
      return `/edit/songs/${song_name}`;
    },
    showSongs(playlist_name) {
      this.showPlaylists = false;
      this.playlist_name = playlist_name;
    },
    async removePlaylist(playlist_id) {
      const token = this.user.access_token;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/playlist/delete/${playlist_id}`,
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
      } catch (error) {
        console.log(error);
      }
    },

    async removeSong(song_id) {
      const token = this.user.access_token;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/songs/${song_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          alert("Song deleted!");
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
    albums() {
      return this.music.albums;
    },
    songs() {
      return this.music.songs;
    },
    playlists() {
      return this.music.playlists;
    },
    flagged() {
      return this.music.flagged;
    },
  },
};
</script>
<style scoped>
.btn.btn-primary {
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
.card-buttons:hover {
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

.profile-stat {
  width: 80px;
  height: 80px;
  background-color: #ffffff; /* You can change the color */
  color: #000000;
  font-size: 16px;
  padding: 10px;
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

.profile-card {
  margin-top: 120px;
  background-color: #000000; /* Card background color */
  color: #fff; /* Text color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 8px;
}

.heading-container {
  background: linear-gradient(
    to right,
    #1f1f21,
    #63646f
  ); /* Gradient background */
  border-radius: 10px; /* Rounded corners */

  padding: 10px 20px; /* Padding */
  margin-top: 20px;
  margin-left: -40%;
  margin-bottom: 10px; /* Margin bottom for spacing */
  display: inline-block; /* Display as inline-block */
  text-align: center; /* Center text horizontally */
}

.heading {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
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
  background-repeat: repeat;
  background-position: center center;
  min-height: 200vh;
  /* Set the height of the container to 100% of the viewport height */
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

.heading-container {
  background: linear-gradient(
    to right,
    #1f1f21,
    #63646f
  ); /* Gradient background */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Subtle shadow effect */
  padding: 10px 20px; /* Padding */
  margin-top: 20px;
  margin-bottom: 10px; /* Margin bottom for spacing */
  display: inline-block; /* Display as inline-block */
  text-align: center; /* Center text horizontally */
}

.heading {
  margin: 0;
  font-size: 2rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
}
.profile-stat {
  width: 80px;
  height: 80px;
  background-color: #ffffff; /* You can change the color */
  color: #000000;
  font-size: 16px;
  padding: 10px;
}

.profile-card {
  margin-top: 120px;
  background-color: #000000; /* Card background color */
  color: #fff; /* Text color */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
