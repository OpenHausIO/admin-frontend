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
    ssdp() {
      return store.state.ssdp;
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
              <th scope="col">Description</th>
              <th scope="col">NT</th>
              <th scope="col">USN</th>
              <th scope="col">Headers</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in ssdp">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.description }}</td>
              <td>{{ item.nt }}</td>
              <td>{{ item.usn }}</td>
              <td>{{ item.headers }}</td>
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

    <!--ssdp: {{ ssdp }}-->
  </div>
</template>
