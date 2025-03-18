<script>
import csv from 'csvtojson'

export default {
  data() {
    return {
      restaurant: null,
      mapSrc: '',
    }
  },
  async mounted() {
    await this.loadRestaurants()
    this.getRestaurantById(this.$route.params.id)
    this.mapSrc = `https://maps.google.com/maps?q=${this.restaurant.FullAddress + this.restaurant.Restaurant}&output=embed`
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
      const restaurantId = Number.parseInt(id) // 將 id 轉換為整數
      this.restaurant = this.restaurants.find((restaurant) => restaurant.id === restaurantId)
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
    <iframe
      id="gmap_canvas"
      frameborder="0"
      height="500"
      marginheight="0"
      marginwidth="0"
      scrolling="no"
      :src="mapSrc"
      width="600"
    />
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
