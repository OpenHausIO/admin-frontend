<template>
    <table class="table text-white border-secondary">
        <thead>
            <tr>

                <th scope="col">#</th>

                <!-- DYNAMIC COLS -->
                <th scope="col" v-for="(col, index) in cols" :key="index">
                    <span style="cursor: pointer;" @click="sort(col?.key ? col.key : col.toLowerCase())">
                        {{ typeof col === "string" ? col : col.name }}
                        <i class="fa-solid fa-filter" style="font-size: 12px"></i>
                    </span>
                </th>
                <!-- DYNAMIC COLS -->

                <th scope="col" style="width: 10px">Actions</th>

            </tr>
        </thead>
        <tbody>
            <tr v-for="(row, ri) in sorted" :key="ri">
                <th scope="row">
                    {{ ri + 1 }}
                </th>
                <td v-for="(col, ci) in cols" :key="ci">
                    <template v-if="typeof col === 'string'">
                        <slot :name="col.toLowerCase()" :value="row[col.toLowerCase()] || ''" :obj="row"
                            :prop="col.toLowerCase()">
                            {{ row[col.toLowerCase()] || '' }}
                        </slot>
                    </template>
                    <template v-else>
                        <slot :name="col.key" :value="row[col.key] || ''" :obj="row" :prop="col.key">
                            {{ row[col.key] || '' }}
                        </slot>
                    </template>
                </td>
                <td>

                    <ActionsButtons :showEdit="true" :showInfo="true" :showRemove="true" :item="row"
                        @handleEdit="this.$emit('edit', row)" @handleInfo="this.$emit('info', row)"
                        @handleRemove="this.$emit('remove', row)" @handleJson="this.$emit('json', row)">
                        <slot name="actions" :obj="row">
                        </slot>
                    </ActionsButtons>

                </td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import { defineComponent } from "vue";

import ActionsButtons from "./ActionsButtons.vue";

export default defineComponent({
    components: {
        ActionsButtons
    },
    props: {
        cols: {
            type: Array,
            required: true
        },
        rows: {
            type: Array,
            required: true
        }
    },
    emits: ["edit", "info", "remove", "json"],
    data() {
        return {
            currentSort: null,
            currentSortDir: "asc"
        }
    },
    methods: {
        sort(s) {
            if (s === this.currentSort) {
                this.currentSortDir = this.currentSortDir === "asc" ? "desc" : "asc";
            }
            this.currentSort = s;
        },
    },
    computed: {
        sorted() {

            if (!this.currentSort) {
                return this.rows;
            }

            return this.rows.sort((a, b) => {
                let modifier = 1;
                if (this.currentSortDir === "desc") modifier = -1;
                if (a[this.currentSort] < b[this.currentSort]) return -1 * modifier;
                if (a[this.currentSort] > b[this.currentSort]) return 1 * modifier;
                return 0;
            });

        },
    }
});
</script>
