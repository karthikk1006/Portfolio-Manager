<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="!createSong && !createAlbum && !success && !error"
  >
    <form
      @submit.prevent="showForm"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Create Song/ Album ?</h2>

      <div class="form-group">
        <label>Choose what you want to do</label>
        <select v-model="option">
          <option>Create Album</option>
          <option>Create Song</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="createSong && !success && !error"
  >
    <form
      @submit.prevent="addSongToAlbum"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Upload Song</h2>

      <div class="form-group">
        <label>Choose Album</label>
        <select v-model="album">
          <option
            v-for="album in creatorAlbums.creator_albums"
            :key="album.album_id"
          >
            {{ album.AlbumName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Enter Song Name</label>
        <input type="text" v-model="songName" />
      </div>

      <div class="form-group">
        <label>Upload Song</label>
        <input type="file" @change="onFileChange" />
      </div>

      <div class="form-group">
        <label>Upload Song Lyrics</label>
        <input type="file" @change="onLyricsFileChange" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="createAlbum && !success && !error"
  >
    <form
      @submit.prevent="addAlbum"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Create Album</h2>

      <div class="form-group">
        <label>Album Name</label>
        <input type="text" v-model="albumName" />
      </div>

      <div class="form-group">
        <label>Upload Album Image</label>
        <input type="file" @change="onAlbumFileChange" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div class="result-message">
    <div v-if="success" class="success-message">
      <p>Song/Album created !</p>
      <router-link to="/dashboard" class="btn btn-success btn-sm"
        >Home</router-link
      >
    </div>
    <div v-if="error" class="error-message">
      <p>ERROR OCCURRED!</p>
      <router-link to="/dashboard" class="btn btn-danger btn-sm"
        >Try Again!</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "addSongVue",
  data() {
    return {
      option: "",
      createSong: false,
      createAlbum: false,
      album: "",
      songName: "",
      songFile: null,
      lyricsFile: null,
      success: false,
      error: false,

      albumName: "",
      albumFile: null,
    };
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    music() {
      return JSON.parse(localStorage.getItem("music"));
    },
    creatorAlbums() {
      return JSON.parse(localStorage.getItem("CreatorAlbums"));
    },
  },
  methods: {
    async showForm() {
      try {
        const token = this.user.access_token;
        const response = await fetch(
          `http://127.0.0.1:5000/api/albums/${this.user.user_id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const res = await response.json();
          const creatorAlbums = {
            user_id: this.user.user_id,
            user_name: this.user.user_name,
            creator_albums: res.albums,
          };
          console.log(creatorAlbums);
          localStorage.setItem("CreatorAlbums", JSON.stringify(creatorAlbums));

          if (this.option == "Create Album") {
            this.createAlbum = true;
          } else if (this.option == "Create Song") {
            this.createSong = true;
          } else {
            this.error = true;
          }
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    onFileChange(event) {
      this.songFile = event.target.files[0];
    },

    onLyricsFileChange(event) {
      this.lyricsFile = event.target.files[0];
    },

    async addSongToAlbum() {
      try {
        const token = this.user.access_token;
        const songData = new FormData();
        songData.append("songName", this.songName);
        songData.append("albumName", this.album);
        songData.append("songFile", this.songFile);
        songData.append("lyricsFile", this.lyricsFile);
        songData.append("creatorID", this.user.user_id);
        songData.append("creatorName", this.user.user_name);

        const response = await fetch("http://127.0.0.1:5000/api/songs", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: songData,
        });

        if (response.ok) {
          this.success = true;
        } else {
          this.error = true;
        }
      } catch (error) {
        console.log(error);
      }
    },

    onAlbumFileChange(event) {
      this.albumFile = event.target.files[0];
    },

    async addAlbum() {
      try {
        const token = this.user.access_token;

        const albumData = new FormData();
        albumData.append("albumName", this.albumName);
        albumData.append("albumImage", this.albumFile);
        albumData.append("userID", this.user.user_id);
        albumData.append("userName", this.user.user_name);

        const response = await fetch("http://127.0.0.1:5000/api/albums", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: albumData,
        });

        if (response.ok) {
          this.success = true;
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
#main {
  background-image: url(../assets/BG.png);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
.custom-form {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  width: 30%;
}

.custom-form label {
  font-weight: bold;
  color: #495057;
}

.custom-form input {
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 10px;
}

.custom-form button {
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  color: #fff;
  padding: 10px;
  cursor: pointer;
}

.custom-form button:hover {
  background-color: #0056b3;
}

.result-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.success-message,
.error-message {
  background-color: #f8f9fa;
  border: 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  text-align: center;
}

.success-message {
  border-color: #d4edda;
  color: #28a745;
}

.error-message {
  border-color: #f8d7da;
  color: #721c24;
}
</style>
