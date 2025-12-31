<script>
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        src: {
            type: String,
            required: true,
            default: "http://example.com"
        }
    },
    methods: {
        openInNewWindow() {
            //window.open("/api/plugins/68aafde263362b527fcbdc8e/proxy/", "_blank");
            // "width=800,height=600,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
            window.open(this.src, "iframeWindow", "menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes");
        }
    }
});

</script>

<template>
    <div class="w-100 h-100">
        <iframe :src="src" class="w-100 vh-100"></iframe>
    </div>
</template>