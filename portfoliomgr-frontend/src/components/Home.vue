<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <div class="card border-primary text-center" style="width: 40rem">
      <div class="card-body">
        <h1 class="card-title">Welcome to Portfolio-Manager!</h1>
        <div>
          <router-link to="/login" class="btn btn-primary mr-2"
            >Login</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeVue",
  mounted() {
    const user = {
      user_id: "",
      user_name: "",
      user_email: "",
      access_token: "",
      role: "",
    };

    const music = {
      songs: "",
      albums: "",
      playlists: "",
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("music", JSON.stringify(music));
  },
};
</script>

<style scoped>
#main {
  background-image: url(../assets/BG.jpg);
  background-size: 100%;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
