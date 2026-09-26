<template>
    <Modal title="Makros" :xl="true" :visible="true" @close="this.$emit('close')" @confirm="saveMakros">
        <template #body>
            <div class="row">

                <!-- LEFT -->
                <div class="col">
                    <ObjectSelect class="bg-dark border-primary h-100" :options="displayMakros"
                        @selected="targetSelectionChanged" />
                </div>

                <!-- MIDDLE -->
                <div class="col-2 m-auto">
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="addMakro">
                        <i class="fa-solid fa-plus d-block"></i>
                        Add
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="removeMakro">
                        <i class="fa-solid fa-minus d-block"></i>
                        Remove
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="moveUp">
                        <i class="fa-solid fa-arrow-up d-block"></i>
                        Move Up
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="moveDown">
                        <i class="fa-solid fa-arrow-down d-block"></i>
                        Move Down
                    </button>

                    <!-- Parameter Editor -->
                    <div v-if="selectedMakro">
                        <div v-if="selectedMakro.type === 'timer'">
                            Delay in ms:
                            <input type="number" min="0" v-model.number="selectedMakro.value"
                                class="form-control bg-dark text-white" />
                        </div>
                    </div>
                </div>

                <!-- RIGHT -->
                <div class="col">
                    <select class="form-select mb-2 bg-transparent text-white border-primary" size="1"
                        v-model="typeSelection">
                        <option value="command">command</option>
                        <option value="timer">timer</option>
                        <option value="scene">scene</option>
                    </select>

                    <ObjectSelect class="bg-dark border-primary" :options="sourceOptions" :size="18"
                        @selected="sourceSelectionChanged" />
                </div>

            </div>
        </template>
    </Modal>
</template>

<script>
import { defineComponent } from 'vue';
import Modal from './Modal.vue';
import ObjectSelect from "./ObjectSelect.vue";
import { itemStore } from "../store.js";

const items = itemStore();

export default defineComponent({
    emits: ["save", "close"],
    components: { Modal, ObjectSelect },
    props: {
        scene: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            makros: [], // Raw makro data: [{type, enabled, ...}, ...]
            selectedIndex: null, // Currently selected makro index
            sourceSelection: null,
            typeSelection: "command"
        };
    },
    computed: {
        // Currently selected makro object (direct reference)
        selectedMakro() {
            return this.selectedIndex !== null ? this.makros[this.selectedIndex] : null;
        },

        // Transform makros array into ObjectSelect format
        displayMakros() {
            if (this.makros.length === 0) return [];

            const groups = [];
            let currentGroup = null;

            this.makros.forEach((makro, index) => {
                const display = this.makroToDisplay(makro);
                const groupKey = this.getGroupKey(makro);

                // Check if we should start a new group
                if (!currentGroup || currentGroup.groupKey !== groupKey) {
                    currentGroup = {
                        key: `group-${index}`,
                        label: display.groupLabel,
                        groupKey: groupKey,
                        options: []
                    };
                    groups.push(currentGroup);
                }

                // Add option to current group
                currentGroup.options.push({
                    key: `option-${index}`,
                    label: display.optionLabel,
                    data: { index }
                });
            });

            return groups;
        },

        // Source options based on type selection
        sourceOptions() {
            if (this.typeSelection === "command") {
                return items.endpoints.map(endpoint => ({
                    key: endpoint._id,
                    label: endpoint.name,
                    options: endpoint.commands.map(command => ({
                        key: command._id,
                        label: command.name,
                        data: {
                            type: "command",
                            endpoint: endpoint._id,
                            command: command._id
                        }
                    }))
                }));
            }

            if (this.typeSelection === "timer") {
                return [{
                    key: "timer",
                    label: "Timer",
                    options: [{
                        key: "timer-option",
                        label: "Delay",
                        data: {
                            type: "timer",
                            value: 1000
                        }
                    }]
                }];
            }

            if (this.typeSelection === "scene") {
                return [{
                    key: "scenes",
                    label: "Scenes",
                    options: items.scenes.map(scene => ({
                        key: scene._id,
                        label: scene.name,
                        data: {
                            type: "scene",
                            scene: scene._id
                        }
                    }))
                }];
            }

            return [];
        }
    },
    methods: {
        getGroupKey(makro) {
            if (makro.type === "command") {
                return `command-${makro.endpoint}`;
            }
            if (makro.type === "timer") {
                return "timer";
            }
            if (makro.type === "scene") {
                return "scene";
            }
            return "unknown";
        },

        // Convert makro to display format
        makroToDisplay(makro) {
            if (makro.type === "command") {
                const endpoint = this.getEndpointById(makro.endpoint);
                const command = this.getCommandById(makro.command);

                if (!endpoint || !command) {
                    return { groupLabel: "Undefined", optionLabel: "Undefined" };
                }

                return {
                    groupLabel: endpoint.name,
                    optionLabel: command.name
                };
            }

            if (makro.type === "timer") {
                return {
                    groupLabel: "Timer",
                    optionLabel: `Delay: ${makro.value || 1000}ms`
                };
            }

            if (makro.type === "scene") {
                const scene = items.scenes.find(s => s._id === makro.scene);
                return {
                    groupLabel: "Scene",
                    optionLabel: scene ? scene.name : "Undefined"
                };
            }

            return { groupLabel: "Unknown", optionLabel: "Unknown" };
        },

        addMakro() {
            if (!this.sourceSelection?.item?.data) return;

            const makroData = {
                enabled: true,
                ...this.sourceSelection.item.data
            };

            this.makros.push(makroData);
            this.selectedIndex = this.makros.length - 1;
        },

        removeMakro() {
            if (this.selectedIndex === null) return;

            this.makros.splice(this.selectedIndex, 1);
            this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : null;
        },

        moveUp() {
            if (this.selectedIndex === null || this.selectedIndex <= 0) return;

            const temp = this.makros[this.selectedIndex];
            this.makros[this.selectedIndex] = this.makros[this.selectedIndex - 1];
            this.makros[this.selectedIndex - 1] = temp;
            this.selectedIndex--;
        },

        moveDown() {
            if (this.selectedIndex === null || this.selectedIndex >= this.makros.length - 1) return;

            const temp = this.makros[this.selectedIndex];
            this.makros[this.selectedIndex] = this.makros[this.selectedIndex + 1];
            this.makros[this.selectedIndex + 1] = temp;
            this.selectedIndex++;
        },

        sourceSelectionChanged(val) {
            this.sourceSelection = val;
        },

        targetSelectionChanged(val) {
            if (val?.item?.data?.index !== undefined) {
                this.selectedIndex = val.item.data.index;
            }
        },

        saveMakros() {
            // Clean up makros before saving (remove any undefined values)
            const cleanedMakros = this.makros.filter(makro => {
                if (makro.type === "command") {
                    return makro.endpoint && makro.command;
                }
                if (makro.type === "timer") {
                    return makro.value !== undefined;
                }
                if (makro.type === "scene") {
                    return makro.scene;
                }
                return false;
            });

            this.$emit('save', cleanedMakros);
        },

        getEndpointById(id) {
            return items.endpoints.find(e => e._id === id);
        },

        getCommandById(id) {
            return items.endpoints
                .flatMap(e => e.commands)
                .find(c => c._id === id);
        }
    },

    mounted() {
        // Load existing makros
        this.makros = this.scene.makros.map(makro => ({
            enabled: makro.enabled ?? true,
            type: makro.type,
            ...(makro.type === "command" && {
                endpoint: makro.endpoint,
                command: makro.command
            }),
            ...(makro.type === "timer" && {
                value: makro.value || 1000
            }),
            ...(makro.type === "scene" && {
                scene: makro.scene
            })
        }));
    }
});
</script>