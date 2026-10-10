<script>
import { defineComponent } from "vue";
import { request } from "@/helper.js";
import dateFormat from "dateformat";

import { addNotification } from "@/components/Notifications.vue";
import { settingsStore } from "../store";

export default defineComponent({
    setup() {

        let settings = settingsStore();

        return {
            settings
        };

    },
    data() {
        return {
            pair: [],
            data: {},
            versions: {},
            usage: {},
            now: Date.now(),
            interval: null,
            usageInterval: null,
            abouts: {
                user: null,
                admin: null,
                backend: null
            }
        };
    },
    mounted() {

        this.fetchAbouts();

        // Reaktive Zeit jede Sekunde aktualisieren -> uptime wird neu berechnet
        this.interval = setInterval(() => {
            this.now = Date.now();
        }, 1000);

        /*
        request("/api/system/info/versions", (err, data) => {
            if (err) {

                console.log(err || data);

            } else {

                Object.assign(this, data);

            }
        });

        this.usageInterval = setInterval(() => {
            request("/api/system/info/usage", (err, data) => {
                if (err) {

                    console.log(err || data);

                } else {

                    Object.assign(this.usage, data);

                }
            });
        }, 3000);
        */

    },
    unmounted() {
        clearInterval(this.interval);
        clearInterval(this.usageInterval);
    },
    methods: {
        fetchAbouts() {

            let queries = ["/api", "/user", "/admin"].map((base) => {
                return request(`${base}/about.json`, {
                    signal: AbortSignal.timeout(3000)
                });
            });

            Promise.allSettled(queries).then(([backend, user, admin]) => {

                if (backend.status === "fulfilled") {
                    this.abouts.backend = backend.value;
                } else {
                    console.warn("Could not load /api/about.json", backend.reason);
                }

                if (user.status === "fulfilled") {
                    this.abouts.user = user.value;
                } else {
                    console.warn("Could not load /user/about.json", user.reason);
                }

                if (admin.status === "fulfilled") {
                    this.abouts.admin = admin.value;
                } else {
                    console.warn("Could not load /admin/about.json", admin.reason);
                }

            }).catch((err) => {

                console.warn("Could not load one more about.json's", err);

            });

        }
    },
    computed: {
        started() {

            if (!this.abouts?.backend) {
                return null;
            }

            return dateFormat(this.abouts.backend.start, this.settings.dateformat);

        },
        uptime() {

            const start = new Date(this.abouts?.backend?.start).getTime();

            if (Number.isNaN(start)) {
                return null;
            }

            const total = Math.max(0, Math.floor((this.now - start) / 1000));

            const days = Math.floor(total / 86400);
            const hours = Math.floor((total % 86400) / 3600);
            const minutes = Math.floor((total % 3600) / 60);
            const seconds = total % 60;

            const pad = (n) => String(n).padStart(2, "0");

            return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

        }
    }
});
</script>

<template>
    <div class="row g-3">

        <div class="col-12">
            <div class="pane p-3">

                <h5>Versions:</h5>

                <dl class="versions mb-0">
                    <dt>Backend</dt>
                    <dd>{{ abouts?.backend?.version }}</dd>

                    <dt>Admin UI</dt>
                    <dd>{{ abouts?.admin?.version }}</dd>

                    <dt>User UI</dt>
                    <dd>{{ abouts?.user?.version }}</dd>
                </dl>

            </div>
        </div>

        <div class="col-12">
            <div class="pane p-3">

                <h5>Uptime:</h5>

                <dl class="versions mb-0">
                    <dt>Start</dt>
                    <dd>{{ started }}</dd>

                    <dt>Uptime</dt>
                    <dd>{{ uptime }}</dd>
                </dl>

            </div>
        </div>

        <div class="col-4 hide">
            <div class="pane p-3">

                <h5>Resources</h5>

                CPU Usage
                <div class="progress bg-dark mb-3" role="progressbar" aria-label="Basic example" aria-valuenow="25"
                    aria-valuemin="0" aria-valuemax="100" style="height: 5px">
                    <div class="progress-bar" style="width: 25%"></div>
                </div>

                HDD Usage
                <div class="progress bg-dark mb-3" role="progressbar" aria-label="Basic example" aria-valuenow="25"
                    aria-valuemin="0" aria-valuemax="100" style="height: 5px">
                    <div class="progress-bar" style="width: 25%"></div>
                </div>

                RAM Usage
                <div class="progress bg-dark" role="progressbar" aria-label="Basic example" aria-valuenow="25"
                    aria-valuemin="0" aria-valuemax="100" style="height: 5px">
                    <div class="progress-bar" style="width: 25%"></div>
                </div>

            </div>
        </div>

    </div>
</template>


<style lang="css" scoped>
.versions {
    display: grid;
    grid-template-columns: max-content 1fr;
    column-gap: 1rem;
}

.versions dt {
    font-weight: normal;
}

.versions dd {
    margin: 0;
    font-variant-numeric: tabular-nums;
}
</style>