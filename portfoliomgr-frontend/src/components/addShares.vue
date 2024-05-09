<template>
  <div
    id="main"
    class="container-fluid d-flex justify-content-center align-items-center vh-100"
  >
    <form
      @submit.prevent="addShare"
      class="container p-5 rounded-lg shadow-lg custom-form"
      v-if="!success && !error"
    >
      <h2 class="text-center mb-4">Add Shares</h2>

      <div class="form-group">
        <label>Choose Stock : </label>
        <select id="stock-symbol" v-model="selectedSymbol">
          <option value="" disabled selected>Select a symbol</option>
          <option
            v-for="stock in allStocksData"
            :key="stock.symbol"
            :value="stock.symbol"
          >
            {{ stock.symbol }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Number of shares:</label>
        <div class="input-group">
          <input
            id="stock-range"
            type="range"
            v-model="numStocks"
            min="1"
            max="10"
            step="1"
            class="form-control-range"
          />
          <input
            type="number"
            v-model="numStocks"
            min="1"
            max="10"
            class="form-control"
            style="width: 80px; margin-left: 10px"
          />
        </div>
      </div>

      <div class="form-group">
        <label>Price of Share : </label>
        <input id="stock-range" type="number" v-model="price" />
      </div>

      <button type="submit" class="btn btn-primary btn-block">Submit</button>
    </form>

    <div v-else class="result-message">
      <div v-if="success" class="success-message">
        <p>Share SUCCESSFULLY added!</p>
        <router-link to="/login" class="btn btn-success btn-sm"
          >Login</router-link
        >
      </div>
      <div v-if="error" class="error-message">
        <p>ERROR adding shares!</p>
        <router-link to="/" class="btn btn-danger btn-sm"
          >Try again</router-link
        >
      </div>
    </div>
  </div>
</template>

<script>
import { BASE_URL } from "@/assets/constants.js";
export default {
  name: "addShareVue",
  data() {
    return {
      selectedSymbol: "",
      numStocks: 0,

      success: false,
      error: false,
      profile: null,
      price: 0,
    };
  },

  computed: {
    user() {
      return JSON.parse(localStorage.getItem("user"));
    },
    stocks() {
      return JSON.parse(localStorage.getItem("stocks"));
    },
    allStocksData() {
      return this.stocks.allStocks;
    },
  },

  methods: {
    async addShare() {
      try {
        const response = await fetch(
          `${BASE_URL}/addShare/${this.user.user_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              stockSymbol: this.selectedSymbol,
              qty: this.numStocks,
              pricePurchased: this.price,
            }),
          }
        );

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
