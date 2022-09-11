<script setup>
import store from "../store.js";

import Tabs from "@/components/Tabs.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
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
  methods: {
    tokens(arr, length) {
      console.log("Tokens arr", arr);
      return arr.map((str) => {
        return `${str.substr(0, length)}...${str.substr(-length, str.length)}`;
      });
    },
  },
  computed: {
    users() {
      return store.state.users;
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
              <th scope="col">E-Mail</th>
              <th scope="col">Tokens</th>
              <th scope="col" style="width: 10px">Enabled</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in users">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>
                <ul style="padding-left: 1rem">
                  <li
                    v-bind:key="index"
                    v-for="(intent, index) in tokens(item.tokens, 20)"
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
                >
                  <template v-slot:custom>
                    <button
                      type="button"
                      class="btn btn-outline-warning"
                      title="Logout"
                      :disabled="index === 2"
                    >
                      <i class="fa-solid fa-right-from-bracket"></i>
                    </button>
                  </template>
                </ActionsButtons>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
    </Tabs>

    <!--users: {{ users }}-->
  </div>
</template>
