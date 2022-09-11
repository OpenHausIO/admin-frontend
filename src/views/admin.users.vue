<script setup>
import store from "../store.js";

import dateFormat from "dateformat";

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
  methods: {
    tokens(arr, length) {
      console.log("Tokens arr", arr);
      return arr.map((str) => {
        return `${str.substr(0, length)}...${str.substr(-length, str.length)}`;
      });
    },
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
              <th scope="col">Timestamps</th>
              <th scope="col" style="width: 10px">Admin</th>
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
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="tokens"
                  :disabled="true"
                  type="textarea"
                >
                  <template v-slot:editor="{ value }">
                    <textarea
                      rows="3"
                      width="500px"
                      class="form-control bg-dark text-white"
                      v-bind:key="index"
                      v-for="(token, index) in value"
                      readonly
                      :value="token"
                    ></textarea>
                  </template>
                  <template v-slot:display="{ value }">
                    <ul style="padding-left: 1rem">
                      <li
                        v-bind:key="index"
                        v-for="(intent, index) in tokens(value, 20)"
                      >
                        {{ intent }}
                      </li>
                    </ul>
                  </template>
                </EditorProperty>
              </td>
              <td>
                <table>
                  <tr>
                    <td>Created:</td>
                    <td>
                      {{
                        dateFormat(
                          item.timestamps.created,
                          "yyyy.mm.dd - HH:MM"
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>Updated:</td>
                    <td>
                      {{
                        dateFormat(
                          item.timestamps.updated,
                          "yyyy.mm.dd - HH:MM"
                        )
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>Login:</td>
                    <td>
                      {{
                        dateFormat(item.timestamps.login, "yyyy.mm.dd - HH:MM")
                      }}
                    </td>
                  </tr>
                  <tr>
                    <td>Logout:</td>
                    <td>
                      {{
                        dateFormat(item.timestamps.logout, "yyyy.mm.dd - HH:MM")
                      }}
                    </td>
                  </tr>
                </table>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    v-bind:checked="item.admin"
                    v-model="item.admin"
                  />
                </div>
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
                  @handleRemove="handleRemove"
                >
                  <template v-slot:custom>
                    <button
                      type="button"
                      class="btn btn-outline-warning"
                      :disabled="index === 2"
                      v-tooltip:bottom="'Logout User'"
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
