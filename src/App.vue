<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { router, components, system } from "./router/index.js";
import { settingsStore } from "./store.js";
//import "@dafcoe/vue-notification/dist/vue-notification.css";

const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";
import Card from "@/components/Card.vue";
import Notifications, { addNotification } from "@/components/Notifications.vue";

export default defineComponent({
    components: {
        Card,
        Notifications
    },
    data() {
        return {
            overlay: false,
            dateformats: [
                "yyyy.mm.dd - HH:MM",
                "yyyy.mm.dd - HH:MM:ss",
                "yyyy.mm.dd - HH:MM:ss.l",
                "dd.mm.yyyy - HH:MM",
                "dd.mm.yyyy - HH:MM:ss",
                "dd.mm.yyyy - HH:MM:ss.l"
            ]
        };
    },
    methods: {
        subIsActive(input) {
            const paths = Array.isArray(input) ? input : [input];
            return paths.some((path) => {
                return this.$route.path.indexOf(path) === 0; // current path starts with this path string
            });
        },
        logout() {
            window.request("/auth/logout", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
            }, (err, data) => {
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
            });
        },
        showExpertSettingsNotification({ target }) {
            if (target.checked) {
                addNotification("Expert settings enabled");
            } else {
                addNotification("Expert settings disabled");
            }
        }
    }
});
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
    <Notifications></Notifications>
    <!-- NOTIFICATIONS -->

    <div class="container-fluid">
        <div class="row">
            <div class="col-2 border-end p-0" style="border-right-color: #000 !important">
                <ul class="nav flex-column">

                    <!-- DASHBOARD & APP -->
                    <RouterLink custom to="/dashboard" v-slot="{ href, navigate, isActive }">
                        <li class="nav-item">
                            <Card>
                                <a class="nav-link" aria-current="page" :href="href" :class="{ active: isActive }"
                                    @click="navigate">
                                    <i class="fa-solid fa-gauge-high"></i>
                                    Dashboard
                                </a>
                            </Card>
                        </li>
                    </RouterLink>

                    <li class="nav-item">
                        <Card>
                            <a class="nav-link" href="/user/">
                                <i class="fa-solid fa-user"></i>
                                User Interface
                            </a>
                        </Card>
                    </li>
                    <!-- DASHBOARD & APP -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- COMPONENTS -->
                    <RouterLink custom v-bind:to="route.path" v-slot="{ href, navigate, isActive }"
                        v-bind:key="route.path" v-for="route in components">
                        <li class="nav-item">
                            <Card>
                                <a class="nav-link" aria-current="page" :href="href" :class="{ active: isActive }"
                                    @click="navigate">
                                    <i v-bind:class="route.icon"></i>
                                    {{ route.name }}
                                </a>
                            </Card>
                        </li>
                    </RouterLink>
                    <!-- COMPONENTS -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- SYSTEM -->
                    <RouterLink custom v-bind:to="route.path" v-slot="{ href, navigate, isActive }"
                        v-bind:key="route.path" v-for="route in system">
                        <li class="nav-item">
                            <Card>
                                <a class="nav-link" aria-current="page" :href="href" :class="{ active: isActive }"
                                    @click="navigate">
                                    <i v-bind:class="route.icon"></i>
                                    {{ route.name }}
                                </a>
                            </Card>
                        </li>
                    </RouterLink>
                    <!-- SYSTEM -->

                    <li class="nav-item hide">
                        <hr />
                    </li>

                    <li class="nav-item hide">
                        <a class="nav-link" href="#">
                            <i class="fa-solid fa-gear"></i> Settings
                        </a>
                    </li>

                    <li class="nav-item">
                        <hr />
                    </li>

                    <li class="nav-item">
                        <Card class="p-2">
                            <div class="form-check form-switch" style="cursor: pointer !important">
                                <label>
                                    <input class="form-check-input" type="checkbox" v-model="settings.expertSettings"
                                        @change.lazy="showExpertSettingsNotification" />
                                    Expert Settings
                                </label>
                            </div>
                        </Card>
                    </li>

                    <li class="nav-item">
                        <Card class="p-2">
                            <select class="form-select bg-dark text-white" v-model="settings.dateformat">
                                <option v-for="format in dateformats">
                                    {{ format }}
                                </option>
                            </select>
                        </Card>
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

hr {
    margin: 0 0;
    background-color: var(--bs-blue);
    box-shadow: 0px 0px 5px 0px var(--bs-blue);
}

#overlay {
    position: fixed;
    /* Sit on top of the page content */
    min-width: 100%;
    /* Full width (cover the whole page) */
    min-height: 100%;
    /* Full height (cover the whole page) */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    /* Black background with opacity */
    z-index: 9999;
    /* Specify a stack order in case you're using a different order for other elements */
}

a.nav-link {
    color: rgba(var(--bs-black-rgb), var(--bs-text-opacity)) !important;
}

a.nav-link.active {
    color: var(--bs-blue) !important;
}

#inner {
    margin: 0 auto;
    top: calc(100% - 50px);
}

.table>tbody>tr,
.table>thead>tr {
    border: 2px solid #000;
}
</style>
