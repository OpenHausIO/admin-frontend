<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { routes, router } from "./router/index.js";

import "@dafcoe/vue-notification/dist/vue-notification.css";
</script>

<script>
import { useNotificationStore } from "@dafcoe/vue-notification";

const { setNotification } = useNotificationStore();
export default {
  data() {
    return {
      overlay: false,
      authToken: window.localStorage.getItem("x-auth-token"),
    };
  },
  computed: {
    expertSettingsCheckbox: {
      get() {
        if (window.localStorage.getItem("expertSettings")) {
          return Boolean(window.localStorage.getItem("expertSettings"));
        }

        return false;
      },
      set(val) {
        let message = "Expert settings disabled!";

        if (val) {
          message = "Expert settings enabled!";
        }

        setNotification({
          message,
          type: "info",
          showIcon: true,
          dismiss: {
            manually: true,
            automatically: true,
          },
          duration: 5000,
          showDurationProgress: true,
          appearance: "light",
        });

        window.localStorage.setItem("expertSettings", String(val));
      },
    },
  },
  methods: {
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some((path) => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
    logout() {
      window.request(
        "/auth/logout",
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
        },
        (err, data) => {
          if (err) {
            console.log("LOGOUT ERROR", err);
            console.log(err || data);
            router.replace({
              path: "/",
            });
          } else {
            window.localStorage.removeItem("x-auth-token");
            router.replace({
              path: "/",
            });
          }
        }
      );
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

  <!-- NOTIFICATIONS -->
  <div id="notifications">
    <vue-notification-list position="top-right"></vue-notification-list>
  </div>
  <!-- NAVIGATION -->

  <div class="container-fluid">
    <div class="row">
      <div class="col-2 border-end border-secondary" >
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
            <li class="nav-item hide">
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

          <li class="nav-item hide">
            <a class="nav-link" href="#">
              <i class="fa-solid fa-gear"></i> Settings
            </a>
          </li>

          <li class="nav-item" v-if="authToken">
            <a class="nav-link" href="#" v-on:click.prevent="logout()">
              <i class="fa-solid fa-right-from-bracket"></i> Logout
            </a>
          </li>

          <RouterLink
            custom
            to="/environment"
            v-slot="{ href, navigate, isActive }"
          >
            <li class="nav-item hide">
              <a
                class="nav-link"
                aria-current="page"
                :href="href"
                :class="{ active: isActive }"
                @click="navigate"
              >
                <i class="fa-solid fa-sliders"></i>
                Environment
              </a>
            </li>
          </RouterLink>

          <li class="nav-item hide">
            <hr />
          </li>

          <li class="nav-item hide">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="expertSettingsCheckbox"
                v-model="expertSettingsCheckbox"
              />
              <label
                class="form-check-label small"
                for="expertSettingsCheckbox"
              >
                Expert Settings
              </label>
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

a.nav-link{
  color: rgba(var(--bs-black-rgb),var(--bs-text-opacity)) !important;
}

a.nav-link.active{
  color: var(--bs-blue) !important;
}

#inner {
  margin: 0 auto;
  top: calc(100% - 50px);
}
</style>
