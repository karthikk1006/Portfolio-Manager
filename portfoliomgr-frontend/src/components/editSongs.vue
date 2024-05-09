<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="!editLyrics && !editName && !success && !error"
  >
    <form
      @submit.prevent="showForm"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Lyrics/Name ?</h2>

      <div class="form-group">
        <label>Choose what you want to do</label>
        <select v-model="option">
          <option>Edit Lyrics</option>
          <option>Edit Name</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="editLyrics && !success && !error"
  >
    <form
      @submit.prevent="editSongLyrics(song)"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Song Lyrics</h2>

      <div class="form-group">
        <label>Upload new lyrics</label>
        <input type="file" @change="onFileChange" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="editName && !success && !error"
  >
    <form
      @submit.prevent="editSongName(song)"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Song Name</h2>

      <div class="form-group">
        <label>Song Name</label>
        <input type="text" v-model="newSongName" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

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
</template>

<script>
export default {
  name: "editSongVue",
  data() {
    return {
      option: "",
      editLyrics: false,
      editName: false,
      success: false,
      error: false,
      song: "",
      lyricsFile: "",
      newSongName: "",
    };
  },
  mounted() {
    this.song = this.$route.params.song_name;
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
  },
  methods: {
    showForm() {
      if (this.option == "Edit Lyrics") {
        this.editLyrics = true;
      } else if (this.option == "Edit Name") {
        this.editName = true;
      } else {
        this.error = true;
      }
    },

    onFileChange(event) {
      this.lyricsFile = event.target.files[0];
    },

    async editSongLyrics(song_name) {
      try {
        const token = this.user.access_token;
        const editData = new FormData();
        editData.append("Song_Name", song_name);
        editData.append("Song_Lyrics", this.lyricsFile);
        editData.append("Option", "Edit Lyrics");

        const response = await fetch("http://127.0.0.1:5000/api/songs", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: editData,
        });

        if (response.ok) {
          this.success = true;
        } else {
          this.error = true;
        }
      } catch (error) {
        this.error = true;
      }
    },

    async editSongName(song_name) {
      try {
        const token = this.user.access_token;
        const editData = new FormData();
        editData.append("Song_Name", this.newSongName);
        editData.append("oldSongName", song_name);
        editData.append("Option", "Edit Name");

        const response = await fetch("http://127.0.0.1:5000/api/songs", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: editData,
        });

        if (response.ok) {
          console.log("hi");
          this.success = true;
        } else {
          console.log("hello");
          this.error = true;
        }
      } catch (error) {
        console.log("world");
        this.error = true;
      }
    },
  },
};
</script>
