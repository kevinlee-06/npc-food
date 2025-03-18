<!-- Demo Page -->
<script>
import { LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      zoom: 17,
      markers: [
        {
          position: [25.045299167961485, 121.53107779272158],
          popupText: 'This is a marker!',
        },
        {
          position: [25.046, 121.532],
          popupText: 'Another marker!',
        },
        // Add more markers as needed
      ],
    }
  },
}
</script>

<template>
  <div style="height:600px; width:800px">
    <LMap
      v-model:zoom="zoom"
      :center="[25.045299167961485, 121.53107779272158]"
    >
      <LTileLayer
        layer-type="base"
        name="OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LMarker
        v-for="(marker, index) in markers"
        :key="index"
        :lat-lng="marker.position"
      >
        <LPopup>{{ marker.popupText }}</LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

  <style></style>
