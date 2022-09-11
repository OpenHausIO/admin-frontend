<script setup>
import store from "../store.js";

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
        {
          name: "Edit",
          id: "edit",
        },
      ],
      dynamicSlots: [],
      currentSort: "name",
      currentSortDir: "asc",
    };
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
    sort(s) {
      //if s == current sort, reverse
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
      }
      this.currentSort = s;
    },
  },
  mounted() {},
  computed: {
    rooms() {
      return store.state.rooms;
    },
    sortedItems: function () {
      return this.rooms.sort((a, b) => {
        let modifier = 1;
        if (this.currentSortDir === "desc") modifier = -1;
        if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
        if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
        return 0;
      });
    },
  },
});
</script>


<template>
  <div>
    <Tabs v-bind:items="tabItems">
      <!-- OVERVIEW -->
      <template v-slot:overview>
        <table class="table text-white border-secondary">
          <thead>
            <tr>
              <th scope="col" style="width: 10px">#</th>
              <th scope="col" style="width: 10px">Icon</th>
              <th scope="col" @click="sort('name')">Name</th>
              <th scope="col" @click="sort('floor')">Floor</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in rooms">
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
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="floor"
                  type="number"
                >
                </EditorProperty>
              </td>
              <td>
                <ActionsButtons
                  :showEdit="true"
                  :showInfo="true"
                  :showRemove="true"
                  :item="item"
                  @handleEdit="handleEdit"
                  @handleInfo="handleInfo"
                  @handleRemove="handleRemove"
                  @handleClone="handleClone"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <!-- OVERVIEW -->
      <!-- ADD-->
      <template v-slot:add>
        <div>
          <div class="row">
            <div class="col-6">
              <form>
                <div class="form-group mb-2">
                  <label>Room Name</label>
                  <input type="text" class="form-control bg-dark text-white" />
                </div>
                <div class="form-group mb-2">
                  <label>Floor/Level</label>
                  <input
                    type="number"
                    class="form-control bg-dark text-white"
                    value="0"
                  />
                </div>
                <div class="form-group mb-4">
                  <label>Icon</label>
                  <div class="input-group mb-2">
                    <div class="input-group-prepend">
                      <button
                        class="btn btn-outline-secondary rounded-start"
                        type="button"
                      >
                        Button
                      </button>
                    </div>
                    <input
                      type="text"
                      class="form-control bg-dark border-secondary"
                      placeholder="fa-solid fa-light-bulb"
                    />
                  </div>
                </div>
                <button type="submit" class="btn btn-outline-primary">
                  Save
                </button>
              </form>
            </div>
            <div class="col-6">Help text</div>
          </div>
        </div>
      </template>
      <!-- ADD-->
      <!-- EDIT -->
      <template v-slot:edit> <div>Edot</div></template>
      <!-- EDIT -->
      <!-- CUSTOM SLOTS -->
      <template
        v-for="slot in dynamicSlots"
        v-slot:[slot.id]="data"
        v-bind:key="slot.id"
      >
        <div>{{ data }}</div>
      </template>
      <!-- CUSTOM SLOTS -->
    </Tabs>

    <!--Rooms: {{ rooms }}-->
  </div>
</template>

<style scope>
.nav-link.active {
  color: red !important;
}

/*.btn-group button.btn:not(:first-child):not(:last-child)*/
.btn-group button.btn:not(:first-child) {
  border-left-color: #000 !important;
  /*border-right-color: #000 !important;*/
}
</style>