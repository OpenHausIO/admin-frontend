<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { routes } from "./router/index.js";
</script>

<script>
export default {
  data() {
    return {
      overlay: false,
    };
  },
  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
  },
};
</script>


<template>
  <!-- OVERLAY -->
  <div v-if="overlay" id="overlay" class="text-center">
    <div id="inner">
      <h1>Loading...</h1>
    </div>
  </div>
  <!-- OVERLAY -->

  <!-- NAVIGATION -->

  <div class="container-fluid">
    <div class="row">
      <div class="col-2" style="border-right: 1px red solid !important">
        <ul class="nav flex-column">
          <RouterLink
            custom
            to="/dashboard"
            v-slot="{ href, navigate, isActive }"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
              >
                <i class="fa-solid fa-gauge-high"></i>
                Dashboard
              </a>
            </li>
          </RouterLink>

          <li class="nav-item">
            <hr />
          </li>

          <RouterLink
            custom
            v-bind:to="route.path"
            v-slot="{ href, navigate, isActive }"
            v-bind:key="route.path"
            v-for="route in routes"
          >
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
              >
                <i v-bind:class="route.icon"></i>
                {{ route.name }}
              </a>
            </li>
          </RouterLink>

          <li class="nav-item">
            <hr />
          </li>

          <RouterLink custom to="/logs" v-slot="{ href, navigate, isActive }">
            <li class="nav-item">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
              >
                <i class="fa-solid fa-file"></i>
                Logfiles
              </a>
            </li>
          </RouterLink>

          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="fa-solid fa-gear"></i> Settings
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
          </li>

          <li class="nav-item">
            <hr />
          </li>

          <li class="nav-item">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label class="form-check-label small" for="flexSwitchCheckDefault"
                >Advanced Settings</label
              >
            </div>
          </li>
        </ul>
      </div>
      <div class="col-10">
        <!-- VIEW -->
        <RouterView class="mt-4" />
        <!-- VIEW -->
      </div>
    </div>
  </div>
</template>

<style>
@import "@/assets/base.css";
/*@import "node_modules/bootstrap/dist/css/bootstrap.css";*/

html,
body {
  min-height: 100%;
  min-width: 100%;
}

#overlay {
  position: fixed; /* Sit on top of the page content */
  min-width: 100%; /* Full width (cover the whole page) */
  min-height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9); /* Black background with opacity */
  z-index: 9999; /* Specify a stack order in case you're using a different order for other elements */
}

#inner {
  margin: 0 auto;
  top: calc(100% - 50px);
}
</style>
