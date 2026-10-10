<script>
import { defineComponent } from "vue";
import { test } from "../router/index.js";


export default defineComponent({
    computed: {
        routeEntrys() {
            return test;
        }
    }
});

</script>

<template>

    <!-- DYNAMIC LINKS -->
    <ul>
        <RouterLink custom v-bind:to="route.path" v-slot="{ href, navigate }" v-bind:key="index"
            v-for="(route, index) in routeEntrys">

            <li class="nav-item" :href="href" @click="navigate">
                <a class="nav-link">
                    <span>{{ route.name }}</span>
                </a>
            </li>
            <!-- LINK -->
        </RouterLink>
    </ul>
    <!-- DYNAMIC LINKS -->

</template>