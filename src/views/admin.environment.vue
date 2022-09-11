<script setup>
import store from "../store.js";

import Tabs from "@/components/Tabs.vue";
</script>

<script>
import { defineComponent } from "vue";

import { request } from "../helper.js";

export default defineComponent({
  data() {
    return {
      pair: [],
    };
  },
  mounted() {
    request("/api/about", (err, data) => {
      if (err) {
        console.log(err || data);
      } else {
        Object.keys(data.environment).forEach((key) => {
          this.pair.push({
            key,
            value: data.environment[key],
          });
        });
      }
    });
  },
});
</script>


<template>
  <div>
    <h3>Environment variables</h3>
    <table class="table text-white">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Key</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-bind:key="item.key" v-for="(item, index) in pair">
          <th scope="row">{{ index + 1 }}</th>
          <td>{{ item.key }}</td>
          <td>{{ item.value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>