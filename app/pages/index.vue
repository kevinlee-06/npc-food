<script>
import { LMap, LMarker, LPolygon, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { csv } from 'csvtojson'
import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolygon,
  },
  data() {
    return {
      restaurants: [],
      selectedRestaurant: null,
      zoom: 20,
    }
  },
  computed: {
    lat() {
      return this.selectedRestaurant ? Number.parseFloat(this.selectedRestaurant.Latitude) : 0
    },
    lon() {
      return this.selectedRestaurant ? Number.parseFloat(this.selectedRestaurant.Longitude) : 0
    },
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
    },
    toggleDetails(restaurant) {
      this.selectedRestaurant = this.selectedRestaurant === restaurant ? null : restaurant
    },
  },
}
</script>

<template>
  <div>
    <h1>隨機餐廳選擇器</h1>
    <button @click="getRandomRestaurant">
      選擇餐廳
    </button>

    <div
      v-if="selectedRestaurant"
      class="selected-restaurant"
    >
      <h3>{{ selectedRestaurant.Restaurant }}</h3>
      <p>地點: {{ selectedRestaurant.Location }}</p>
      <p>類型: {{ selectedRestaurant.Genre }}</p>
      <p>價格範圍: {{ selectedRestaurant.Price }}</p>
      <p>評論: {{ selectedRestaurant.Comments }}</p>
      <div
        class="map"
        style="height:400px; width:600px"
      >
        <LMap
          :center="[lat, lon]"
          :use-global-leaflet="false"
          :zoom="zoom"
        >
          <LTileLayer
            attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
            layer-type="base"
            name="OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LMarker
            draggable
            :lat-lng="[lat, lon]"
          >
            <LPopup>{{ selectedRestaurant.Restaurant }}</LPopup>
          </LMarker>
          <LPolygon
            id="北科校區"
            color="#41b782"
            :fill="true"
            fill-color="#41b782"
            :fill-opacity="0.5"
            :lat-lngs="[
              [25.042499915975604, 121.5330912641657],
              [25.041955580123695, 121.53661032227251],
              [25.043345575810104, 121.53627772836607],
              [25.043714942642538, 121.53630455045088],
              [25.043885045415383, 121.53553743869892],
              [25.043982246893908, 121.53526653559774],
              [25.04407458822715, 121.53466840300793],
              [25.04431030132269, 121.53423656735129],
              [25.044631064797045, 121.53390397344485],
              [25.044373482075894, 121.53308321748595],
            ]"
          />
        </LMap>
      </div>
      <br>
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
  </div>
</template>

<style>
h1,
h2,
h3 {
  color: var(--bg-contrast);
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
  width: 100%;
  max-width: 800px;
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
  cursor: pointer;
  transition: transform 0.2s;
}

.restaurant-card:hover {
  transform: scale(1.05);
}

.selected {
  background-color: var(--bg-selected);
  color: white;
}
</style>
