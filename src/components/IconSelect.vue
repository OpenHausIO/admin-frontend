<script setup>
import Tabs from "./Tabs.vue";
</script>

<script>
import { defineComponent } from "vue";
import { request } from "../helper.js";

export default defineComponent({
  props: {
    item: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
      newValue: "",
      icons: [],
      tabItems: [
        {
          name: "FontAwesome",
          id: "fontawesome",
        },
        {
          name: "Material Icons",
          id: "materialicons",
        },
      ],
    };
  },
  mounted() {
    console.log("IconSelect mounted, do http reuqest!");
    request(`${window.location.origin}/icons.json`, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        this.icons = Object.keys(data).filter((key) => {
          try {
            return data[key]?.styles?.includes("solid");
          } catch (err) {
            return false;
          }
        });
      }
    });
  },
  computed: {
    iconValue() {
      if (!this.newValue) {
        return this.icon;
      }
      return this.newValue;
    },
  },
  methods: {
    activeIcon(name) {
      if (!this.newValue) {
        return this.icon === "fa-solid fa-" + name;
      } else {
        return this.newValue === "fa-solid fa-" + name;
      }
    },
    setIcon() {
      this.item.icon = this.newValue;
      this.showPopup = false;
      this.newValue = null;
    },
  },
});
</script>



<template>
  <div>
    <button
      type="button"
      class="btn btn-outline-secondary text-white"
      v-on:click="showPopup = !showPopup"
    >
      <i :class="iconValue"></i>
    </button>

    <div
      class="modal"
      tabindex="-1"
      v-if="showPopup"
      :style="{ display: showPopup ? 'block' : 'none' }"
    >
      <div class="modal-dialog text-black modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modal title ({{ icon }})</h5>
            <button
              type="button"
              class="btn-close"
              v-on:click="showPopup = false"
            ></button>
          </div>
          <div class="modal-body m-0 p-0">
            <Tabs v-bind:items="tabItems">
              <!-- OVERVIEW -->
              <template v-slot:fontawesome class="p-0">
                <div class="row">
                  <div
                    class="col-2 text-center border"
                    :class="{ 'bg-primary': activeIcon(entry) }"
                    v-bind:key="index"
                    v-for="(entry, index) in icons"
                    v-on:click="newValue = 'fa-solid fa-' + entry"
                  >
                    <i class="fa-solid fa-3x" :class="'fa-' + entry"></i>
                    <div>{{ "fa-solid fa-" + entry }}</div>
                  </div>
                </div>
              </template>
              <template v-slot:materialicons>
                <div class="row">
                  <div>MAterial icons</div>
                </div>
              </template>
            </Tabs>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              v-on:click="showPopup = false"
            >
              Close
            </button>
            <button type="button" class="btn btn-primary" @click="setIcon()">
              Set Icon
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scope>
.modal {
  display: block !important; /* I added this to see the modal, you don't need this */
}

/* Important part */
.modal-dialog {
  overflow-y: initial !important;
}
.modal-body {
  height: 80vh;
  overflow-y: auto;
}
.modal {
  background-color: rgba(0, 0, 0, 0.8) !important;
}
</style>