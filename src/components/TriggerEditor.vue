<template>
    <Modal title="Trigger" :xl="true" :visible="true" @close="this.$emit('close')" @confirm="saveTriggers">
        <template #body>
            <div class="row">

                <!-- LEFT -->
                <div class="col">
                    <ObjectSelect class="bg-dark border-primary h-100" :options="displayTriggers"
                        @selected="targetSelectionChanged" />
                </div>

                <!-- MIDDLE -->
                <div class="col-2 m-auto">
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="addTrigger">
                        <i class="fa-solid fa-plus d-block"></i>
                        Add
                    </button>
                    <button class="btn btn-outline-light d-block w-100 my-3" @click="removeTrigger">
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
                    <div v-if="selectedTrigger">
                        <div v-if="selectedTrigger.type === 'cronjob'">
                            <label class="text-white">Cron Expression:</label>
                            <input type="text" v-model="selectedTrigger.params.cron" @input="validateCron"
                                class="form-control bg-dark text-white" :class="{ 'is-invalid': !isCronValid }"
                                placeholder="* * * * *" />
                            <small class="text-muted">
                                <a href="https://crontab.guru/" target="_blank">
                                    Format</a>: minute hour day month weekday

                            </small>
                            <div v-if="!isCronValid" class="invalid-feedback d-block">
                                Invalid cron expression
                            </div>
                        </div>
                        <div v-if="selectedTrigger.type === 'state'">
                            <label class="text-white">Operator:</label>
                            <select v-model="selectedTrigger.params.operator"
                                class="form-select bg-dark text-white mb-2">
                                <option value=">">Greater than (>)</option>
                                <option value="<">Less than (<) </option>
                                <option value=">=">Greater or equal (>=)</option>
                                <option value="<=">Less or equal (<=) </option>
                                <option value="==">Equal (==)</option>
                            </select>
                            <label class="text-white">Threshold:</label>
                            <input type="number" v-model.number="selectedTrigger.params.threshold"
                                class="form-control bg-dark text-white" placeholder="0" />
                        </div>
                    </div>
                </div>

                <!-- RIGHT -->
                <div class="col">
                    <select class="form-select mb-2 bg-transparent text-white border-primary" size="1"
                        v-model="typeSelection">
                        <option value="webhook">webhook</option>
                        <option value="cronjob">cronjob</option>
                        <option value="state">state</option>
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
            triggers: [], // Raw trigger data
            selectedIndex: null,
            sourceSelection: null,
            typeSelection: "webhook",
            isCronValid: true
        };
    },
    computed: {



        selectedTrigger() {
            return this.selectedIndex !== null ? this.triggers[this.selectedIndex] : null;
        },

        displayTriggers() {
            if (this.triggers.length === 0) return [];

            const groups = [];
            let currentGroup = null;

            this.triggers.forEach((trigger, index) => {
                const display = this.triggerToDisplay(trigger);
                const groupKey = this.getGroupKey(trigger);

                if (!currentGroup || currentGroup.groupKey !== groupKey) {
                    currentGroup = {
                        key: `group-${index}`,
                        label: display.groupLabel,
                        groupKey: groupKey,
                        options: []
                    };
                    groups.push(currentGroup);
                }

                currentGroup.options.push({
                    key: `option-${index}`,
                    label: display.optionLabel,
                    data: { index }
                });
            });

            return groups;
        },

        sourceOptions() {
            if (this.typeSelection === "cronjob") {
                return [{
                    key: "cronjob",
                    label: "Cronjob",
                    options: [{
                        key: "cronjob-option",
                        label: "New Cronjob",
                        data: {
                            type: "cronjob",
                            params: {
                                cron: "* * * * *"
                            }
                        }
                    }]
                }];
            }

            if (this.typeSelection === "webhook") {
                return [{
                    key: "webhooks",
                    label: "Webhooks",
                    options: items.webhooks.map(webhook => ({
                        key: webhook._id,
                        label: webhook.name,
                        data: {
                            type: "webhook",
                            params: {
                                _id: webhook._id
                            }
                        }
                    }))
                }];
            }

            if (this.typeSelection === "state") {
                return items.endpoints.map(endpoint => ({
                    key: endpoint._id,
                    label: endpoint.name,
                    options: endpoint.states.map(state => ({
                        key: state._id,
                        label: state.name,
                        data: {
                            type: "state",
                            params: {
                                _id: state._id,
                                threshold: 0,
                                operator: ">"
                            }
                        }
                    }))
                }));
            }

            return [];
        }
    },
    methods: {

        validateCron() {
            if (!this.selectedTrigger || this.selectedTrigger.type !== 'cronjob') {
                this.isCronValid = true;
                return;
            }

            const cronPattern = /^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$/;
            this.isCronValid = cronPattern.test(this.selectedTrigger.params.cron);
        },

        getGroupKey(trigger) {
            if (trigger.type === "cronjob") {
                return "cronjob";
            }
            if (trigger.type === "webhook") {
                return "webhook";
            }
            if (trigger.type === "state") {
                // Group by endpoint
                const state = this.getStateById(trigger.params._id);
                return state ? `state-${state.endpointId}` : "state-unknown";
            }
            return "unknown";
        },

        triggerToDisplay(trigger) {
            if (trigger.type === "cronjob") {
                return {
                    groupLabel: "Cronjob",
                    optionLabel: trigger.params.cron || "* * * * *"
                };
            }

            if (trigger.type === "webhook") {
                const webhook = items.webhooks.find(w => w._id === trigger.params._id);
                return {
                    groupLabel: "Webhook",
                    optionLabel: webhook ? webhook.name : "Undefined"
                };
            }

            if (trigger.type === "state") {
                const state = this.getStateById(trigger.params._id);
                if (!state) {
                    return { groupLabel: "Undefined", optionLabel: "Undefined" };
                }

                const endpoint = this.getEndpointById(state.endpointId);
                const operator = trigger.params.operator || ">";
                const threshold = trigger.params.threshold ?? 0;

                return {
                    groupLabel: endpoint ? endpoint.name : "Undefined",
                    optionLabel: `${state.name} ${operator} ${threshold}`
                };
            }

            return { groupLabel: "Unknown", optionLabel: "Unknown" };
        },

        addTrigger() {
            if (!this.sourceSelection?.item?.data) return;

            const triggerData = {
                enabled: true,
                ...this.sourceSelection.item.data
            };

            this.triggers.push(triggerData);
            this.selectedIndex = this.triggers.length - 1;
        },

        removeTrigger() {
            if (this.selectedIndex === null) return;

            this.triggers.splice(this.selectedIndex, 1);
            this.selectedIndex = this.selectedIndex > 0 ? this.selectedIndex - 1 : null;
        },

        moveUp() {
            if (this.selectedIndex === null || this.selectedIndex <= 0) return;

            const temp = this.triggers[this.selectedIndex];
            this.triggers[this.selectedIndex] = this.triggers[this.selectedIndex - 1];
            this.triggers[this.selectedIndex - 1] = temp;
            this.selectedIndex--;
        },

        moveDown() {
            if (this.selectedIndex === null || this.selectedIndex >= this.triggers.length - 1) return;

            const temp = this.triggers[this.selectedIndex];
            this.triggers[this.selectedIndex] = this.triggers[this.selectedIndex + 1];
            this.triggers[this.selectedIndex + 1] = temp;
            this.selectedIndex++;
        },

        sourceSelectionChanged(val) {
            this.sourceSelection = val;
        },

        targetSelectionChanged(val) {
            if (val?.item?.data?.index !== undefined) {
                this.selectedIndex = val.item.data.index;
                this.validateCron();
            }
        },

        saveTriggers() {
            const cleanedTriggers = this.triggers.filter(trigger => {
                if (trigger.type === "cronjob") {
                    return trigger.params?.cron;
                }
                if (trigger.type === "webhook") {
                    return trigger.params?._id;
                }
                if (trigger.type === "state") {
                    return trigger.params?._id &&
                        trigger.params?.operator &&
                        trigger.params?.threshold !== undefined;
                }
                return false;
            });

            this.$emit('save', cleanedTriggers);
        },

        getEndpointById(id) {
            return items.endpoints.find(e => e._id === id);
        },

        getStateById(id) {
            for (const endpoint of items.endpoints) {
                const state = endpoint.states?.find(s => s._id === id);
                if (state) {
                    return { ...state, endpointId: endpoint._id };
                }
            }
            return null;
        }
    },

    mounted() {
        // Load existing triggers
        this.triggers = (this.scene.triggers || []).map(trigger => ({
            enabled: trigger.enabled ?? true,
            type: trigger.type,
            params: { ...trigger.params }
        }));
    }
});
</script>