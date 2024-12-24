<script setup>
import dateFormat from "dateformat";
</script>

<script>
import { defineComponent } from "vue";

import Tabs from "@/components/Tabs.vue";

export default defineComponent({
    components: {
        Tabs
    },
    data() {
        return {
            records: [],
            colors: {
                trace: "green",
                verbose: "cyan",
                debug: "gray",
                info: "blue",
                warn: "yellow",
                error: "red",
            },
            autoscrollEnabled: true,
        };
    },
    methods: {
        colorize(record, text) {
            let color = this.colors[record.level];
            return `<span style="color: ${color}">${text}</span>`;
        },
        format(record) {
            let ts = this.colorize(
                record,
                dateFormat(record.timestamp, "yyyy.mm.dd - HH:MM.ss.l")
            );
            let lvl = this.colorize(record, record.level);
            let name = this.colorize(record, record.name);
            return `[${ts}][${lvl}][${name}] ${record.message}`;
        },
    },
    mounted() {
        let ws = this.ws = new WebSocket(`ws://${window.location.host}/api/logs`);

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
        <div ref="logfilecontainer" style="max-height: 800px; overflow-x: scroll">
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

<style scope>
.nav-link.active {
    color: red !important;
}
</style>