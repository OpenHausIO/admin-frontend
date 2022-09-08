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
        {
          name: "Edit",
          id: "edit",
        },
      ],
      dynamicSlots: [],
    };
  },
  mounted() {
    setTimeout(() => {
      store.commit("delete", "foo");

      let room1 = store.state.rooms[0];
      let room2 = store.state.rooms[1];

      this.tabItems.push({
        name: room1.name,
        id: `${room1._id}`,
      });

      this.dynamicSlots.push({
        id: `${room1._id}`,
        content: room1,
      });

      this.tabItems.push({
        name: room2.name,
        id: `${room2._id}`,
      });

      this.dynamicSlots.push({
        id: `${room2._id}`,
        content: room2,
      });
    }, 3000);
  },
  computed: {
    rooms() {
      return store.state.rooms;
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
              <th scope="col">#</th>
              <th scope="col">Icon</th>
              <th scope="col">Name</th>
              <th scope="col">Floor</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in rooms">
              <th scope="row">{{ index + 1 }}</th>
              <td><i :class="item.icon"></i></td>
              <td>{{ item.name }}</td>
              <td>{{ item.floor }}</td>
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
                    class="btn btn-outline-info"
                    title="Info"
                  >
                    <i class="fa-solid fa-circle-info"></i>
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
      <!-- OVERVIEW -->
      <!-- ADD-->
      <template v-slot:add>
        <div>
          <form>
            <div class="form-group">
              <label>Room Name</label>
              <input type="email" class="form-control bg-dark text-white" />
              <small id="emailHelp" class="form-text text-muted"
                >We'll never share your email with anyone else.</small
              >
            </div>
            <div class="form-group">
              <label>Password</label>
              <input type="password" class="form-control bg-dark" />
            </div>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label class="form-check-label" for="flexSwitchCheckDefault"
                >Default switch checkbox input</label
              >
            </div>
            <button type="submit" class="btn btn-outline-primary">
              Submit
            </button>
          </form>
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