<script setup>
import store from "../store.js";

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
        },        {
          name: "Browse",
          id: "browse",
        },
      ],
    };
  },
  computed: {
    plugins() {
      return store.state.plugins;
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
    handleInfo() {},
    showInfo() {},
    handleStart() {},
    handleStop() {},
    createIntentsArray(item) {
      return [
        "devices",
        "endpoints",
        "plugins",
        "rooms",
        "ssdp",
        "store",
        "users",
        "vault",
      ].map((intent) => {
        return {
          name: intent,
          value: intent,
        };
      });
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
              <th scope="col">
                Intents <span v-if="editItem">(Granted)</span>
              </th>
              <th scope="col" style="width: 10px">Autostart</th>
              <th scope="col" style="width: 10px">Enabled</th>
              <th scope="col" style="width: 10px">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="item._id" v-for="(item, index) in plugins">
              <th scope="row">{{ index + 1 }}</th>
              <td>{{ item.name }}</td>
              <td>v{{ item.version }}</td>
              <td>{{ item.uuid }}</td>
              <td>
                <EditorProperty
                  :enabled="item._id === editItem"
                  :object="item"
                  prop="intents"
                  type="checkbox"
                  :items="createIntentsArray(item)"
                >
                  <template v-slot:display>
                    <ul style="padding-left: 1rem">
                      <li
                        v-bind:key="index"
                        v-for="(intent, index) in item.intents"
                      >
                        {{ intent }}
                      </li>
                    </ul>
                  </template>
                </EditorProperty>
              </td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :disabled="!item.enabled"
                    v-bind:checked="item.autostart"
                    v-model="item.autostart"
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
                    v-on:click="item.autostart = false"
                  />
                </div>
              </td>
              <td>
                <ActionsButtons
                  :showEdit="true"
                  :showRemove="true"
                  :showInfo="true"
                  :item="item"
                  @handleEdit="handleEdit"
                  @handleInfo="handleInfo"
                  @handleRemove="handleRemove"
                >
                  <template v-slot:custom>
                    <button
                      type="button"
                      class="btn btn-outline-success"
                      :disabled="!item.enabled"
                      v-on:click="handleStart(item)"
                      :class="{
                        'text-muted': !item.enabled,
                        'border-secondary': !item.enabled,
                      }"
                      v-tooltip:bottom="'Start Plugin'"
                    >
                      <i class="fa-solid fa-power-off"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-danger"
                      :disabled="!item.enabled"
                      v-on:click="handleStop(item)"
                      :class="{
                        'text-muted': !item.enabled,
                        'border-secondary': !item.enabled,
                      }"
                      v-tooltip:bottom="'Stop Plugin'"
                    >
                      <i class="fa-solid fa-power-off"></i>
                    </button>
                  </template>
                </ActionsButtons>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template v-slot:add> Hello from apsdflkasjfdlasdf </template>
      <template v-slot:browse> HTTP Browser for plugins </template>
    </Tabs>

    <!--plugins: {{ plugins }}-->
  </div>
</template>

<style scoped>
</style>