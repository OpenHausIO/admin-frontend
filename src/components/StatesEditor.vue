<template>
    <Modal title="States" :xl="true" :visible="true" @close="this.$emit('close')" @confirm="saveStates">
        <template #body>

            <table class="table text-white">
                <thead>
                    <tr>
                        <th scope="col" style="width: 10px">#</th>
                        <!--<th scope="col" style="width: 10px">Icon</th>-->
                        <th scope="col">Name</th>
                        <th scope="col">Alias</th>
                        <th scope="col">Type</th>
                        <th scope="col">Value</th>
                        <th scope="col" style="width: 10px">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-bind:key="item._id" v-for="(item, index) in states">
                        <th scope="row">{{ index + 1 }}</th>
                        <!--                        
                        <td>

                            
                            <EditorProperty :enabled="item === editItem" :object="item" prop="icon" type="text">
                                <template v-slot:editor="{ value }">
                                    <IconSelect :item="item" :icon="value" />
                                </template>
<template v-slot:display="{ value }">
                                    <i :class="value"></i>
                                </template>
</EditorProperty>


</td>
-->
                        <td>
                            <EditorProperty :enabled="item._id === editItem" :object="item" prop="name" type="text" />
                        </td>
                        <td>
                            <EditorProperty :enabled="item._id === editItem" :object="item" prop="alias" type="text" />
                        </td>
                        <td>

                            <EditorProperty :enabled="item._id === editItem" :object="item" prop="type" type="text">
                                <template v-slot:editor="{ value }">

                                    Dropdown/select {{ value }}

                                </template>
                                <template v-slot:display="{ value }">
                                    {{ value }}
                                </template>
                            </EditorProperty>

                        </td>
                        <td>

                            {{ item.value ?? "null" }}

                        </td>
                        <td>
                            <ActionsButtons :showEdit="true" :showRemove="false" :showJSON="false" :item="item"
                                @handleEdit="handleEdit" @handleRemove="handleRemove" />
                        </td>
                    </tr>
                </tbody>
            </table>

        </template>
    </Modal>
</template>

<script>
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import ActionsButtons from "./ActionsButtons.vue";
import EditorProperty from "./EditorProperty.vue";
import IconSelect from "./IconSelect.vue";
import { itemStore } from "../store.js";

const items = itemStore();

export default defineComponent({
    name: "StatesEditor",
    emits: ["save", "close"],
    components: {
        Modal,
        ActionsButtons,
        EditorProperty,
        IconSelect
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            editItem: null
        };
    },
    methods: {
        saveStates() {
            this.$emit("save", this.editItem);
            this.editItem = null;
        },
        handleEdit(item) {
            if (this.editItem === item._id) {
                //this.saveStates(item);
                this.editItem = null;
            } else {
                this.editItem = item._id;
            }
        },
        handleRemove(item) {

            let index = this.item.states.indexOf(item);
            this.item.states.splice(index, 1);

        }
    },
    computed: {
        states() {
            return this.item.states;
        }
    }
});
</script>