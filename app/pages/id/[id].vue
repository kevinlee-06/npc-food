<script>
import csv from 'csvtojson'

export default {
  data() {
    return {
      restaurant: null,
    }
  },
  async mounted() {
    await this.loadRestaurants()
    this.getRestaurantById(this.$route.params.id)
  },
  methods: {
    async loadRestaurants() {
      try {
        const response = await fetch('/food.csv')
        const text = await response.text()
        this.restaurants = await csv().fromString(text)
      } catch (error) {
        console.error('Error loading restaurants:', error)
      }
    },
    getRestaurantById(id) {
      this.restaurant = this.restaurants.find((restaurant) => Number.parseInt(restaurant.id) === Number.parseInt(id))
    },
  },
}
</script>

<template>
  <h1>餐廳資訊</h1>
  <div
    v-if="restaurant"
    class="restaurant-details"
  >
    <h2>{{ restaurant.Restaurant }}</h2>
    <p>地點: {{ restaurant.Location }}</p>
    <p>類型: {{ restaurant.Genre }}</p>
    <p>價格範圍: {{ restaurant.Price }}</p>
    <p>評論: {{ restaurant.Comments }}</p>
  </div>
  <div
    v-else
    class="restaurant-details"
  >
    <p>餐廳資訊載入中...</p>
  </div>
  <NuxtLink to="/">
    <button>
      返回
    </button>
  </NuxtLink>
</template>

<style>
.restaurant-details {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px;
  border-radius: 5px;
  background-color: var(--bg-contrast-9);
}
</style>
