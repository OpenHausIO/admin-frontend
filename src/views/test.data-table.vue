<script>
import DataTable from '../components/DataTable.vue';

export default {
    components: {
        DataTable,
    },
    data() {
        return {
            cols: [{ key: "icon", name: "Grafik" }, { key: "name", name: "Name" }, "Date"],
            rows: [
                { icon: "foo", name: "bar1", date: { created: 948596300000, updated: 1585964500000, announced: 1475964500000 } },
                { name: "baz", date: { created: 1284963500000, updated: 1620001200000, announced: 1428964500000 }, icon: "bar2" },
                { date: { created: 1234567800000, updated: 1598743200000, announced: 1565245600000 }, icon: "fa fa-lightbulb", name: "aszsadf" },
                { icon: "fa fa-question-mark", date: { created: 1482345600000, updated: 1683246500000, announced: 1607845700000 }, name: "future" }
            ].map((obj) => {
                obj.editable = false;
                return obj;
            })
        };
    },
    methods: {
        print(obj) {
            obj.editable = !obj.editable;
            console.log(`Clicked ${obj.name}`, obj);
        }
    }
};
</script>

<template>
    <DataTable :cols="cols" :rows="rows">
        <template v-slot:icon="{ value, obj }">
            <u>Icon:</u> {{ value }}
            <span :class="{ 'text-success': obj.editable, 'text-danger': !obj.editable }">{{ obj.editable }}</span>
        </template>
        <template v-slot:date="{ value }">
            Created: <i style="color: var(--bs-primary)">{{ value.created }}</i>
            <br />
            Updated: <i style="color: var(--bs-primary)">{{ value.updated }}</i>
            <br />
            Announced: <i style="color: var(--bs-primary)">{{ value.announced }}</i>
        </template>
        <template v-slot:actions="{ obj }">
            <button class="btn btn-outline-primary" @click="print(obj)">
                <i class="fas fa-edit"></i>
                ASD
            </button>
        </template>
    </DataTable>
</template>