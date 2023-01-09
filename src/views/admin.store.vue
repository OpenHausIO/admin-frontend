<script setup>
import store from "../store.js";
import { getItemByProperty } from "../helper.js";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      editItem: null,
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
  methods: {
    handleEdit(item) {
      if (this.editItem === item._id) {
        this.editItem = null;
      } else {
        this.editItem = item._id;
      }
    },
    handleRemove() {},
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
              <th scope="col">Namespace (UUID)</th>
              <th scope="col">Description</th>
              <th scope="col">Key</th>
              <th scope="col">Value</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in config">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.config }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
    </Tabs>

    <!--store: {{ store }}-->
  </div>
</template>
