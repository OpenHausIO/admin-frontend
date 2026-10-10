<template>
    <Modal title="Remote Layout Editor" :xl="true" :visible="true" @close="this.$emit('close')"
        @confirm="this.$emit('save')">
        <template #body>

            <div class="row">
                <div class="col">
                    <Tabs>
                        <template v-slot:tabs>
                            <li class="nav-item" v-for="(page, index) in item.pages" :key="index">
                                <a class="nav-link bg-dark px-1 py-1" @click.prevent="pageIndex = index">

                                    <div class="input-group input-group-sm">
                                        <input type="text" class="form-control bg-transparent text-white px-1"
                                            v-model="page.title" placeholder="Page title"
                                            style="border: 0; border-bottom: 1px solid #000; width: 100px">
                                        <button class="btn btn-outline-danger" @click.stop="deletePage(index)">
                                            ×
                                        </button>
                                    </div>

                                </a>
                            </li>
                            <li>
                                <a class="nav-link bg-dark px-1 py-1" @click.prevent="addNewPage()">
                                    <button class="btn btn-success py-1">
                                        +
                                    </button>
                                </a>
                            </li>
                        </template>
                    </Tabs>
                </div>
            </div>

            <div class="row" style="height: 50vh" v-if="page">

                <!-- LEFT -->
                <div class="col" @drop="handleDrop" @dragover.prevent>

                    <GridDraggable :cols="page.size.w" :rows="page.size.h" :items="dragableItems" :unlocked="unlocked"
                        @update:position="handlePositionUpdate" @update:size="handleSizeUpdate">
                        <template #item="{ data, index }">
                            <div class="hover-active text-center">

                                <div v-if="unlocked" class="delete-handle" @click="deleteGridItem(index)">
                                    ×
                                </div>

                                <div v-if="data.type === 'command'">

                                    Command:<br />
                                    <b>{{ getItemByAlias(item.commands, data.alias).name }}</b>
                                    <br>
                                    ({{ data.alias }})


                                </div>
                                <div v-else-if="data.type === 'state'">

                                    State:<br />
                                    <b>{{ getItemByAlias(item.states, data.alias).name }}</b>
                                    <br>
                                    ({{ data.alias }})

                                </div>
                                <div v-else-if="data.type === 'empty'">
                                    <i>EMPTY</i>
                                </div>
                                <div v-else>
                                    Unknown
                                </div>

                            </div>
                        </template>
                    </GridDraggable>

                    <!--
                    Height/Rows: <input type="number" v-model="page.size.h">
                    Width/Cols: <input type="number" v-model="page.size.w">
                    Locked/Preview: <input type="checkbox" v-model="unlocked">
                    -->

                </div>
                <!-- LEFT -->

                <!-- RIGHT -->
                <div class="col-2">

                    <!-- SELECTION SOURCE-->
                    <select class="form-select form-select-sm bg-transparent text-white" v-model="pageType">
                        <option v-for="(type, index) in ['command', 'state', 'empty']" :key="index"
                            :selected="type === pageType">
                            {{ type }}
                        </option>
                    </select>

                    <select class="form-select form-select-sm bg-transparent text-white mt-1" size="17">
                        <option v-if="pageTypeOptions?.length === 0 || !pageTypeOptions" :disabled>
                            <i>No Options for "{{ pageType }}"</i>
                        </option>
                        <option v-for="(option, index) in pageTypeOptions" :key="index" draggable="true"
                            @dragstart="handleDragStart($event, option)">
                            {{ option.name }}
                        </option>
                    </select>

                    <!--
                    <div class="row g-1 mt-2">
                        <div class="col-6">
                            <label class="form-label small mb-0">Cols</label>
                            <input type="number" class="form-control form-control-sm bg-transparent text-white"
                                v-model="page.size.w">
                        </div>
                        <div class="col-6">
                            <label class="form-label small mb-0">Rows</label>
                            <input type="number" class="form-control form-control-sm bg-transparent text-white"
                                v-model="page.size.h">
                        </div>
                    </div>
                    -->

                    <!--
                    <div class="form-floating mt-2">
                        <input type="number" class="form-control form-control-sm bg-transparent text-white" id="cols"
                            v-model="page.size.w" placeholder="Cols">
                        <label for="cols">Cols</label>
                    </div>

                    <div class="form-floating mt-1">
                        <input type="number" class="form-control form-control-sm bg-transparent text-white" id="rows"
                            v-model="page.size.h" placeholder="Rows">
                        <label for="rows">Rows</label>
                    </div>
                -->


                    <div class="input-group input-group-sm mt-2">
                        <span class="input-group-text bg-dark text-white border-secondary label-fixed-width">Cols</span>
                        <input type="number" class="form-control bg-transparent text-white border-secondary" min="1"
                            v-model="page.size.w">
                    </div>

                    <div class="input-group input-group-sm mt-1">
                        <span class="input-group-text bg-dark text-white border-secondary label-fixed-width">Rows</span>
                        <input type="number" class="form-control bg-transparent text-white border-secondary" min="1"
                            v-model="page.size.h">
                    </div>

                    <!-- SELECTION SOURCE-->

                </div>
                <!-- RIGHT -->

            </div>

        </template>
    </Modal>
</template>

<script>
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import ObjectSelect from "./ObjectSelect.vue";
import GridDraggable from "./GridDraggable.vue";
import Tabs from "./Tabs.vue";

export default defineComponent({
    name: "RemoteLayoutEditor",
    components: {
        Modal,
        ObjectSelect,
        GridDraggable,
        Tabs
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            pageIndex: 0,
            unlocked: true,
            pageType: "command",
            draggedOption: null
        };
    },
    mounted() {

    },
    methods: {
        handlePositionUpdate({ index, position }) {

            if (!this.page.items[index].position) {
                this.page.items[index].position = {};
            }

            this.page.items[index].position.x = position.x;
            this.page.items[index].position.y = position.y;

        },
        handleSizeUpdate({ index, size }) {

            if (!this.page.items[index].size) {
                this.page.items[index].size = {};
            }

            this.page.items[index].size.w = size.w;
            this.page.items[index].size.h = size.h;

        },
        handleDragStart(event, option) {

            console.log("Drag start:", option);
            this.draggedOption = option;
            event.dataTransfer.effectAllowed = 'copy';
            event.dataTransfer.setData('text/plain', JSON.stringify(option));

        },
        handleDrop(event) {

            console.log("Handle drop")

            event.preventDefault();

            if (!this.draggedOption) return;

            let option = this.draggedOption;

            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const cellWidth = rect.width / this.page.size.w;
            const cellHeight = rect.height / this.page.size.h;

            const gridX = Math.floor(x / cellWidth) + 1;
            const gridY = Math.floor(y / cellHeight) + 1;

            this.page.items.push({
                type: option.type,
                alias: option.value,
                position: {
                    x: gridX,
                    y: gridY
                },
                size: {
                    h: 1,
                    w: 1
                }
            });


            /*
            this.page.items.push({
                type: option.type,
                alias: option.value,
                position: {
                    x: 1,
                    y: 1
                },
                size: {
                    h: 1,
                    w: 1
                }
            });
            */

            this.draggedOption = null;

        },
        deleteGridItem(index) {
            this.page.items.splice(index, 1);
        },
        addNewPage() {

            this.item.pages.push({
                title: `Page #${this.item.pages.length + 1}`,
                size: {
                    h: 5,
                    w: 3
                },
                items: []
            });

            console.log("Pages", this.item.pages, this.item.pages.length)

            this.pageIndex = Math.max(this.item.pages.length - 1, 0);

        },
        deletePage(index) {

            if (this.item.pages.length > 0) {
                this.pageIndex = index - 1;
            } else {
                this.pageIndex = null;
                this.item.pages = [];
            }

            this.item.pages.splice(index, 1);

        },
        getItemByAlias(arr, alias) {
            return arr.find((item) => {
                return item.alias === alias;
            });
        }
    },
    computed: {
        dragableItems() {

            return this.page.items.map((item) => {

                return {
                    size: Object.assign({
                        h: 1,
                        w: 1
                    }, item.size),
                    position: Object.assign({
                        x: 1,
                        y: 1
                    }, item.position),
                    data: item
                }

            });

        },
        page() {
            return this.item.pages[this.pageIndex];
        },
        pageTypeOptions() {
            if (this.pageType === "command") {

                return this.item.commands.map((cmd) => {
                    return {
                        name: cmd.name,
                        value: cmd.alias,
                        type: "command"
                    }
                });

            } else if (this.pageType === "states") {

                return this.item.states.map((state) => {
                    return {
                        name: state.name,
                        value: state.alias,
                        type: "states"
                    }
                });

            } else if (this.pageType === "empty") {

                return [{
                    name: "Empty",
                    value: "empty",
                    type: "empty"
                }]

            }
        }
    }
});
</script>

<style>
.hover-active {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    touch-action: none;
    position: relative;
    border: 1px solid #000;
    background-color: rgba(0, 0, 0, 0.7) !important
}

.hover-active:hover {
    /*background: rgba(255, 255, 255, 0.5);*/
    background: repeating-linear-gradient(135deg,
            rgba(255, 255, 255, 0.3),
            rgba(255, 255, 255, 0.3) 10px,
            rgba(200, 200, 200, 0.3) 10px,
            rgba(200, 200, 200, 0.3) 20px);
}

.dashed-border {
    border: 1px solid #000 !important;
}

.delete-handle {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: linear-gradient(-45deg, transparent 50%, rgba(255, 0, 0, 0.3) 50%);
    cursor: pointer;
    z-index: 100;
}

.label-fixed-width {
    width: 60px;
    min-width: 60px;
}
</style>