<template>
    <select class="form-select" :size="size" v-model="internalValue" @change="updateValue">
        <optgroup v-for="(group, i) in options" :key="group.key" :label="group.label">
            <option v-for="(item, index) in group.options" :key="item.key"
                :value="serializeValue({ item, group, indexes: { optgroup: i, option: index } })">
                {{ item.label }}
            </option>
        </optgroup>
    </select>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: "ObjectSelect",
    props: {
        modelValue: {
            type: Object,
            default: null,
        },
        options: {
            type: Array,
            required: true,
        },
        size: {
            type: Number,
            default: 5,
        },
    },
    data() {
        return {
            internalValue: this.modelValue ? this.serializeValue(this.modelValue) : null,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(newValue) {
                this.internalValue = newValue ? this.serializeValue(newValue) : null;
            },
        },
    },
    methods: {
        serializeValue(value) {
            return JSON.stringify(this.sortObjectKeys(value));
        },
        deserializeValue(value) {
            return JSON.parse(value);
        },
        sortObjectKeys(obj) {
            if (Array.isArray(obj)) {
                return obj.map((item) => this.sortObjectKeys(item));
            } else if (typeof obj === 'object' && obj !== null) {
                return Object.keys(obj).sort().reduce((sorted, key) => {
                    sorted[key] = this.sortObjectKeys(obj[key]);
                    return sorted;
                }, {});
            }
            return obj;
        },
        updateValue() {
            const parsedValue = this.deserializeValue(this.internalValue);
            this.$emit('update:modelValue', parsedValue);
        },
    },
});
</script>