<script setup>
import dateFormat from "dateformat";
</script>

<script>
import { defineComponent } from "vue";
import { settingsStore } from "../store";
const settings = settingsStore();

import Tabs from "@/components/Tabs.vue";
import { request } from "../helper.js";

import { addNotification } from "../components/Notifications.vue";

export default defineComponent({
    components: {
        Tabs
    },
    data() {
        return {
            records: [],
            colors: {
                trace: "text-success",
                verbose: "text-secondary",
                debug: "text-muted",
                info: "text-primary",
                warn: "text-warning",
                error: "text-danger",
            },
            autoscrollEnabled: true,
        };
    },
    methods: {
        colorize(record, text) {
            let color = this.colors[record.level];
            return `<span class="${color}">${text}</span>`;
        },
        format(record) {
            let ts = this.colorize(
                record,
                dateFormat(record.timestamp, settings.dateformat)
            );
            let lvl = this.colorize(record, record.level);
            let name = this.colorize(record, record.name);
            return `[${ts}][${lvl}][${name}] ${record.message}`;
        },
        onScroll() {
            const c = this.$refs.logfilecontainer;
            const atBottom = c.scrollTop + c.clientHeight >= c.scrollHeight - 5;
            this.autoscrollEnabled = atBottom;
        },
        clearLogfiles() {

            request("/api/system/logs", {
                method: "DELETE"
            }, (err, result) => {

                this.records = [];

                addNotification("Logfiles cleared", {
                    type: "success"
                })

                console.log(err || result);

            });

        },
        exportLogfiles() {

            request(`/api/system/logs/export`, {
                method: "POST",
                headers: {
                    "content-type": "application/octet-stream"
                }
            }).then(res => {

                console.log("headers", res.headers)

                return res;

            }).then(blob => {

                let blobUrl = URL.createObjectURL(blob);
                let a = document.createElement("a");

                a.href = blobUrl;
                a.download = `OpenHaus-${Date.now()}-logfiles.tgz`;
                document.body.appendChild(a);
                a.click();

                document.body.removeChild(a);
                URL.revokeObjectURL(blobUrl);

                addNotification("Logfiles downloaded", {
                    type: "success"
                });

            });

        }
    },
    mounted() {

        let token = localStorage.getItem("x-auth-token");
        let url = window.location.protocol === "https:" ? "wss://" : "ws://";
        url += `${window.location.host}/api/logs?x-auth-token=${token}`;

        let ws = this.ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("Logfile websocket opend");
        };

        ws.onmessage = ({ data }) => {
            try {

                // handle incoming messages
                let entry = JSON.parse(data);
                this.records.push(entry);

                // autoscroll to bottom
                if (this.autoscrollEnabled) {
                    this.$nextTick(() => {
                        const container = this.$refs.logfilecontainer;
                        container.scrollTop = container.scrollHeight;
                    });
                }

            } catch (e) {

                console.warn("Could not parse logging entry", e, data);

            }
        };
    },
    unmounted() {

        this.ws.addEventListener("close", () => {
            console.log("ws connection /logs closed");
        });

        this.ws.close();
    },
    watch: {
        autoscrollEnabled(enabled) {
            if (enabled) {
                this.$nextTick(() => {
                    const container = this.$refs.logfilecontainer;
                    container.scrollTop = container.scrollHeight;
                });
            }
        }
    }
});
</script>

<template>
    <div class="pane logfiles">

        <div ref="logfilecontainer" class="logfiles-list" @scroll="onScroll">
            <div class="record" v-bind:key="index" v-for="(record, index) in records" v-html="format(record)"></div>
        </div>

        <div class="logfiles-footer">
            <div class="form-check form-switch mb-0">
                <label>
                    <input class="form-check-input" type="checkbox" v-model="autoscrollEnabled" />
                    <small>Autoscroll</small>
                </label>
            </div>

            <div class="ms-auto d-flex gap-2">
                <button class="btn btn-outline-secondary" @click="exportLogfiles()">Export</button>
                <button class="btn btn-outline-danger" @click="clearLogfiles()">Clear</button>
            </div>

        </div>

    </div>
</template>

<style scoped>
.logfiles {
    display: flex;
    flex-direction: column;
    /* Bildschirmhöhe minus Padding der View (p-3 oben + unten) */
    height: calc(100vh - 2rem);
}

.logfiles-list {
    flex: 1;
    min-height: 0;
    /* sonst wächst die Liste statt zu scrollen */
    overflow-y: auto;
    padding: 1rem;
    border-bottom: 1px solid #000
}

.logfiles-footer {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .5rem 1rem;
    border-top: 1px solid var(--bs-border-color);
}
</style>