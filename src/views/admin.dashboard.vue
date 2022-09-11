<script setup>
import store from "../store.js";

import Tile from "@/components/Tile.vue";
</script>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    rooms() {
      return store.state.rooms;
    },
    devices() {
      return store.state.devices;
    },
    users() {
      return store.state.users;
    },
    plugins() {
      return store.state.plugins;
    },
  },
});
</script>


<template>
  <div class="conatiner">
    <div class="row">
      <div class="col-12">
        <h2>DASHBOARD</h2>
      </div>
    </div>
    <!-- QUCIK OVERVIEW -->
    <div class="row">
      <!-- ROOMS -->
      <div class="col-3">
        <div class="card bg-dark">
          <div class="card-body">
            <div class="float-start">
              <h3 class="text-black" style="--bs-text-opacity: 0.3">ROOMS</h3>
              <b>{{ rooms.length }}</b>
            </div>
            <i
              class="float-end fa-solid fa-door-open fa-4x text-black"
              style="--bs-text-opacity: 0.3"
            ></i>
          </div>
        </div>
      </div>
      <!-- ROOMS -->
      <!-- DEVICES -->
      <div class="col-3">
        <div class="card bg-dark">
          <div class="card-body">
            <div class="float-start">
              <h3 class="text-black" style="--bs-text-opacity: 0.3">DEVICES</h3>
              <b>{{ devices.length }}</b>
            </div>
            <i
              class="float-end fa-solid fa-tv fa-4x text-black"
              style="--bs-text-opacity: 0.3"
            ></i>
          </div>
        </div>
      </div>
      <!-- DEVICES -->
      <!-- USERS -->
      <div class="col-3">
        <div class="card bg-dark">
          <div class="card-body">
            <div class="float-start">
              <h3 class="text-black" style="--bs-text-opacity: 0.3">USERS</h3>
              <b>{{ users.length }}</b>
            </div>
            <i
              class="float-end fa-solid fa-user fa-4x text-black"
              style="--bs-text-opacity: 0.3"
            ></i>
          </div>
        </div>
      </div>
      <!-- USERS -->
      <!-- PLUGINS -->
      <div class="col-3">
        <div class="card bg-dark">
          <div class="card-body">
            <div class="float-start">
              <h3 class="text-black" style="--bs-text-opacity: 0.3">PLUGINS</h3>
              <b>{{ plugins.length }}</b>
            </div>
            <i
              class="float-end fa-solid fa-puzzle-piece fa-4x text-black"
              style="--bs-text-opacity: 0.3"
            ></i>
          </div>
        </div>
      </div>
      <!-- PLUGINS -->
    </div>
    <!-- QUCIK OVERVIEW -->
    <!-- SYSTEM USAGE -->
    <div class="row mt-4">
      <!-- RESOURCES -->
      <div class="col-4">
        <div class="card bg-dark">
          <div class="card-body">
            <!-- TITEL -->
            <div class="row">
              <h3 class="text-black" style="--bs-text-opacity: 0.3">
                RESOURCES
              </h3>
            </div>
            <!-- TITEL -->
            <!-- CPU -->
            <div class="row">
              <div class="d-block">
                <div class="float-start">CPU</div>
                <div class="float-end">100%</div>
              </div>
              <div class="d-block">
                <div class="progress" style="height: 3px">
                  <div
                    class="progress-bar bg-danger"
                    role="progressbar"
                    style="width: 100%"
                  ></div>
                </div>
              </div>
            </div>
            <!-- CPU -->
            <!-- RAM -->
            <div class="row mt-3">
              <div class="d-block">
                <div class="float-start">RAM</div>
                <div class="float-end">2.2GB/16GB</div>
              </div>
              <div class="d-block">
                <div class="progress" style="height: 3px">
                  <div
                    class="progress-bar"
                    role="progressbar"
                    style="width: 25%"
                  ></div>
                </div>
              </div>
            </div>
            <!-- RAM -->
            <!-- DISK -->
            <div class="row mt-3">
              <div class="d-block">
                <div class="float-start">HDD</div>
                <div class="float-end">2.4TB/3TB</div>
              </div>
              <div class="d-block">
                <div class="progress" style="height: 3px">
                  <div
                    class="progress bg-warning"
                    role="progressbar"
                    style="width: 71%"
                  ></div>
                </div>
              </div>
            </div>
            <!-- DISK -->
          </div>
        </div>
      </div>
      <!-- RESOURCES -->
      <!-- LOGFILE -->
      <div class="col-4">
        <div class="card bg-dark">
          <div class="card-body">
            <div style="height: 300px; overflow: scroll">
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla
              bla bla bla bla
            </div>
          </div>
        </div>
      </div>
      <!-- LOGFILE -->
      <!-- ALARM -->
      <div class="col-4">
        <div class="card bg-danger">
          <div class="card-body">
            <div style="height: 100px; overflow: scroll">
              <h3>
                <i class="blink_me fa-solid fa-triangle-exclamation"></i>
                <b>ALARM</b>
              </h3>
              <div class="d-block">Melder 3 Ausgelöst</div>
              <div class="d-block">Fenster sensor Ausgelöst</div>
            </div>
          </div>
        </div>
      </div>
      <!-- ALARM -->
    </div>
    <!-- SYSTEM USAGE -->
    <!-- MESSAGES -->
    <div class="row mt-4">
      <div class="col-4">
        <div class="card bg-primary">
          <div class="card-body">
            <div class="d-block">"Fenster Rechts" sensor ist offline</div>
            <div class="d-block">"Fenster Links" sensor ist offline</div>
            <div class="d-block">"Bewegungsmelder" ist offline</div>
          </div>
        </div>
      </div>
    </div>
    <!-- MESSAGES -->
  </div>
</template>


<style scoped>
.blink_me {
  animation: blinker 1s linear infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}

.card {
  border-color: #000;
}

/*
https://stackoverflow.com/a/28413382/5781499
https://jsfiddle.net/Ivoss/v2rayjx0/
h3 {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
*/
</style>