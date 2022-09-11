<script setup>
import store from "../store.js";

import { getItemById } from "../helper.js";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
import IconSelect from "@/components/IconSelect.vue";
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
    devices() {
      return store.state.devices;
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
    handleInfo() {},
    handleRemove() {},
    handleClone() {},
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
              <th scope="col" style="width: 10px">#</th>
              <th scope="col" style="width: 10px">Icon</th>
              <th scope="col">Name</th>
              <th scope="col">Manufacturer</th>
              <th scope="col">Model</th>
              <th scope="col">Revision</th>
              <th scope="col">Room</th>
              <th scope="col" style="width: 10px">Enabled</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in devices">
              <th scope="row">{{ index + 1 }}</th>
              <td>
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="icon"
                  type="text"
                >
                  <template v-slot:editor="{ value }">
                    <IconSelect :item="item" :icon="value" />
                  </template>
                  <template v-slot:display="{ value }">
                    <i :class="value"></i>
                  </template>
                </EditorProperty>
              </td>
              <td>
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="name"
                  type="text"
                />
              </td>
              <td>
                {{ item.meta || "" }}
                <!--
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item.meta"
                  prop="manufacturer"
                  type="text"
                />-->
              </td>
              <td>
                {{ item.meta || "" }}
                <!--
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item.meta"
                  prop="manufacturer"
                  type="text"
                />-->
              </td>
              <td>
                {{ item.meta || "" }}
                <!--
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item.meta"
                  prop="manufacturer"
                  type="text"
                />-->
              </td>
              <td>
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="room"
                  type="select"
                  :items="store.state.rooms"
                >
                  <template v-slot:display="{ value }">
                    {{ getItemById(store.state.rooms, value)?.name || "" }}
                  </template>
                </EditorProperty>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-bind:checked="item.enabled"
                    v-model="item.enabled"
                  />
                </div>
              </td>
              <td>
                <ActionsButtons
                  :showEdit="true"
                  :showInfo="true"
                  :showRemove="true"
                  :item="item"
                  @handleEdit="handleEdit"
                  @handleInfo="handleInfo"
                  @handleClone="handleClone"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
    </Tabs>

    <!--Rooms: {{ rooms }}-->
  </div>
</template>
