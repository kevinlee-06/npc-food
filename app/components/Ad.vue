<script>
import csv from 'csvtojson'

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vT6CVzddwx_-MOQWJoXYPLdWI2u_mGl8yApYk9AbvfNvV5Uv-FkQ_yM9-EMLX9bVUKnGyG7heMbiSYx/pub?gid=0&single=true&output=csv' // Replace with your actual CSV URL

export default {
  data() {
    return {
      ads: [],
      loaded: false,
    }
  },
  async mounted() {
    await this.loadAdsFromCloud()
  },
  methods: {
    async loadAdsFromCloud() {
      try {
        const response = await fetch(CSV_URL)
        const text = await response.text()
        this.ads = await csv().fromString(text)
        this.loaded = true
      } catch (error) {
        console.error('Error loading ads:', error)
      }
    },
  },
}
</script>

<template>
  <div
    v-show="loaded"
    class="p-4"
  >
    <h1 class="text-2xl font-bold mb-4">
      Advertisements
    </h1>
    <div>
      <ul class="space-y-4">
        <li
          v-for="(ad, index) in ads"
          :key="index"
          class="border rounded-lg overflow-hidden shadow-md"
        >
          <a
            class="block"
            :href="ad.Url"
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              alt="Advertisement Image"
              class="w-full h-auto"
              :src="ad.ImgUrl"
            >
            <div class="p-4">
              <h2 class="text-xl font-semibold mb-2">{{ ad.Title }}</h2>
              <p class="text-gray-600">{{ ad.Text }}</p>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
