<template>
    <div class="object-select">
        <select class="form-select" :size="size" v-model="internalValue" @change="updateValue">
            <optgroup v-for="group in options" :key="group.key" :label="group.label">
                <option v-for="(item, index) in group.options" :key="item.key"
                    :value="JSON.stringify({ item, group: group.key })">
                    {{ item.label }}
                </option>
            </optgroup>
        </select>
    </div>
</template>

<script>
export default {
    name: 'ObjectSelect',
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
            immediate: true, // Direkt initialisieren
            handler(newValue) {
                this.internalValue = newValue ? this.serializeValue(newValue) : null;
            },
        },
    },
    methods: {
        serializeValue(value) {
            return JSON.stringify(value);
        },
        deserializeValue(value) {
            return JSON.parse(value);
        },
        updateValue() {
            const parsedValue = this.deserializeValue(this.internalValue);
            this.$emit('update:modelValue', parsedValue);
        },
    },
};
</script>

<style scoped>
.object-select {
    width: 100%;
}

.form-select {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>
