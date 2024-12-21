<script>
// https://renatello.com/vue-js-tabs/
// https://www.trysmudford.com/blog/dynamic-scoped-slots-in-vue-js/

import { defineComponent } from "vue";

export default defineComponent({
    data() {
        return {
            activeItem: "",
        };
    },
    props: {
        items: Array
    },
    methods: {
        isActive(id) {
            return this.activeItem === id;
        },
        setActive(id) {
            this.activeItem = id;
        },
    },
    created() {
        this.activeItem = this.items[0].id;
    },
});
</script>


<template>
    <div class="container-fluid p-0">
        <!-- NAVIGATION ( nav-justified) -->
        <ul class="nav nav-tabs" style="border-color: #000">
            <li class="nav-item" v-bind:key="item.id" v-for="item in items">
                <a class="nav-link bg-dark" @click.prevent="setActive(item.id)" :class="{ active: isActive(item.id) }"
                    v-bind:href="item.id">{{ item.name }}</a>
            </li>
        </ul>
        <!-- NAVIGATION -->
        <!-- CONTENT -->
        <div class="tab-content" style="overflow-y: scroll !important">
            <div class="tab-pane fade" :class="{ 'active show': isActive(item.id) }" v-bind:key="item.id"
                v-for="item in items">
                <slot v-bind:id="item.id" v-bind:name="item.id"></slot>
            </div>
        </div>
        <!-- CONTENT -->
    </div>
</template>

<style scoped>
/*
.card {
  opacity: 0.8;
}
*/

.nav-item,
.nav-link {
    border-color: #000 !important;
}
</style>