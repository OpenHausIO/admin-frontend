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
    handleEdit() {},
    handleInfo() {},
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
              <th scope="col">Config</th>
              <th scope="col">Namespace (Item)</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="item in config">
              <td>
                <!--{{ item }}-->

                <ul class="ps-3">
                  <li v-bind:key="index" v-for="(config, index) in item.config">
                    {{ config.key }} = {{ config.value }}
                  </li>
                </ul>
              </td>
              <td>{{ item.namespace }} ({{ item.item }})</td>
              <td>
                <ActionsButtons
                  :showEdit="true"
                  :showInfo="true"
                  :showRemove="true"
                  :item="item"
                  @handleEdit="handleEdit"
                  @handleInfo="handleInfo"
                  @handleRemove="handleRemove"
                />
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
