<template>
  <div>
    <!-- Navbar -->
    <nav class="navbar">
      <ul class="nav-list">
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

    <!-- About Us Section -->
    <div class="about-us-container">
      <div class="about-us-card">
        <div class="about-us-content" id="aboutUsContent">
          <h1>Welcome to Portfolio Manager</h1>
          <p>\text to be included\</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutVue",
  mounted() {
    // Trigger the scrolling animation when the component is mounted
    this.animateText();
  },
  methods: {
    animateText() {
      // Add a class to start the scrolling animation
      document
        .getElementById("aboutUsContent")
        .classList.add("scroll-animation");
    },
  },
};
</script>

<style scoped>
/* Navbar Styling */
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

.logout a {
  color: #fff; /* White text color for logout link */
}

/* About Us Container Styling */
.about-us-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../assets/BG.jpg);
  background-repeat: no-repeat;
  background-size: cover;
}

/* About Us Card Styling */
.about-us-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* About Us Content Styling */
.about-us-content {
  max-width: 800px;
  text-align: center;
}

/* General Styling */
body {
  background-color: #f8f9fa; /* Add a light background color */
  font-family: "Arial", sans-serif;
  color: #343a40; /* Set text color */
}

h1 {
  color: #007bff; /* Set heading color */
}

.btn-primary {
  background-color: #007bff; /* Set primary button color */
  color: #fff; /* Set primary button text color */
}

/* Scroll Animation */
</style>
