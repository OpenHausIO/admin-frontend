<script>
export default {
    name: "LabelsInput",
    props: {
        data: {
            type: Array,
            required: true,
        },
        edit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            local: [...this.data],
            invalid: false, // für den roten Rahmen
            pattern: /^.+?=.+|.+=.+$/i,
        };
    },
    watch: {
        data(newVal) {
            this.local = [...newVal];
        },
        edit(newVal) {
            if (!newVal) {

                this.invalid = false;

            } else {

                this.invalid = !this.local.every((value) => {
                    return this.pattern.test(value);
                });

            }
        }
    },
    methods: {
        handleInput({ target }) {

            const value = target.value;

            if (value.endsWith(",")) {
                this.addLabel(value.slice(0, -1));
                target.value = "";
            }

        },
        handleKeydown(e) {
            if (e.key === "Enter") {

                e.preventDefault();
                this.addLabel(e.target.value);
                e.target.value = "";

            }
        },
        handleBlur(e) {

            this.addLabel(e.target.value);
            e.target.value = "";

        },
        addLabel(rawValue) {

            const value = rawValue.trim();
            if (!value) return;

            if (!this.pattern.test(value)) {
                this.invalid = true;
            }

            //this.invalid = false;
            this.local.push(value);
            this.$emit("changed", [...this.local]);

        },
        remove(index) {

            this.local.splice(index, 1);

            this.invalid = !this.local.every((value) => {
                return this.pattern.test(value);
            });

            this.$emit("changed", [...this.local]);

        },
        setFocus() {
            this.$refs?.textfield?.focus();
        },
    },
};
</script>

<template>
    <div class="p-0 label-container" @click="setFocus" style="max-width:300px" :class="[
        { 'form-control bg-dark p-1': edit },
        { 'border border-danger': invalid },
    ]" :style="{ height: edit ? '200px' : '50px' }">

        <span v-for="(label, index) in local" :key="index"
            class="badge bg-primary d-inline-flex align-items-center me-1 p-1">
            {{ label }}
            <button v-if="edit" type="button" class="btn-close btn-close-white p-0 ps-1" aria-label="Close"
                @click="remove(index)"></button>
        </span>

        <input v-if="edit" ref="textfield" placeholder="Add labels, separate with a comma" autocomplete="off"
            class="bg-transparent border-0 d-block no-focus py-1 w-100" @input="handleInput" @keydown="handleKeydown"
            @blur="handleBlur" />

    </div>
</template>

<style scoped>
.no-focus:focus {
    outline: none !important;
    box-shadow: none !important;
    border-color: inherit !important;
}

.label-container {
    overflow: scroll;
    resize: vertical;
    /*cursor: text;*/
}
</style>
