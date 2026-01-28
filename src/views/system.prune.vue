<script>
import { defineComponent } from "vue";
import Modal from "@/components/Modal.vue";
import { request } from "../helper.js";
import { addNotification } from "../components/Notifications.vue";

export default defineComponent({
    components: {
        Modal
    },
    data() {
        return {
            modal: {
                show: false
            },
            includes: [],
            enablePruneButton: false
        };
    },
    methods: {
        openSSEprogress() {

            data.color = "primary";

            let token = localStorage.getItem("x-auth-token");
            const eventSource = new EventSource(`/api/system/prune/progress?x-auth-token=${token}`);

            eventSource.onmessage = (event) => {

                const { precent = 0 } = JSON.parse(event.data);
                setPrecent(Math.floor(precent));

            };

            eventSource.onerror = (error) => {
                fadeOut();
                eventSource.close();
            };

        },
        onPrune() {

            addNotification("System pruning started.<br />This may take a while");

            let targets = this.includes.map((target) => {
                return `includes[]=${target}`;
            }).join("&");

            request(`/api/system/prune?${targets}`, {
                method: "DELETE"
            }, (err, result) => {

                if (result.success) {

                    addNotification("System pruned!<br />Restart to apply changes", {
                        type: "success",
                        dismiss: false
                    });

                } else {

                    addNotification(`Could not prune system<br />${err || result.error}`, {
                        type: "danger",
                        dismiss: false
                    });

                }

                this.modal.show = false;

            });

        }
    }
});
</script>


<template>
    <div>

        <Modal v-if="!!modal.show" :visible="modal.show" title="Are you really sure?!">
            <template #body>

                This operation will prune/wipe the installation!<br />
                Are you really sure you want to <u><b>permanent</b></u> delete:

                <ul class="my-3">
                    <li v-for="target in includes">
                        {{ target }}
                    </li>
                </ul>

                <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                &nbsp;
                <u>This cannot be cancelled or undone!</u>
                &nbsp;
                <i class="fa-solid fa-triangle-exclamation text-danger"></i>

                <div class="form-check form-switch mt-3">
                    <label>
                        <input class="form-check-input" type="checkbox" v-model="enablePruneButton" />
                        I understand, and know what im doing.
                    </label>
                </div>

            </template>
            <template #footer>

                <button type="button" class="btn btn-outline-secondary" @click="modal.show = false">Close</button>
                <button type="button" class="btn btn-outline-danger" @click="onPrune"
                    :disabled="!enablePruneButton">Prune</button>

            </template>
        </Modal>

        <div class="form-check form-switch">
            <label>
                Logfiles
                <input class="form-check-input" type="checkbox" v-model="includes" value="logfiles" />
            </label>
        </div>

        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-model="includes" value="plugins" />
                Plugins
            </label>
        </div>

        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-model="includes" value="database" />
                Database
            </label>
        </div>

        <div class="form-check form-switch">
            <label>
                <input class="form-check-input" type="checkbox" v-model="includes" value=".env" />
                Environment file (.env)
            </label>
        </div>

        <button class="btn btn-outline-danger" @click="modal.show = true">Prune</button>

    </div>
</template>
