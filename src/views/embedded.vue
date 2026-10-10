<script>
import { defineComponent } from "vue";
import Iframe from "../components/Iframe.vue";

export default defineComponent({
    components: {
        Iframe
    },
    props: {
        src: {
            type: String,
            required: true
        }
    }
});
</script>

<template>
    <div class="conatiner h-100">
        <div class="row h-100">
            <div class="col-12 pe-2">
                <Iframe class="h-100 w-100" :src="src" style="min-height: calc(100vh - (56px + 40px))" />
            </div>
        </div>
    </div>
</template>