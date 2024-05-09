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
            <div v-if="showAlbums">
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
                  {{ user.user_name }}'s Albums
                </h2>
              </div>

              <div class="card-deck">
                <!-- Example card (replace with dynamic content) -->

                <div
                  v-for="album in albums"
                  :key="album.Album_ID"
                  class="card-wrapper"
                >
                  <div v-if="album.Creator_ID == user.user_id">
                    <div class="card" style="width: 18rem; margin: 10px">
                      <img
                        :src="`http://127.0.0.1:5000/static/${album.Album_Image}`"
                        alt="Album Image"
                        height="300px"
                      />

                      <div class="card-body">
                        <h5 class="card-title">{{ album.Album_Name }}</h5>
                      </div>

                      <div class="card-buttons">
                        <button
                          class="btn btn-primary"
                          @click="showSongs(album.Album_Name)"
                        >
                          Songs
                        </button>
                        <router-link
                          :to="getAlbumURL(album.Album_Name)"
                          class="btn btn-primary"
                          >Edit</router-link
                        >
                        <button
                          class="btn btn-primary"
                          @click="removeAlbum(album.Album_ID)"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="col-md-8">
                <!-- Cards for creator songs -->
                <div class="heading-container">
                  <h2
                    class="heading"
                    style="
                      font-size: 2rem;
                      margin-bottom: 10px;
                      margin-top: 10px;
                      color: #ffffff;

                      text-transform: uppercase;
                      letter-spacing: 2px;
                      font-weight: bold;
                    "
                  >
                    {{ albumName }}'s Songs
                  </h2>
                </div>

                <div class="card-deck">
                  <!-- Example card (replace with dynamic content) -->

                  <div
                    v-for="song in songs"
                    :key="song.Song_ID"
                    class="card-wrapper"
                  >
                    <div v-if="song.Album_Name == albumName">
                      <div class="card" style="width: 18rem; margin: 10px">
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
                            :to="getSongURL(song.Song_Name)"
                            class="btn btn-primary"
                            >Edit</router-link
                          >
                          <button
                            class="btn btn-primary"
                            @click="removeSong(song.Song_ID)"
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
          </div>

          <!-- Right side for statistics -->
          <div class="col-md-4">
            <div class="profile-card">
              <div class="card-body">
                <h5 class="card-title">{{ user.user_name }}'s Profile</h5>
                <div class="d-flex justify-content-center">
                  <img
                    class="rounded-circle profile-picture"
                    :src="`http://127.0.0.1:5000/static/creators/${user.profile}`"
                    alt="Profile Picture"
                    height="220px"
                    width="180px"
                  />
                </div>
                <div class="d-flex justify-content-around">
                  <div class="rounded-circle text-center profile-stat mt-5">
                    <!-- Added mt-4 class for margin top -->
                    <h6 class="mb-0">{{ creator_no_of_songs }}</h6>
                    <p class="mb-0">Songs</p>
                  </div>
                  <div class="rounded-circle text-center profile-stat mt-5">
                    <!-- Added mt-4 class for margin top -->
                    <h6 class="mb-0">{{ creator_no_of_albums }}</h6>
                    <p class="mb-0">Albums</p>
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
  name: "CreatorProfileVue",
  data() {
    return {
      showAlbums: true,
      albumName: "",
      creator_no_of_songs: 0,
      creator_no_of_albums: 0,
    };
  },
  mounted() {
    this.load();
    for (const song of this.songs) {
      if (this.user.user_id == song.Creator_ID) {
        this.creator_no_of_songs++;
      }
    }

    for (const album of this.albums) {
      if (this.user.user_id == album.Creator_ID) {
        this.creator_no_of_albums++;
      }
    }
  },
  methods: {
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
    showSongs(album_name) {
      this.showAlbums = false;
      this.albumName = album_name;
    },
    async removeAlbum(album_id) {
      const token = this.user.access_token;
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/albums/delete/${album_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          alert("Album deleted!");
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
</style>
