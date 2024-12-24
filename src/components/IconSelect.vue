<script>
import { defineComponent } from "vue";
import { request } from "../helper.js";

import Tabs from "./Tabs.vue";
import Modal from "./Modal.vue";
import Card from "./Card.vue";

export default defineComponent({
    components: {
        Tabs,
        Modal,
        Card
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        icon: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showPopup: false,
            newValue: "",
            icons: [],
            tabItems: [
                {
                    name: "FontAwesome",
                    id: "fontawesome",
                },
                {
                    name: "Material Icons",
                    id: "materialicons",
                },
            ],
        };
    },
    mounted() {
        console.log("IconSelect mounted, do http reuqest!");
        request(`${window.location.origin}/icons.json`, (err, data) => {
            if (err) {
                console.error(err);
            } else {
                this.icons = Object.keys(data).filter((key) => {
                    try {
                        return data[key]?.styles?.includes("solid");
                    } catch (err) {
                        return false;
                    }
                });
            }
        });
    },
    computed: {
        iconValue() {
            if (!this.newValue) {
                return this.icon;
            }
            return this.newValue;
        },
    },
    methods: {
        activeIcon(name) {
            if (!this.newValue) {
                return this.icon === "fa-solid fa-" + name;
            } else {
                return this.newValue === "fa-solid fa-" + name;
            }
        },
        setIcon() {
            this.item.icon = this.newValue;
            this.showPopup = false;
            this.newValue = null;
        },
    },
});
</script>



<template>
    <Modal v-if="showPopup" :visible="showPopup" @close="showPopup = false" :classes="{ body: 'p-0' }"
        @confirm="setIcon()" title="Select icon">
        <template v-slot:body>

            <Tabs v-bind:items="tabItems">
                <template v-slot:fontawesome>
                    <div class="row">

                        <div class="col-2 p-0" :class="{ 'bg-primary': activeIcon(entry) }" v-bind:key="index"
                            v-for="(entry, index) in icons" v-on:click="newValue = 'fa-solid fa-' + entry">
                            <Card class="col-2 text-center">
                                <i class="fa-solid fa-3x d-block" :class="'fa-' + entry"></i>
                                {{ "fa-solid fa-" + entry }}
                            </Card>
                        </div>

                    </div>
                </template>
                <template v-slot:materialicons>
                    <div class="row">

                        <div class="col-2 p-0" :class="{ 'bg-primary': activeIcon(entry) }" v-bind:key="index"
                            v-for="(entry, index) in icons" v-on:click="newValue = 'fa-solid fa-' + entry">
                            <Card class="col-2 text-center">
                                <i class="fa-solid fa-3x d-block"></i>
                                {{ index }}
                            </Card>
                        </div>

                    </div>
                </template>
            </Tabs>

        </template>
    </Modal>
    <button type="button" class="btn btn-outline-secondary text-white" v-on:click="showPopup = !showPopup">
        <i :class="iconValue"></i>
    </button>
</template>

<style scope>
.modal {
    display: block !important;
    /* I added this to see the modal, you don't need this */
}

/* Important part */
.modal-dialog {
    overflow-y: initial !important;
}

.modal-body {
    height: 80vh;
    overflow-y: auto;
}

.modal {
    background-color: rgba(0, 0, 0, 0.8) !important;
}
</style>