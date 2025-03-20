<script>
import { LMap, LMarker, LPolygon, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { csv } from 'csvtojson'
import 'leaflet/dist/leaflet.css'

const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTNQAYsJcztzdIRq1DbhTTKVgwoeobv3BRjxJcVTqk9J_Dgn_oRboZkIkHq_DMK1eSRw2ozzqwVBbBB/pub?gid=1709653989&single=true'
const CSV_URL = `${URL}&output=csv`
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
      loaded: false,
      url: URL,
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
    this.loadRestaurantsFromCloud()
  },
  methods: {
    async loadRestaurantsFromCloud() {
      try {
        const response = await fetch(CSV_URL)
        const text = await response.text()
        this.restaurants = await csv().fromString(text)
        this.loaded = true
      } catch (error) {
        console.error('Error loading restaurants:', error)
      }
    },
    getRandomRestaurant() {
      const randomIndex = Math.floor(Math.random() * this.restaurants.length)
      this.selectedRestaurant = this.restaurants[randomIndex]
    },
    toggleDetails(restaurant) {
      this.selectedRestaurant = this.selectedRestaurant === restaurant ? this.restaurants[0] : restaurant
      window.scrollTo({ top: document.getElementById('title').offsetTop, behavior: 'smooth' })
    },
  },
}
</script>

<template>
  <h1
    id="title"
    class="text-2xl font-bold text-zinc-800 dark:text-zinc-200 mb-4"
  >
    {{ loaded ? "北科美食地圖" : "載入中..." }}
  </h1>
  <button
    v-if="loaded"
    class="bg-zinc-700 text-white py-2 px-4 rounded transition duration-300 hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
    @click="getRandomRestaurant"
  >
    亂數選擇餐廳
  </button>

  <div
    v-if="selectedRestaurant"
    class="selected-restaurant card p-8 max-w-2xl mx-auto bg-white shadow-lg rounded-lg dark:bg-zinc-800 mt-8"
  >
    <h2 class="text-xl font-semibold text-zinc-800 dark:text-zinc-200">
      {{ selectedRestaurant.Restaurant }}
    </h2>
    <div class="restaurant-details flex flex-wrap justify-between">
      <div class="restaurant-p-container">
        <p
          v-if="selectedRestaurant.Location"
          class="text-zinc-600 dark:text-zinc-400"
        >
          地點：{{ selectedRestaurant.Location }}
        </p>
        <p
          v-if="selectedRestaurant.Price"
          class="text-zinc-600 dark:text-zinc-400"
        >
          價格範圍：NT${{ selectedRestaurant.Price }}
        </p>
        <p
          v-if="selectedRestaurant.Discounts"
          class="text-zinc-600 dark:text-zinc-400"
        >
          優惠：{{ selectedRestaurant.Discounts }}
        </p>
        <p class="text-zinc-600 dark:text-zinc-400">
          付款方式：{{ selectedRestaurant.PaymentMethods }}
        </p>
        <p
          v-if="selectedRestaurant.Comments"
          class="text-zinc-600 dark:text-zinc-400"
        >
          留言：{{ selectedRestaurant.Comments }}
        </p>
      </div>
      <NuxtLink
        v-if="selectedRestaurant.OrderOnline"
        target="_blank"
        :to="selectedRestaurant.OrderOnline"
      >
        <button class="order-button bg-zinc-800 text-white py-2 px-4 rounded mt-4 dark:bg-zinc-700 dark:text-white">
          線上訂餐
        </button>
      </NuxtLink>
    </div>
    <div class="map">
      <LMap
        v-if="selectedRestaurant.Latitude && selectedRestaurant.Longitude"
        :center="[lat, lon]"
        :use-global-leaflet="false"
        :zoom="zoom"
      >
        <LTileLayer
          attribution="ntut.club"
          name="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LControl position="bottomleft">
          <NuxtLink
            target="_blank"
            :to="`https://www.google.com/maps/search/?api=1&query=${selectedRestaurant.Restaurant}`"
          >
            <button class="bg-[#1b6ef3] text-white border border-[#1b6ef3] py-2 px-4 rounded m-0 hover:scale-105 transition-transform duration-200">
              打開 Google 地圖
            </button>
          </NuxtLink>
        </LControl>
        <LMarker
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
  </div>

  <div class="all-restaurants mt-8">
    <h2
      v-if="loaded"
      class="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4"
    >
      所有餐廳:
    </h2>
    <div class="restaurant-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.Restaurant"
        class="restaurant-card card p-4 bg-white shadow-md rounded-lg cursor-pointer transition-transform duration-200 hover:scale-105 dark:bg-zinc-800 dark:text-zinc-200"
        :class="{ 'bg-zinc-200 dark:bg-zinc-700': selectedRestaurant === restaurant }"
        @click="toggleDetails(restaurant)"
      >
        <h3 class="text-lg font-semibold">
          {{ restaurant.Restaurant }}
        </h3>
        <p class="text-zinc-600 dark:text-zinc-400">
          {{ restaurant.Location }}
        </p>
        <p class="text-zinc-600 dark:text-zinc-400">
          NT${{ restaurant.Price }}
        </p>
      </div>
    </div>
  </div>
  <br>
</template>

<style scoped>
.selected-restaurant {
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

.restaurant-comments {
  padding: 1rem;
  background-color: var(--comment);
  border-radius: 8px;
  margin-top: 1rem;
  display: inline-block;
}

.map {
  width: 100%;
  height: 400px;
  margin-top: 20px;

  .leaflet-container {
    border-radius: 0.5rem;
  }
}
</style>
