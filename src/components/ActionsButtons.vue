<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    showEdit: {
      default: false,
      type: Boolean,
    },
    showInfo: {
      default: false,
      type: Boolean,
    },
    showClone: {
      default: false,
      type: Boolean,
    },
    showRemove: {
      default: false,
      type: Boolean,
    },
    item: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      itemData: this.item,
    };
  },
  methods: {
    handleEdit() {
      this.$emit("handleEdit", this.item);
    },
    handleInfo() {
      this.$emit("handleInfo", this.item);
    },
    handleClone() {
      this.$emit("handleClone", this.item);
    },
    handleRemove() {
      this.$emit("handleRemove", this.item);
    },
  },
});
</script>



<template>
  <div class="btn-group" role="group">
    <button
      type="button"
      class="btn btn-outline-primary"
      title="Edit"
      v-if="showEdit"
      v-on:click="handleEdit(item)"
    >
      <i class="fa-solid fa-pen-to-square"></i>
    </button>
    <button
      type="button"
      class="btn btn-outline-info"
      title="Info"
      v-if="showInfo"
      v-on:click="handleInfo(item)"
    >
      <i class="fa-solid fa-circle-info"></i>
    </button>
    <button
      type="button"
      class="btn btn-outline-secondary"
      title="Clone"
      v-if="showClone"
      v-on:click="handleClone(item)"
    >
      <i class="fa-regular fa-clone"></i>
    </button>

    <slot name="custom"></slot>

    <button
      type="button"
      class="btn btn-outline-danger"
      title="Delete"
      v-if="showRemove"
      v-on:click="handleRemove(item)"
    >
      <i class="fa-solid fa-trash-can"></i>
    </button>
  </div>
</template>

<style scope>
.nav-link.active {
  color: red !important;
}

/*.btn-group button.btn:not(:first-child):not(:last-child)*/
.btn-group button.btn:not(:first-child) {
  border-left-color: #000 !important;
  /*border-right-color: #000 !important;*/
}
</style>