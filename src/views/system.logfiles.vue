<script setup>
import dateFormat from "dateformat";
</script>

<script>
import { defineComponent } from "vue";
import { settingsStore } from "../store";
const settings = settingsStore();

import Tabs from "@/components/Tabs.vue";

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
    },
    mounted() {

        let url = window.location.protocol === "https:" ? "wss://" : "ws://";
        url += `${window.location.host}/api/logs`;

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
                    let container = this.$refs.logfilecontainer;
                    container.scrollTop = container.scrollHeight;
                }

            } catch (e) {
                // ignore errors
            }
        };
    },
    unmounted() {

        this.ws.addEventListener("close", () => {
            console.log("ws connection /logs closed");
        });

        this.ws.close();
    }
});
</script>


<template>
    <div>
        <div ref="logfilecontainer" style="max-height: 90vh; overflow-x: scroll">
            <div class="record" v-bind:key="index" v-for="(record, index) in records" v-html="format(record)"></div>
        </div>
        <hr />
        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-bind:checked="autoscrollEnabled"
                    v-model="autoscrollEnabled" />
                <small>Autoscroll</small>
            </label>
        </div>
    </div>
</template>