<script setup>
import store from "../store.js";

import Tile from "@/components/Tile.vue";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    rooms() {
      return store.state.rooms;
    },
  },
});
</script>


<template>
  <div>
    Dashboard

    <Tile class="bg-dark border-secondary">
      <template #title>fucker</template>
      <span class="text-secondary fw-light"> Hello World </span>
    </Tile>

    <!--Rooms: {{ rooms }}-->
  </div>
</template>
