<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <form
      @submit.prevent="Signup"
      class="container p-5 rounded-lg shadow-lg custom-form"
      v-if="!success && !error"
    >
      <h2 class="text-center mb-4">Creator Registration</h2>

      <div class="form-group">
        <label>Enter User Name:</label>
        <input v-model="UserName" type="text" class="form-control" required />
      </div>

      <div class="form-group">
        <label>Upload Profile Picture :</label>
        <input type="file" @change="onFileChange" required />
      </div>

      <div class="form-group">
        <label>Enter User Email ID:</label>
        <input v-model="UserEmail" type="email" class="form-control" required />
      </div>

      <div class="form-group">
        <label>Enter Password:</label>
        <input
          v-model="UserPswd"
          type="password"
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label>Confirm Password:</label>
        <input
          v-model="ConfPswd"
          type="password"
          class="form-control"
          required
        />
      </div>
      <span
        v-if="PswdMisMatch"
        style="color: red; font-family: 'Courier New', Courier, monospace"
      >
        Passwords Don't Match!
      </span>

      <button
        type="submit"
        class="btn btn-primary btn-block"
        v-bind:disabled="PswdMisMatch"
      >
        Submit
      </button>
    </form>

    <div v-else class="result-message">
      <div v-if="success" class="success-message">
        <p>CREATOR SUCCESSFULLY CREATED!</p>
        <router-link to="/login" class="btn btn-success btn-sm"
          >Login</router-link
        >
      </div>
      <div v-if="error" class="error-message">
        <p>ERROR CREATING CREATOR!</p>
        <router-link to="/" class="btn btn-danger btn-sm">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "creatorSignUpVue",
  data() {
    return {
      UserName: "",
      UserEmail: "",
      UserPswd: "",
      ConfPswd: "",
      PswdMisMatch: false,
      success: false,
      error: false,
      profile: null,
    };
  },
  watch: {
    UserPswd() {
      this.validatePasswords();
    },
    ConfPswd() {
      this.validatePasswords();
    },
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
  },

  methods: {
    onFileChange(event) {
      this.profile = event.target.files[0];
    },
    validatePasswords() {
      this.PswdMisMatch = this.UserPswd !== this.ConfPswd;
    },
    async Signup() {
      try {
        const creatorData = new FormData();
        creatorData.append("UserName", this.UserName);
        creatorData.append("Email", this.UserEmail);
        creatorData.append("Password", this.UserPswd);
        creatorData.append("Profile", this.profile);

        const response = await fetch("http://127.0.0.1:5000/api/creator", {
          method: "POST",
          body: creatorData,
        });

        if (response.ok) {
          this.success = true;
          this.error = false;
        } else {
          this.error = true;
          this.success = false;
        }
      } catch (e) {
        console.log(e);
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
