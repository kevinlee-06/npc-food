<script>
import csv from 'csvtojson'

export default {
  data() {
    return {
      restaurants: [],
      selectedRestaurant: null,
      mapSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=121.531695-0.0001,25.043475-0.0001,121.531695+0.0001,25.043475+0.0001&layer=mapnik&marker=25.043475,121.531695', // Default map source
    }
  },
  mounted() {
    this.loadRestaurants()
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
    getRandomRestaurant() {
      const randomIndex = Math.floor(Math.random() * this.restaurants.length)
      this.selectedRestaurant = this.restaurants[randomIndex]
      this.updateMap()
    },
    toggleDetails(restaurant) {
      this.selectedRestaurant = this.selectedRestaurant === restaurant ? null : restaurant
      if (this.selectedRestaurant) {
        this.updateMap()
      }
    },
    updateMap() {
      if (this.selectedRestaurant) {
        const lat = Number.parseFloat(this.selectedRestaurant.Latitude)
        const lon = Number.parseFloat(this.selectedRestaurant.Longitude)
        const size = 0.0001
        this.mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - size},${lat - size},${lon + size},${lat + size}&layer=mapnik&marker=${lat},${lon}`
      }
    },
  },
}
</script>

<template>
  <h1>隨機餐廳選擇器</h1>
  <button @click="getRandomRestaurant">
    選擇餐廳
  </button>

  <div
    v-if="selectedRestaurant"
    class="selected-restaurant "
    @click="toggleDetails(selectedRestaurant)"
  >
    <h3>{{ selectedRestaurant.Restaurant }}</h3>
    <p>地點: {{ selectedRestaurant.Location }}</p>
    <p>類型: {{ selectedRestaurant.Genre }}</p>
    <p>價格範圍: {{ selectedRestaurant.Price }}</p>
    <p>評論: {{ selectedRestaurant.Comments }}</p>
    <iframe
      height="350"
      :src="mapSrc"
      style="border: 1px solid black"
      width="425"
    /><br><small><a :href="`https://www.openstreetmap.org/?#map=19/${selectedRestaurant.Latitude}/${selectedRestaurant.Longitude}`">View Larger Map</a></small>
  </div>

  <div class="all-restaurants">
    <h2>所有餐廳:</h2>
    <div class="restaurant-grid">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.Restaurant"
        class="restaurant-card"
        :class="{ selected: selectedRestaurant === restaurant }"
        @click="toggleDetails(restaurant)"
      >
        <h3>{{ restaurant.Restaurant }}</h3>
        <p>地點: {{ restaurant.Location }}</p>
        <p>類型: {{ restaurant.Genre }}</p>
        <p>價格範圍: {{ restaurant.Price }}</p>
        <p v-if="selectedRestaurant === restaurant">
          評論: {{ restaurant.Comments }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
h1,
h2,
h3 {
  color: var(--bg-contrast);
  margin-bottom: 1rem;
}

iframe {
  border-radius: 1rem;
  margin-bottom: 1rem;
}

p {
  color: var(--bg-contrast);
}

button {
  background-color: var(--bg-contrast);
  color: var(--bg);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 1rem;
}
.all-restaurants {
  margin-top: 20px;
  width: 100%;
}

.selected-restaurant {
  border: 0;
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  background-color: var(--bg-contrast-8);
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.restaurant-card {
  border: 0;
  box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 5px;
  background-color: var(--bg-contrast-8);
  cursor: pointer; /* 讓卡片看起來可以點擊 */
  transition: transform 0.2s; /* 添加過渡效果 */
}

.restaurant-card:hover {
  transform: scale(1.05);
}

.selected {
  background-color: var(--bg-selected); /* 選中卡片的背景顏色 */
  color: white; /* 選中卡片的文字顏色 */
}
</style>
