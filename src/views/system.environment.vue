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
        request("/api/system/info/environment", (err, data) => {
            if (err) {

                console.log(err || data);

            } else {

                Object.keys(data).forEach((key) => {
                    this.pair[key] = {
                        value: data[key],
                        visible: false
                    };
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
                    <th scope="col">Key</th>
                    <th scope="col">Value</th>
                </tr>
            </thead>
            <tbody>
                <tr v-bind:key="key" v-for="(item, key, index) in pair">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>
                        {{ key }}
                    </td>
                    <td>

                        <div class="input-group">
                            <input :type="item.visible ? 'text' : 'password'" class="form-control bg-dark text-white"
                                v-model="item.value" :readonly="true">
                            <button class="btn btn-outline-secondary" type="button"
                                @click="item.visible = !item.visible" tooltip="Show Value" flow="left">
                                <i class="fa-solid"
                                    :class="{ 'fa-eye': !item.visible, 'fa-eye-slash': item.visible }"></i>
                            </button>
                        </div>

                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>