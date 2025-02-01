<script>
import SelectionOrder from '../components/SelectionOrder.vue';

export default {
    components: {
        SelectionOrder,
    },
    data() {
        return {
            showModal: false,
            showParameterEditor: false,
            sourceOptions: [
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
            targetOptions: [],
        };
    },
    computed: {
        sourceItems() {
            return Array.from({ length: 5 })
                .fill(0)
                .map((e, i) => {
                    return {
                        key: `key-${i}`,
                        label: `Group #${i}`,
                        options: Array.from({ length: 3 })
                            .fill(null)
                            .map((e, i) => {
                                return {
                                    name: `Option #${i}`,
                                    value: `value-${i}`,
                                };
                            }),
                    };
                });
        },
    },
    methods: {
        onSelectedTarget(target) {

            console.log("onselectedtarget", target);

        }
    }
};
</script>

<template>
    <div>

        <SelectionOrder :show="showModal" :key="targetOptions.length" @close="showModal = false"
            :sourceOptions="sourceOptions" :targetOptions="targetOptions" @selected="onSelectedTarget">
            <template #buttons>
                <button class="btn btn-outline-light d-block w-100 my-3"
                    @click="showParameterEditor = !showParameterEditor">
                    <i class="fa-solid fa-pen-to-square d-block"></i>
                    Edit Parmeter
                </button>
            </template>
            <template #footer v-if="showParameterEditor">
                <div class="text-white">
                    PArameter editor
                    {{ targetOptions }}
                </div>
            </template>
        </SelectionOrder>

        <h1>Source Items:</h1>
        {{ sourceOptions }}

        <hr />

        <h1>Target Items:</h1>
        {{ targetOptions }}

        <hr />

        <button class="btn btn-outline-primary" @click="showModal = !showModal">
            Show/Hide Modal
        </button>

        <button class="btn btn-outline-primary" @click="clearTargetItems">
            Clear Target Items
        </button>

        <button class="btn btn-outline-primary" @click="setTargetItems">
            Set Target Items
        </button>
    </div>
</template>
