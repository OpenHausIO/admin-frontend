<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        enabled: {
            default: false,
            type: Boolean,
        },
        object: {
            default: null,
            type: Object,
        },
        prop: {
            default: "foo",
            type: String,
        },
        type: {
            default: null,
            type: String,
        },
        items: {
            default: [],
            type: Array,
        },
        rows: {
            type: Number,
            default: 3,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
});
</script>


<template>
    <div>
        <div v-if="enabled">
            <slot name="editor" v-bind:value="object[prop]">

                <!-- TEXTAREA -->
                <textarea class="form-control bg-dark text-white" v-if="type == 'textarea'" :rows="rows"
                    v-model="object[prop]" :disabled="disabled"></textarea>
                <!-- TEXTAREA -->

                <!-- CHECKBOX LISTING -->
                <ul v-else-if="type === 'checkbox'">
                    <li v-bind:key="index" v-for="(item, index) in items">
                        <div class="form-check form-switch">
                            <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" :value="item.value"
                                    v-model="object[prop]" :disabled="disabled" />
                                {{ item.name }}
                            </label>
                        </div>
                        <!--
            <label v-bind:for="item._id + 'intents-checkbox' + item.prop">
              <input
                type="checkbox"
                v-bind:id="item._id + 'intents-checkbox' + item.prop"
                :checked="item.enabled"
              />
              {{ item.value }}
            </label>-->
                    </li>
                </ul>
                <!-- CHECKBOX LISTING -->

                <!-- DROPDOWN / SELECT -->
                <select class="form-select bg-dark text-white" v-model="object[prop]" v-else-if="type === 'select'"
                    :disabled="disabled">
                    <option :value="item._id" v-bind:key="item._id" v-for="item in items">
                        {{ item.name }}
                    </option>
                </select>
                <!-- DROPDOWN / SELECT -->

                <!-- CHECKBOX / BOOLEAN-->
                <div class="form-check form-switch" v-else-if="type === 'boolean'">
                    <input class="form-check-input" type="checkbox" v-model="object[prop]" :disabled="disabled" />
                </div>
                <!-- CHECKBOX / BOOLEAN-->

                <!-- TEXT/NUMBER/EMAIL/DATE/COLOR/DEFAULT -->
                <input :type="type" v-model="object[prop]" class="form-control bg-dark text-white" :disabled="disabled"
                    v-else />
                <!-- TEXT/NUMBER/EMAIL/DATE/COLOR/DEFAULT -->

            </slot>
        </div>
        <div v-else>
            <slot name="display" v-bind:value="object[prop]">
                {{ object[prop] }}
            </slot>
        </div>
    </div>
</template>

<style scoped>
ul {
    padding-left: 0;
    list-style-type: none;
}
</style>