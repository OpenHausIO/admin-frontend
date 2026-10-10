<script>
import { defineComponent } from "vue";
import Card from "@/components/Card.vue";

import { itemStore } from "../store.js";
const items = itemStore();

export default defineComponent({
    components: {
        Card
    },
    data() {
        return {

        };
    },
    computed: {
        stats() {
            return [{
                title: "Rooms",
                icon: "fa-door-open",
                href: "/rooms",
                size: items.rooms.length
            }, {
                title: "Devices",
                icon: "fa-tv",
                href: "/devices",
                size: items.devices.length
            }, {
                title: "Users",
                icon: "fa-user",
                href: "/users",
                size: items.users.length
            }, {
                title: "Plugins",
                icon: "fa-puzzle-piece",
                href: "/plugins",
                size: items.plugins.length
            }, {
                title: "Endpoints",
                icon: "fa-lightbulb",
                href: "/endpoints",
                size: items.endpoints.length
            }, {
                title: "Vaults",
                icon: "fa-vault",
                href: "/vault",
                size: items.vault.length
            }, {
                title: "Store",
                icon: "fa-screwdriver-wrench",
                href: "/store",
                size: items.store.length
            }, {
                title: "SSDP",
                icon: "fa-right-left",
                href: "/ssdp",
                size: items.ssdp.length
            }, {
                title: "MDNS",
                icon: "fa-reply-all",
                href: "/mdns",
                size: items.mdns.length
            }, {
                title: "MQTT",
                icon: "fa-file-pen",
                href: "/mqtt",
                size: items.mqtt.length
            }, {
                title: "Webhooks",
                icon: "fa-anchor",
                href: "/webhooks",
                size: items.webhooks.length
            }, {
                title: "Scenes",
                icon: "fa-clone",
                href: "/scenes",
                size: items.scenes.length
            }]
        }
    }
});
</script>


<template>
    <div class="container-fluid p-0">

        <div class="row hide">
            <div class="col-12 p-0">
                <Card>
                    <h2>DASHBOARD</h2>
                </Card>
            </div>
        </div>

        <!-- QUICK OVERVIEW -->
        <!-- g-3: Abstand über Bootstrap-Gutter statt m-3, dadurch kein horizontaler Overflow -->
        <div class="row g-3">
            <RouterLink custom :to="item.href" v-slot="{ href, navigate }" v-for="item in stats" :key="item.href">
                <div class="col-6 col-sm-6 col-lg-4 col-xxl-3">
                    <a :href="href" @click="navigate" class="dashboard-link">
                        <Card class="dashboard-tile">
                            <div class="d-flex align-items-center gap-3">
                                <div class="min-w-0">
                                    <div class="dashboard-title text-truncate">{{ item.title }}</div>
                                    <div class="dashboard-count">{{ item.size }}</div>
                                </div>
                                <i class="fa-solid fa-3x ms-auto dashboard-icon" :class="item.icon"></i>
                            </div>
                        </Card>
                    </a>
                </div>
            </RouterLink>
        </div>
        <!-- QUICK OVERVIEW -->

        <!-- SYSTEM USAGE -->
        <div class="row mt-4 hide">
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
                                    <div class="progress-bar bg-danger" role="progressbar" style="width: 100%"></div>
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
                                    <div class="progress-bar" role="progressbar" style="width: 25%"></div>
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
                                    <div class="progress bg-warning" role="progressbar" style="width: 71%"></div>
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
        <div class="row mt-4 hide">
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

@media (prefers-reduced-motion: reduce) {
    .blink_me {
        animation: none;
    }
}

/* ---------- QUICK OVERVIEW ---------- */

/* Ganze Kachel ist der Link, ohne Link-Optik */
.dashboard-link {
    display: block;
    height: 100%;
    color: inherit;
    text-decoration: none;
    border-radius: .375rem;
}

/* Gleicher Look wie die Sidebar-Gruppen */
.dashboard-tile {
    height: 100%;
    padding: .75rem 1rem;
    background-color: #101418;
    border-radius: .375rem !important;
    transition: border-color .15s ease;
}

.min-w-0 {
    min-width: 0;
}

.dashboard-title {
    font-size: .875rem;
    font-weight: 600;
    /*color: var(--bs-secondary-color);*/
}

.dashboard-count {
    font-size: 1.75rem;
    font-weight: 600;
    line-height: 1.2;
}

@media (prefers-reduced-motion: reduce) {
    .dashboard-tile {
        transition: none;
    }
}

.card {
    border-color: #000;
}

.card-body {
    color: var(--bs-secondary) !important;
}

/*
https://stackoverflow.com/a/28413382/5781499
https://jsfiddle.net/Ivoss/v2rayjx0/
h3 {
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
}
*/
</style>