<script setup>
import store from "../store.js";

import Tabs from "@/components/Tabs.vue";
import EditorProperty from "@/components/EditorProperty.vue";
import ActionsButtons from "@/components/ActionsButtons.vue";
</script>

<script>
import { defineComponent } from "vue";

import { useNotificationStore } from "@dafcoe/vue-notification";
const { setNotification } = useNotificationStore();

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
          name: "Browse/Install",
          id: "browse",
        },
      ],
      browse: [{
        name: "Samsung TV",
        url: "/plugins/oh-plg-samsungtv-v1.0.0.tgz",
        author: "Marc Stirner",
        version: 1.0,
        description: "",
        intents: [
          "ssdp",
          "endpoints",
          "devices"
        ]
      }, {
        name: "Pioneer/Onky eISCP",
        url: "",
        author: "Marc Stirner",
        version: 1.0,
        description: "",
        intents: [
          "ssdp",
          "endpoints",
          "devices"
        ]
      }, {
        name: "Custom Lowboard driver",
        url: "",
        author: "Marc Stirner",
        version: 1.0,
        description: "",
        intents: []
      }, {
        name: "Phoscon/RaspBee ZigBee plugin",
        url: "/plugins/oh-plg-phoscon-v1.0.0.tgz",
        author: "Marc Stirner",
        version: 1.0,
        description: "",
        intents: [
          "ssdp",
          "endpoints",
          "devices"
        ]
      }].map((plg) => {
        plg.description = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. 

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. 

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. 

Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis. `;
        return plg;
      })
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
    installPlugin({url, name, version, intents}){

      console.log("Downmload url", url)

      fetch(url, {
        mode: 'no-cors',
        redirect: 'follow'
      }).then((resp) => {
        console.log("download file resp", resp);
        return resp.blob();
      }).then(async (blob) => {

        console.log("blob", blob)

        // create plugin item
        let data = await fetch("/api/plugins", {
          method: "PUT",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            name,
            version,
            intents
          })
        }).then((resp) => {
          return resp.json();
        });

        /*
        setNotification({
          message: "Plugin item created",
          type: "info",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          showDurationProgress: true,
          appearance: "dark",
        });
        */

        console.log("Plugin item created", data)

        // upload plugin content
        await fetch(`/api/plugins/${data._id}/files`, {
          method: "PUT",
          headers: {
            "x-md5-checksum": "foo-bar-bz"
          },
          body: blob
        });

        /*
        setNotification({
          message: "Plugin content upload created",
          type: "info",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          showDurationProgress: true,
          appearance: "dark",
        });
        */

        setNotification({
          message: "Plugin installed successful!",
          type: "success",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          showDurationProgress: true,
          appearance: "dark",
        });

      }).catch((err) => {
        console.log("Could not downadsfasdfasdfasdfasfdload file", err)

        setNotification({
          message: "Something went wrong: " +err,
          type: "alert",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          showDurationProgress: true,
          appearance: "dark",
        });

      });

    },
    downloadPlugin(plg){
      window.open(plg.url)
    }
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
      <template v-slot:browse> 
        <table class="table text-white">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Author</th>
              <th scope="col">Version</th>
              <th scope="col">Description</th>
              <th scope="col">Intents</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-bind:key="index" v-for="(plugin, index) in browse">
              <td>{{plugin.name}}</td>
              <td>{{ plugin.author }}</td>
              <td>{{ plugin.version }}</td>
              <td>

                <textarea v-bind:value="plugin.description" readonly="true" rows="5" class="w-100 text-white border-0" style="background-color: transparent; resize: none;">
                </textarea>
              </td>
              <td>
                <ul class="ps-3">
                  <li v-bind:key="index" v-for="(intent, index) in plugin.intents">
                    {{ intent }}
                  </li>
                </ul>
              </td>
              <td>
                <div class="btn-group" role="group">
                <button
                      type="button"
                      class="btn btn-outline-success"
                      v-tooltip:bottom="'Install Plugin'"
                      @click="installPlugin(plugin)"
                    >
                    <i class="fa-solid fa-plus"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      v-tooltip:bottom="'Download Plugin'"
                      @click="downloadPlugin(plugin)"
                    >
                    <i class="fa-solid fa-download"></i>
                    </button>
                    </div>
              </td>
            </tr>
           </tbody>
          </table>
      </template>
    </Tabs>

    <!--plugins: {{ plugins }}-->
  </div>
</template>

<style scoped>
</style>