<script setup>
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { router, components, system } from "./router/index.js";
import { settingsStore, userStore } from "./store.js";
//import "@dafcoe/vue-notification/dist/vue-notification.css";
import { version } from "../package.json";

const settings = settingsStore();

</script>

<script>
import { defineComponent } from "vue";
import Card from "@/components/Card.vue";
import Notifications, { addNotification } from "@/components/Notifications.vue";
import ProgressBar from "@/components/Progressbar.vue";
import { request } from "./helper.js";


export default defineComponent({
    components: {
        Card,
        Notifications
    },
    data() {
        return {
            overlay: false,
            menuOpen: false,
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
    watch: {
        // Mobile-Menü nach jeder Navigation schließen
        $route() {
            this.menuOpen = false;
        }
    },
    methods: {
        subIsActive(input) {
            const paths = Array.isArray(input) ? input : [input];
            return paths.some((path) => {
                return this.$route.path.indexOf(path) === 0; // current path starts with this path string
            });
        },
        async logout() {

            const user = userStore();

            await user.logout();

            this.menuOpen = false;

            addNotification("<b>Successful Logout:</b><br />You have been logged out", {
                type: "success"
            });

            setTimeout(() => {
                this.$router.push({
                    path: "/auth/login",
                });
            }, 3500);

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

        fetch(`/api/plugins/manifests`, {
            headers: {
                "x-auth-token": localStorage.getItem("x-auth-token")
            }
        }).then((res) => {

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

            //return "mt-3";

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

    <!-- MOBILE TOPBAR (nur unter md sichtbar) -->
    <nav class="navbar d-md-none mobile-topbar px-3" style="box-shadow: 0 .5rem .7rem rgba(0,0,0,.3) !important">
        <span class="navbar-brand mb-0">{{ $route.name }}</span>
        <button class="btn mobile-toggler ms-auto" type="button" @click="menuOpen = !menuOpen" aria-controls="sidebar"
            :aria-expanded="menuOpen" aria-label="Toggle navigation">
            <i class="fa-solid" :class="menuOpen ? 'fa-xmark' : 'fa-bars'"></i>
        </button>
    </nav>
    <!-- MOBILE TOPBAR -->

    <div class="container-fluid">
        <div class="row">
            <div id="sidebar" class="col-12 col-md-3 col-xl-2 p-3 sidebar d-md-block" :class="{ 'd-none': !menuOpen }">

                <!-- DASHBOARD & APP -->
                <ul class="nav flex-column mb-3 sidebar-nav">

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

                    <li class="nav-item">
                        <Card>
                            <a class="nav-link" @click.prevent="logout()" style="cursor: pointer">
                                <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                Logout
                            </a>
                        </Card>
                    </li>

                </ul>
                <!-- DASHBOARD & APP -->

                <!-- COMPONENTS -->
                <ul class="nav flex-column mb-3 sidebar-nav">

                    <li class="nav-item">
                        <Card @click="collapsed.components = !collapsed.components" style="cursor:pointer" class="p-2">
                            <div class="d-flex align-items-center">
                                <span>Components</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.components"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <template v-if="!collapsed.components">
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
                    </template>
                </ul>
                <!-- COMPONENTS -->

                <!-- PAGES/MANIFESTS -->
                <ul class="nav flex-column mb-3 sidebar-nav">
                    <li class="nav-item">
                        <Card @click="collapsed.manifests = !collapsed.manifests" style="cursor:pointer" class="p-2">
                            <div class="d-flex align-items-center">
                                <span>Pages</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.manifests"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <template v-if="!collapsed.manifests">

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

                    </template>
                </ul>
                <!-- PAGES/MANIFESTS -->

                <!-- SYSTEM -->
                <ul class="nav flex-column mb-3 sidebar-nav">

                    <li class="nav-item">
                        <Card @click="collapsed.system = !collapsed.system" style="cursor:pointer" class="p-2">
                            <div class="d-flex align-items-center">
                                <span>System</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.system"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <template v-if="!collapsed.system">
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
                    </template>

                </ul>
                <!-- SYSTEM -->

                <!-- SETTINGS -->
                <ul class="nav flex-column sidebar-nav">
                    <li class="nav-item">
                        <Card @click="collapsed.settings = !collapsed.settings" style="cursor:pointer" class="p-2">
                            <div class="d-flex align-items-center">
                                <span>Settings</span>
                                <i class="fa-solid fa-angle-down ms-auto" v-if="collapsed.settings"></i>
                                <i class="fa-solid fa-angle-up ms-auto" v-else></i>
                            </div>
                        </Card>
                    </li>

                    <template v-if="!collapsed.settings">
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
                    </template>

                </ul>
                <!-- SETTINGS -->

            </div>
            <div class="col-12 col-md-9 col-xl-10 ps-md-0 p-3 main-view">

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

/* ---------- LAYOUT / RESPONSIVE ---------- */

/* Mobile Topbar mit Hamburger, bleibt beim Scrollen oben */
.mobile-topbar {
    position: sticky;
    top: 0;
    z-index: 1030;
    background-color: #101418;
    border-bottom: 1px solid var(--bs-border-color);
}

.mobile-toggler {
    border: 1px solid var(--bs-border-color);
    font-size: 1.1rem;
    line-height: 1;
    padding: .4rem .6rem;
}

.main-view {
    overflow-x: auto;
}

/* Ab md: Sidebar und View scrollen jeweils unabhängig auf voller Höhe */
@media (min-width: 768px) {
    .sidebar {
        height: 100vh;
        overflow-y: auto;
    }

    .main-view {
        max-height: 100vh;
        overflow-y: auto;
    }
}

/* ---------- SIDEBAR ---------- */

ul.sidebar-nav {
    border-radius: .375rem;
    background-color: #101418;
    /*border: 1px solid #000;*/
}

ul.sidebar-nav>li>* {
    border-radius: 0 !important;
}

ul.sidebar-nav>li:first-child>* {
    border-top-left-radius: .375rem !important;
    border-top-right-radius: .375rem !important;
}

ul.sidebar-nav>li:last-child>* {
    border-bottom-left-radius: .375rem !important;
    border-bottom-right-radius: .375rem !important;
}

/* ---------- TABLES ---------- */
/* Rahmen, Rundung und Hintergrund sitzen am Wrapper, nicht an der Tabelle.
   Kein overflow am Desktop, damit Tooltips über den Rand hinausragen dürfen */
.table-card {
    border: 1px solid var(--bs-border-color);
    border-radius: .375rem;
    background-color: #101418;
}

/* Tabelle und Zellen transparent, damit die Rundung der Card sichtbar bleibt */
.table-card table.table {
    --bs-table-bg: transparent;
    background-color: transparent !important;
}

/* Horizontal scrollen nur auf kleinen Bildschirmen */
@media (max-width: 991.98px) {
    .table-card {
        overflow-x: auto;
    }
}

/* Direkt unter Tabs: oben links eckig, dort schließen die Tabs an */
.table-card-tabbed {
    border-top-left-radius: 0;
}

/* Letzte Zeile ohne eigene Unterkante, sonst doppelt mit dem Wrapper-Rahmen */
.table-card .table>tbody>tr:last-child>* {
    border-bottom: 0;
}

.table-card .table>tbody>tr>* {
    vertical-align: top;
}

/* Reine Textzellen (inkl. Switches) um die halbe Differenz zwischen
   Button-Höhe (2.375rem) und Zeilenhöhe (1.5rem) nach unten schieben,
   dann steht die erste Textzeile mittig neben Buttons/Inputs */
.table-card .table>tbody>tr> :is(td, th):not(:has(.btn, .form-control, .form-select, input:not(.form-check-input), textarea, select, table)) {
    padding-top: calc(.5rem + (2.375rem - 1.5rem) / 2);
}



.pane {
    background-color: #101418 !important;
    border: 1px solid #000;
    border-radius: .375rem;
}

:root {
    --topbar-height: 56px;
    --bg-color: #1a2026;
}

/* Mobile Topbar mit Hamburger, bleibt beim Scrollen oben */
.mobile-topbar {
    position: sticky;
    top: 0;
    z-index: 1030;
    height: var(--topbar-height);
    background-color: #101418 !important;
    border-bottom: 1px solid #000;
}

.sidebar {
    background-color: var(---bg-color);
}

/* Unter md: Sidebar legt sich als Overlay über den Content */
@media (max-width: 767.98px) {
    .sidebar {
        position: fixed;
        top: var(--topbar-height);
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1020;
        /* unter der Topbar, über dem Content */
        overflow-y: auto;
        overscroll-behavior: contain;
        /* Scrollen im Menü scrollt nicht die Seite dahinter */
        background-color: var(--bg-color);
    }
}
</style>