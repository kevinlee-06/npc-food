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
    paymentMethods() {
      const methods = []
      if (this.selectedRestaurant) {
        if (this.selectedRestaurant.LinePay === '1') methods.push('Line Pay')
        if (this.selectedRestaurant.TWQR === '1') methods.push('TWQR')
        if (this.selectedRestaurant.Cash === '1') methods.push('現金')
        if (this.selectedRestaurant.EasyCard === '1') methods.push('悠遊卡')
        if (this.selectedRestaurant.CreditCard === '1') methods.push('信用卡')
        if (this.selectedRestaurant.JKO === '1') methods.push('街口支付')
      }
      return methods.length > 0 ? methods.join(', ') : '無可用付款方式'
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
  <h1 id="title">
    {{ loaded ? "北科美食地圖" : "載入中..." }}
  </h1>
  <button
    v-if="loaded"
    @click="getRandomRestaurant"
  >
    亂數選擇餐廳
  </button>

  <div
    v-if="selectedRestaurant"
    class="selected-restaurant card"
  >
    <h2>{{ selectedRestaurant.Restaurant }}</h2>
    <div class="restaurant-details">
      <div class="restaurant-p-container">
        <p v-if="selectedRestaurant.Location">
          地點: {{ selectedRestaurant.Location }}
        </p>
        <p v-if="selectedRestaurant.Genre">
          類型: {{ selectedRestaurant.Genre }}
        </p>
        <p v-if="selectedRestaurant.Price">
          價格範圍: NT${{ selectedRestaurant.Price }}
        </p>
        <p v-if="selectedRestaurant.Discounts">
          優惠: {{ selectedRestaurant.Discounts }}
        </p>
        <p v-if="selectedRestaurant.Comments">
          留言: {{ selectedRestaurant.Comments }}
        </p>
        <p>付款方式: {{ paymentMethods }}</p>
      </div>
      <NuxtLink
        v-if="selectedRestaurant.OrderOnline"
        target="_blank"
        :to="selectedRestaurant.OrderOnline"
      >
        <button class="order-button">
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
  </div>

  <div class="all-restaurants">
    <h2 v-if="loaded">
      所有餐廳:
    </h2>
    <div class="restaurant-grid">
      <div
        v-for="restaurant in restaurants"
        :key="restaurant.Restaurant"
        class="restaurant-card card"
        :class="{ selected: selectedRestaurant === restaurant }"
        @click="toggleDetails(restaurant)"
      >
        <h3>{{ restaurant.Restaurant }}</h3>
        <p>地點: {{ restaurant.Location }}</p>
        <p>類型: {{ restaurant.Genre }}</p>
        <p>價格範圍: NT${{ restaurant.Price }}</p>
      </div>
      <div
        v-if="loaded"
        class="restaurant-card card"
      >
        <h3>貢獻</h3>
        <p>
          GitHub 倉庫: <NuxtLink
            target="_blank"
            to="https://github.com/kevinlee-06/npc-food"
          >
            前往
          </NuxtLink>
        </p>
        <p>
          餐廳資料: <NuxtLink
            target="_blank"
            :to="url"
          >
            檢視
          </NuxtLink>
        </p>
        <p>
          餐廳資料: <NuxtLink
            target="_blank"
            to="https://docs.google.com/spreadsheets/d/1aTIJGztYUYxPRU1O_7dT8Iwbl05r_YGu224_NYiZWtg/edit?usp=sharing"
          >
            登入並編輯
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
  <br>
</template>

<style>
h1,
h2,
h3,
p {
  color: var(--text);
}

a {
  color: var(--anchor);
}

button {
  background-color: var(--text);
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

.card {
  box-shadow: 0 5px 20px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  text-decoration: none;
  background-color: var(--card);
  border: 0;
  transition: all 0.25s ease;
  overflow: hidden;

  p {
    margin: 0;
  }
  h2 {
    margin: 0 0 8px;
  }
  h3 {
    margin: 0 0 2px;
  }
}
.selected-restaurant {
  padding: 2rem;
  width: 100%;
  max-width: 800px;
}

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.restaurant-card {
  padding: 10px;
  cursor: pointer;
}

.restaurant-card:hover {
  transform: scale(1.05);
}

.selected {
  background-color: var(--card);
}

.map {
  width: 100%;
  height: 400px;
  margin-top: 20px;

  .leaflet-container {
    border-radius: 1rem;
  }
}

.restaurant-details {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  .order-button {
    margin: auto;
    margin-top: 1rem;
  }
  .restaurant-p-container {
    margin-right: 1rem;
  }
}
</style>
