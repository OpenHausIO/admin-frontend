<script setup>
defineProps({
    src: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="conatiner">
        <div class="row">
            <div class="col-12 p-0">
                <Iframe class="vh-100 w-100" :src="src" />
            </div>
        </div>
    </div>
</template>