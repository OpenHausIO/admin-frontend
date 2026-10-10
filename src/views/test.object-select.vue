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
                        { key: 'item3', label: 'Item 3' }
                    ],
                },
                {
                    key: 'group2',
                    label: 'Group 2',
                    options: [
                        { key: 'item1', label: 'Item 1' },
                        { key: 'item2', label: 'Item 2' },
                        { key: 'item3', label: 'Item 3' },
                        { key: 'item4', label: 'Item 4' },
                    ],
                },
                {
                    key: 'group3',
                    label: 'Group 3',
                    options: [
                        { key: 'item1', label: 'Item 1' },
                        { key: 'item2', label: 'Item 2' },
                    ],
                },
            ],
            default: {
                item: {
                    label: "Item 2",
                    key: "item2",
                },
                group: "group1"
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
        <ObjectSelect v-model="selectedObject" :options="options" :size="20" />
    </div>
</template>
