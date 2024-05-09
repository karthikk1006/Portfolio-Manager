<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="!editImg && !editName && !success && !error"
  >
    <form
      @submit.prevent="showForm"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Image/Name ?</h2>

      <div class="form-group">
        <label>Choose what you want to do</label>
        <select v-model="option">
          <option>Edit Image</option>
          <option>Edit Name</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>
  </div>

  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
    v-if="editImg && !success && !error"
  >
    <form
      @submit.prevent="editAlbumImg(album)"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Album Image</h2>

      <div class="form-group">
        <label>Upload Image</label>
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
      @submit.prevent="editAlbumName(album)"
      class="container p-5 rounded-lg shadow-lg custom-form"
    >
      <h2 class="text-center mb-4">Edit Album Name</h2>

      <div class="form-group">
        <label>Album Name</label>
        <input type="text" v-model="newAlbumName" />
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
  name: "editAlbumVue",
  data() {
    return {
      option: "",
      editImg: false,
      editName: false,
      success: false,
      error: false,
      album: "",
      imgFile: "",
      newAlbumName: "",
    };
  },
  mounted() {
    this.album = this.$route.params.album_name;
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
  },
  methods: {
    showForm() {
      if (this.option == "Edit Image") {
        this.editImg = true;
      } else if (this.option == "Edit Name") {
        this.editName = true;
      } else {
        this.error = true;
      }
    },

    onFileChange(event) {
      this.imgFile = event.target.files[0];
    },

    async editAlbumImg(album_name) {
      try {
        const token = this.user.access_token;
        const editData = new FormData();
        editData.append("Album_Name", album_name);
        editData.append("Album_Img", this.imgFile);
        editData.append("Option", "Edit Image");

        const response = await fetch("http://127.0.0.1:5000/api/albums", {
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

    async editAlbumName(album_name) {
      try {
        const token = this.user.access_token;
        const editData = new FormData();
        editData.append("Album_Name", this.newAlbumName);
        editData.append("oldAlbumName", album_name);
        editData.append("Option", "Edit Name");

        const response = await fetch("http://127.0.0.1:5000/api/albums", {
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
