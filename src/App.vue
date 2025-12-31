<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { router, components, system } from "./router/index.js";
import { settingsStore } from "./store.js";
//import "@dafcoe/vue-notification/dist/vue-notification.css";
import { version } from "../package.json";

const settings = settingsStore();
</script>

<script>
import { defineComponent } from "vue";
import Card from "@/components/Card.vue";
import Notifications, { addNotification } from "@/components/Notifications.vue";
import ProgressBar from "@/components/Progressbar.vue"

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
            ],
            collapsed: {
                components: false,
                system: true,
                manifests: true,
                settings: true
            },
            manifests: [/*{
                name: "node red",
                src: "/api/plugins/68d3d35b1370d2b18e3f24f7/proxy/red",
                icon: "fa-solid fa-code"
            }, {
                name: "example.com",
                src: "https://example.com",
                icon: "fa-solid fa-globe"
            }*/]
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
        },
        openInNewTab(url) {

            if (!(url.startsWith("https://") || url.startsWith("http://"))) {
                const { protocol, host } = window.location;
                url = `${protocol}//${host}/${url.replace(/^\/+/, '')}`;
            }

            let features = [
                //"width=800",
                //"height=600",
                "fullscreen=yes",
                "toolbar=no",
                "menubar=no",
                "location=no",
                "status=no",
                "scrollbars=yes",
                "resizable=yes"
            ].join(",");

            window.open(url, "_blank", features);

        }
    },
    mounted() {

        fetch("/api/plugins/manifests").then((res) => {

            if (res.status !== 200) {
                return;
            }

            return res.json();

        }).then((json) => {

            console.log("manifests:", json);

            this.manifests = json || [];

            if (json?.length === 0) {
                this.collapsed.manifests = true;
            }

        }).catch((err) => {

            console.warn("Could not fetch plugin manifests", err);

            addNotification(`<b>Could not fetch manifests:</b><br />${err.toString()}`, {
                type: "danger",
                dismiss: false
            });

        });

    },
    computed: {
        addMarginOnTop() {

            let { path } = this.$route;

            if (path.startsWith("/dashboard") || path.startsWith("/embedded")) {
                return "";
            }

            return "mt-3";
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

    <!-- PROGRESSBAR -->
    <ProgressBar></ProgressBar>
    <!-- PROGRESSBAR -->

    <div class="container-fluid">
        <div class="row">
            <div class="col-2 border-end p-0"
                style="border-right-color: #000 !important; overflow-x: scroll; height: 100vh">
                <ul class="nav flex-column">

                    <li class="nav-item hide">
                        <Card>
                            <button class="navbar-toggler" type="button">
                                <i class="fa-solid fa-bars"></i>
                            </button>
                        </Card>
                    </li>

                    <!-- DASHBOARD & APP -->
                    <li class="nav-item">
                        <Card>
                            <a class="nav-link" href="/user/">
                                <i class="fa-solid fa-user"></i>
                                User Interface
                            </a>
                        </Card>
                    </li>

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
                    <!-- DASHBOARD & APP -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- COMPONENTS -->
                    <li class="nav-item">
                        <Card @click="collapsed.components = !collapsed.components" style="cursor:pointer">
                            <div class="d-flex align-items-center">
                                <span>Components</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.components"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <div v-if="!collapsed.components">
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
                    </div>
                    <!-- COMPONENTS -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- PAGES/MANIFESTS -->
                    <li class="nav-item">
                        <Card @click="collapsed.manifests = !collapsed.manifests" style="cursor:pointer">
                            <div class="d-flex align-items-center">
                                <span>Pages</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.manifests"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <div v-if="!collapsed.manifests">

                        <RouterLink v-for="manifest in manifests" :key="manifest.name" custom
                            v-slot="{ href, navigate, isActive }"
                            :to="{ path: '/embedded', query: { src: manifest.src } }">
                            <li class="nav-item">
                                <Card>

                                    <div class="d-flex align-items-center">
                                        <div>
                                            <a class="nav-link" :href="href"
                                                :class="{ active: $route.query.src === manifest.src }"
                                                @click="navigate">
                                                <i v-bind:class="manifest.icon"></i>
                                                {{ manifest.name }}

                                            </a>
                                        </div>
                                        <div class="ms-auto">

                                            <a :href="manifest.src" @click.prevent="openInNewTab(manifest.src)"
                                                class="external-window-link" tooltip="Open in new Window" flow="left">
                                                <i class="fa-solid fa-arrow-up-right-from-square"></i>
                                            </a>

                                        </div>
                                    </div>

                                </Card>
                            </li>
                        </RouterLink>

                        <li class="nav-item" v-if="manifests.length === 0">
                            <Card>No plugin provided pages</Card>
                        </li>

                    </div>
                    <!-- PAGES/MANIFESTS -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- SYSTEM -->
                    <li class="nav-item">
                        <Card @click="collapsed.system = !collapsed.system" style="cursor:pointer">
                            <div class="d-flex align-items-center">
                                <span>System</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.system"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <div v-if="!collapsed.system">
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
                    </div>
                    <!-- SYSTEM -->

                    <li class="nav-item">
                        <hr />
                    </li>

                    <!-- SETTINGS -->
                    <li class="nav-item">
                        <Card @click="collapsed.settings = !collapsed.settings" style="cursor:pointer">
                            <div class="d-flex align-items-center">
                                <span>Settings</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.settings"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <div v-if="!collapsed.settings">
                        <li class="nav-item">
                            <Card class="p-2">
                                <div class="form-check form-switch" style="cursor: pointer !important">
                                    <label>
                                        <input class="form-check-input" type="checkbox"
                                            v-model="settings.expertSettings"
                                            @change.lazy="showExpertSettingsNotification" />
                                        Expert Settings
                                    </label>
                                </div>
                            </Card>
                        </li>

                        <li class="nav-item">
                            <Card class="p-2">
                                <select class="form-select bg-transparent border-primary text-white"
                                    v-model="settings.dateformat">
                                    <option v-for="format in dateformats">
                                        {{ format }}
                                    </option>
                                </select>
                            </Card>
                        </li>
                    </div>
                    <!-- SETTINGS -->

                    <li class="nav-item">
                        <hr />
                    </li>


                    <li class="nav-item">
                        <Card>
                            Version: v{{ version }}
                        </Card>
                    </li>

                </ul>
            </div>
            <div class="col-10" style="overflow-x: scroll; max-height: 100vh">

                <!-- VIEW -->
                <RouterView :class="addMarginOnTop" />
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

a.external-window-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    border: 1px solid var(--bs-primary);
    border-radius: 50%;
    font-size: 10px;
}
</style>
