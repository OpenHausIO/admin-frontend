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
    <div>

        <div ref="logfilecontainer" style="max-height: 90vh; min-height: 90vh; overflow-x: scroll" @scroll="onScroll">
            <div class="record" v-bind:key="index" v-for="(record, index) in records" v-html="format(record)"></div>
        </div>

        <hr class="mb-2" />

        <div class="form-check form-switch float-start">
            <label>
                <input class="form-check-input" type="checkbox" v-bind:checked="autoscrollEnabled"
                    v-model="autoscrollEnabled" />
                <small>Autoscroll</small>
            </label>
        </div>

        <button class="btn btn-outline-danger float-end ms-1" @click="clearLogfiles()">
            Clear
        </button>

        <button class="btn btn-outline-secondary float-end" @click="exportLogfiles()">
            Export
        </button>

    </div>
</template>