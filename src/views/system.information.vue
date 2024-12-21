<script>
import { defineComponent } from 'vue';
import { request } from "@/helper.js";

import { addNotification } from "@/components/Notifications.vue";

export default defineComponent({
    data() {
        return {
            pair: [],
            data: {},
            versions: {},
            usage: {},
            interval: null
        };
    },
    mounted() {

        request("/api/system/info/versions", (err, data) => {
            if (err) {

                console.log(err || data);

            } else {

                Object.assign(this, data);

            }
        });


        this.interval = setInterval(() => {
            request("/api/system/info/usage", (err, data) => {
                if (err) {

                    console.log(err || data);

                } else {

                    Object.assign(this.usage, data);

                }
            });
        }, 3000);

    },
    unmounted() {
        clearInterval(this.interval);
    }
});
</script>

<template>
    <div>

        {{ versions }}

        {{ usage }}

    </div>
</template>