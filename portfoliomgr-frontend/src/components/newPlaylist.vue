<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="!error"
  >
    <form
      @submit.prevent="createPlaylist"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Create Playlist</h2>

      <div class="form-group">
        <label>Enter Playlist Name:</label>
        <input
          v-model="Playlist_Name"
          type="text"
          class="form-control"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div v-else class="error-message">
    <p class="text-danger">Error Occurred!</p>
    <router-link to="/" class="btn btn-dark btn-sm"
      >Go Back to Login</router-link
    >
  </div>
</template>

<script>
export default {
  name: "newPlaylistVue",
  data() {
    return {
      Playlist_Name: "",
      error: false,
    };
  },

  methods: {
    reloadPage() {
      window.location.reload(); // Reloads the current page
    },
    async createPlaylist() {
      try {
        const token = this.user.access_token;
        const response = await fetch("http://127.0.0.1:5000/api/playlist", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            UserId: this.user.user_id,
            UserName: this.user.user_name,
            PlaylistName: this.Playlist_Name,
          }),
        });

        if (response.ok) {
          alert("Playlist created!");
          this.$router.push("/playlists");
        } else {
          this.error = true;
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
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

.success-message,
.error-message {
  background-color: #f8f9fa;
  border: 1px solid;
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
  text-align: center;
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
