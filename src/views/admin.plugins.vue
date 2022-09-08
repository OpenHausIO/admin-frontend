<script setup>
import store from "../store.js";

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
    plugins() {
      return store.state.plugins;
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
              <th scope="col">Name</th>
              <th scope="col">Version</th>
              <th scope="col">UUID</th>
              <th scope="col">Intents</th>
              <th scope="col">Enabled</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in plugins">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>v{{ item.version }}</td>
              <td>{{ item.uuid }}</td>
              <td>
                <ul style="padding-left: 1rem">
                  <li
                    v-bind:key="index"
                    v-for="(intent, index) in item.intents"
                  >
                    {{ intent }}
                  </li>
                </ul>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-bind:checked="item.enabled"
                  />
                </div>
              </td>
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
                    class="btn btn-outline-secondary"
                    title="Clone"
                  >
                    <i class="fa-regular fa-clone"></i>
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

    <!--plugins: {{ plugins }}-->
  </div>
</template>
