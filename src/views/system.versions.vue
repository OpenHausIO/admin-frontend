<script>
import { defineComponent } from "vue";
import Tabs from "@/components/Tabs.vue";

import { request } from "../helper.js";

export default defineComponent({
    components: {
        Tabs
    },
    data() {
        return {
            pair: {}
        };
    },
    mounted() {
        request("/api/system/info/versions", (err, data) => {
            if (err) {
                console.log(err || data);
            } else {

                console.log("data", data)

                Object.keys(data).forEach((key) => {
                    this.pair[key] = data[key];
                });
            }
        });
    },
});
</script>


<template>
    <div>
        <h3>Environment variables</h3>

        <table class="table text-white">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Programm/Dependency</th>
                    <th scope="col">Version</th>
                </tr>
            </thead>
            <tbody>
                <tr v-bind:key="key" v-for="(version, key, index) in pair">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                        {{ key }}
                    </td>
                    <td>
                        {{ version }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>