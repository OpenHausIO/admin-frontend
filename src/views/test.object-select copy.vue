<script>
import ObjectSelect from '../components/ObjectSelect.vue';

export default {
    components: {
        ObjectSelect,
    },
    data() {
        return {
            selectedObject: null,
            options: [
                {
                    key: 'group1',
                    label: 'Group 1',
                    options: [
                        { key: 'item1', label: 'Item 1' },
                        { key: 'item2', label: 'Item 2' },
                    ],
                },
                {
                    key: 'group2',
                    label: 'Group 2',
                    options: [
                        { key: 'item3', label: 'Item 3' },
                        { key: 'item4', label: 'Item 4' },
                    ],
                },
            ],
            default: {
                item: {
                    key: "item3",
                    label: "Item 3"
                },
                group: "group2"
            },
        };
    },
    mounted() {
        // Initialisierung des Defaults
        this.selectedObject = this.default;
    },
};
</script>

<template>
    <div>
        <p>Selected Object: {{ selectedObject }}</p>
        <ObjectSelect v-model="selectedObject" :options="options" :size="5" />
    </div>
</template>
