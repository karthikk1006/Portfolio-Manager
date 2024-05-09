<template>
  <div v-if="isUser">
    <div class="dashboard-container">
      <div class="sidebar">
        <div class="sidebar-header">
          <h2>{{ user.user_name }}'s Home</h2>
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />

        <router-link to="/stocksInfo" class="btn btn-primary">
          Stock Info
        </router-link>

        <router-link to="/addShares" class="btn btn-primary"
          >Add Shares</router-link
        >
      </div>

      <div class="main-content">
        <nav class="navbar">
          <ul class="nav-list"></ul>
          <ul class="nav-list justify-content-end">
            <li class="nav-item">
              <router-link to="/userProfile" class="btn btn-primary"
                >Profile</router-link
              >
            </li>

            <li class="nav-item">
              <router-link to="/about" class="btn btn-primary"
                >About Us</router-link
              >
            </li>
            <li class="nav-item logout">
              <router-link to="/" class="btn btn-primary">Logout</router-link>
            </li>
          </ul>
        </nav>

        <div>
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
              Stocks Owned
            </h2>
          </div>

          <div style="display: flex; flex-wrap: wrap">
            <div
              v-for="stock in stocksOwned"
              :key="stock.symbol"
              class="card-wrapper"
            >
              <div class="card" style="width: 18rem; margin: 10px">
                <div
                  class="image-container"
                  @mouseenter="hovering = true"
                  @mouseleave="hovering = false"
                >
                  <img
                    :src="`http://localhost:5050/static/${stock.symbol}.png`"
                    :alt="stock.name"
                    height="300px"
                  />
                </div>

                <div class="card-body">
                  <h3 class="card-title">{{ stock.name }}</h3>
                  <p>Stock Name : {{ stock.symbol }}</p>
                  <p>Current : {{ stock.current }}</p>
                  <p>Quantity : {{ stock.qty }}</p>
                </div>

                <div class="card-buttons">
                  <button
                    @click="getStockInfo(stock)"
                    class="card-link play-link"
                    title="Get Info"
                  >
                    ❓
                  </button>

                  <button
                    @click="openModal(stock.symbol)"
                    class="card-link play-link"
                    title="Sell"
                  >
                    ❌
                  </button>

                  <div
                    class="modal-overlay"
                    v-if="showModal && currentStock == stock.symbol"
                  >
                    <div
                      class="modal-content"
                      style="
                        background-color: black;
                        color: #ffffff;
                        outline: 2px solid white;
                      "
                    >
                      <h3>Select Quantity</h3>
                      <select v-model="quantity">
                        <option
                          v-for="num in Array.from(Array(stock.qty).keys())"
                          :key="num"
                          :value="num + 1"
                        >
                          {{ num + 1 }}
                        </option>
                      </select>
                      <button
                        class="btn btn-primary"
                        @click="sellStock(stock, this.quantity)"
                      >
                        Sell
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
    </div>
  </div>

  <div v-else class="error-message">
    <p class="text-danger">LOGIN TO ACCESS DASHBOARD!</p>
    <router-link to="/" class="btn btn-dark btn-sm"
      >Go Back to Login</router-link
    >
  </div>
</template>

<script>
import { BASE_URL } from "@/assets/constants";
export default {
  name: "DashboardVue",

  data() {
    return {
      error: false,
      showModal: false,
      quantity: 0,
      currentStock: "",
      hovering: false,

      errors: false,
    };
  },
  mounted() {
    this.load(this.user.user_id);
    console.log(this.stocksOwned);
  },
  methods: {
    async sellStock(stock, quantity) {
      try {
        const response = await fetch(`${BASE_URL}/sell/${this.user_id}`, {
          method: "UPDATE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stockSymbol: stock.symbol,
            qty: quantity,
          }),
        });
        if (response.ok) {
          this.load();
        } else {
          console.log("error");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async exportSongs() {
      try {
        const response = await fetch(`http://127.0.0.1:5000/export/songs`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "songs.csv");
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      } catch (error) {
        console.log(error);
      }
    },

    getAlbumURL(album_name) {
      return `/album/${album_name}`;
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
    setRating(stars) {
      this.filledStars = stars;
    },
    async load(user_id) {
      try {
        const response = await fetch(`${BASE_URL}/getshares/${user_id}`, {
          method: "GET",
        });
        if (response.ok) {
          const res = await response.json();
          console.log(res);
          const stocksOwned = {
            stocks: res.data,
          };

          localStorage.setItem("stocksOwned", JSON.stringify(stocksOwned));

          this.updateStock();
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },
    updateStock() {
      this.$forceUpdate();
    },

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

    openModal(stock) {
      this.currentStock = stock;
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

    stocksOwned() {
      return JSON.parse(localStorage.getItem("stocksOwned")).stocks;
    },

    stocks() {
      return JSON.parse(localStorage.getItem("stocks"));
    },

    stockName() {
      return (stock) => stock.name;
    },

    stockSymbol() {
      return (stock) => stock.symbol;
    },

    music() {
      return JSON.parse(localStorage.getItem("music"));
    },
    new_music() {
      return JSON.parse(localStorage.getItem("new_music"));
    },
    isCreator() {
      if (this.user.role == "creator") {
        return true;
      }
      return false;
    },
    isAdmin() {
      if (this.user.role == "admin") {
        return true;
      }
      return false;
    },
    isUser() {
      if (this.user.role == "user") {
        return true;
      }
      return false;
    },
    allSongs() {
      return this.music.songs;
    },
    allAlbums() {
      return this.music.albums;
    },
    playlists() {
      return this.music.playlists;
    },
    no_of_songs() {
      return this.music.songs.length;
    },
    no_of_albums() {
      return this.music.albums.length;
    },
    new_music_data() {
      return this.new_music.new_music_data;
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

.main-content {
  flex: 1;
  padding: 20px; /* Add padding to create space for the sidebar */
  margin-top: -19.8px;
  margin-left: 230px;
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

<!-- /Users/pranav/DBMS_Project/Portfolio-Manager/portfoliomgr-frontend/src/assets/static/AAPL.png -->
