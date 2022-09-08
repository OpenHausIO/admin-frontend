<script setup>
import store from "../store.js";
import { getItemByProperty } from "../helper.js";

import Tabs from "@/components/Tabs.vue";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      tabItems: [
        {
          name: "Overview",
          id: "overview",
        },
        {
          name: "Add",
          id: "add",
        },
      ],
    };
  },
  computed: {
    config() {
      return store.state.store;
    },
  },
});
</script>


<template>
  <div>
    <Tabs v-bind:items="tabItems">
      <template v-slot:overview>
        <table class="table text-white">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Plugin (Namespace UUID)</th>
              <th scope="col">Description</th>
              <th scope="col">Key</th>
              <th scope="col">Value</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in config">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                {{
                  getItemByProperty(store.state.plugins, item.namespace, "uuid")
                    .name
                }}
                ({{ item.namespace }})
              </td>
              <td>{{ item.description }}</td>
              <td>{{ item.key }}</td>
              <td>{{ item.value }}</td>
              <td>
                <div class="btn-group" role="group">
                  <button
                    type="button"
                    class="btn btn-outline-primary"
                    title="Edit"
                  >
                    <i class="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    title="Delete"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
    </Tabs>

    <!--store: {{ store }}-->
  </div>
</template>
