<script>
import { defineComponent } from "vue";
import Tabs from "@/components/Tabs.vue";
import { useRoute } from "vue-router";
import { request } from "../helper.js";
import TimestampsTable from "@/components/TimestampsTable.vue";


export default defineComponent({
    components: {
        Tabs,
        TimestampsTable
    },
    data() {
        return {
            path: "/",
            query: {},
            auth: {
                pairing: {
                    query: null
                }
            },
            connector: null,
            connectors: [],
            sse: null
        };
    },
    mounted() {

        // when server updates info
        // e.g. for active connections
        this.openSSE();

        this.fetchInfo();

        /*
        const { params, query } = useRoute();

        this.path = `/${Array.isArray(params.subPath) ? params.subPath.join("/") : params.subPath}`;
        this.query = query;

        console.log("Route", params, params.subPath);

        this.auth.pairing.query = query.info;
        this.connector = JSON.parse(query.info ?? "{}");

        console.log("info", query.info);
        */


    },
    methods: {
        fetchInfo() {
            request("/api/system/connector", (err, body) => {
                if (err) {

                    console.log("cold not fetch connector array", err);

                } else {

                    console.log("Result", body)

                    body.forEach((info) => {
                        Object.assign(info.timestamps, {
                            ...info.timestamps,
                            refreshed: Date.now()
                        });
                    });

                    this.connectors = body;

                }
            });
        },
        openSSE() {

            let token = localStorage.getItem("x-auth-token");
            const eventSource = new EventSource(`/api/system/connector/info?x-auth-token=${token}`);

            this.sse = eventSource;

            eventSource.onmessage = (event) => {
                try {

                    let data = JSON.parse(event.data);
                    console.log("MEssage from backend", data)

                    this.connectors = [data];

                } catch (err) {

                    console.warn("Could not parse see line/event", err);

                }
            };

            eventSource.onerror = (err) => {
                console.error("ERROR on EventSource", err);
                eventSource.close();
            };

        },
        closeSSE() {
            if (this.sse) {
                this.sse.close();
            }
        }
        /*
        allow(connector) {

            const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMzA4ODYzOGMtMjMyNi00ZjViLThiYzYtNzc5ZDhjZDY1MTFlIiwidHlwZSI6InN5c3RlbSIsInVzZXIiOiI2OTViYjZjNTc5NGRiNDc4ZjAwOTE2M2IifQ.xN2BO3ie8lYCTXzVWGa7yrY9ateob5MTTp5bpVvY0wQ";

            // 1) create short access token with user id
            // 2) callback to connector with token in url

            alert("Backend generated token" + jwt);

            // setTimeout simulates http request to backend
            // where token above is generated
            setTimeout(() => {

                let a = document.createElement("a");

                a.href = `${connector.callback}?token=${jwt}`;
                document.body.appendChild(a);

                a.click();

                document.body.removeChild(a);

            }, 2000);


        }
            */
    }
});
</script>


<template>
    <div>


        <table class="table text-white border-secondary">
            <thead>
                <tr>
                    <th scope="col" style="width: 10px">#</th>
                    <th scope="col" style="width: 10px">Hostname</th>
                    <th scope="col">Version</th>
                    <th scope="col">Interfaces</th>
                    <th scope="col">Whitelist</th>
                    <th scope="col">IP Address</th>
                    <th scope="col">Connections</th>
                    <th scope="col">Timestamps</th>
                </tr>
            </thead>
            <tbody>
                <tr v-bind:key="index" v-for="(connector, index) in connectors">
                    <th scope="row">{{ index + 1 }}</th>
                    <td> {{ connector.hostname }} </td>
                    <td> {{ connector.version }} </td>
                    <td>
                        <ul style="list-style: none; padding: 0;">
                            <li v-for="(iface, index) in connector.interfaces" :key="index"
                                style="display: flex; gap: 1rem;">
                                <span style="min-width: 80px;">{{ iface.name }}</span>
                                <span>{{ iface.address }}</span>
                            </li>
                        </ul>
                    </td>
                    <td>

                        <ul style="padding: 0 1rem">
                            <li v-for="(entry, index) in connector.whitelist" :key="index">
                                {{ entry }}
                            </li>
                        </ul>

                    </td>
                    <td>
                        {{ connector.ip }}
                    </td>
                    <td>
                        {{ connector.connections }}
                    </td>
                    <td>

                        <TimestampsTable :data="connector.timestamps" :mappings="{
                            'connected': 'Connected',
                            'refreshed': 'Refreshed',
                            'disconnected': 'Disconnected',
                        }" />

                    </td>
                </tr>
            </tbody>
        </table>

        <button class="btn btn-outline-primary" @click="fetchInfo()">
            Refresh
        </button>


        <!--

        Connector ({{ path }} - {{ query }}):

        <hr>

        <div v-if="path === '/'">

            Overview

        </div>
        <div v-else-if="path === '/auth/pair'">

            Pairing:

            Connector "{{ connector.name }}" ({{ connector.hostname }}) with IP {{ connector.lan }} wants to pair.

            <button class="btn btn-outline-success" @click="allow(connector)">
                Allow
            </button>

            <button class="btn btn-outline-danger" @click="decline(connector)">
                Decline
            </button>

        </div>
        <div v-else>

            404

        </div>
        -->

    </div>
</template>