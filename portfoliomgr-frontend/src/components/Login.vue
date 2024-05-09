<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <form
      @submit.prevent="login"
      class="container p-5 rounded-lg shadow-lg custom-form"
      v-if="!error"
    >
      <h2 class="text-center text-dark mb-3">Login</h2>
      <div class="form-group">
        <label class="text-dark">Enter your User Email:</label>
        <input type="email" v-model="UserEmail" class="form-control" required />
      </div>

      <div class="form-group">
        <label class="text-dark">Enter your Password:</label>
        <input type="password" v-model="Pswd" class="form-control" required />
      </div>

      <div
        class="form-group mb-2 d-flex justify-content-between align-items-center"
        style="font-size: 80%"
      >
        <router-link to="/signup" class="btn btn-info btn-sm"
          >Sign Up</router-link
        >
        <button type="submit" class="btn btn-primary btn-sm">Submit</button>
      </div>
      <p
        class="text-dark"
        style="text-align: left; font-size: 80%; margin-left: -10px"
      >
        Don't have an account?
      </p>
    </form>

    <div v-else class="error-message">
      <p class="text-danger">INVALID CREDENTIALS!</p>
      <router-link to="/" class="btn btn-dark btn-sm"
        >Go Back to Login</router-link
      >
    </div>
  </div>
</template>

<script>
import { BASE_URL } from "@/assets/constants.js";

export default {
  name: "LoginVue",
  data() {
    return {
      UserEmail: "",
      Pswd: "",
      Admin: false,
      error: false,
    };
  },

  mounted() {
    const eraseState = {
      user_id: "",
      user_name: "",
      user_email: "",
      role: "",
    };

    localStorage.setItem("user", JSON.stringify(eraseState));
  },

  methods: {
    async login() {
      try {
        const response = await fetch(`${BASE_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.UserEmail,
            password: this.Pswd,
          }),
        });
        if (response.ok) {
          const res = await response.json();
          console.log(res);
          const user = {
            user_id: res.data.id,
            user_name: res.data.name,
            user_email: res.data.email,
            role: res.data.role,
            stocks: res.stockList,
          };

          const stocks = {
            allStocks: res.allStocksList,
          };

          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("stocks", JSON.stringify(stocks));
          this.$router.push("/dashboard");
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
  background-image: url(../assets/BG.jpg);
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
.error-message {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 5px;
  padding: 10px;
  margin-top: 10px;
}
</style>
