<template>
    <div class="progress border-0" role="progressbar" style="z-index: 9999;" :class="{ 'fade-out': fadingOut }"
        @animationend="handleAnimationEnd" v-if="show">
        <div class="progress-bar" :style="'width: ' + precent + '%'" :class="barClass">
        </div>
    </div>
</template>

<script>
import { defineComponent, reactive } from "vue";

const data = reactive({
    precent: 0,
    show: false,
    fadingOut: false,
    color: "primary",
    animation: true,
    fadeout: true
});

const setPrecent = (int) => {

    if (data.precent >= 100) {

        if (data.animation) {
            data.color = "success";
        }

        setTimeout(() => {
            data.fadingOut = data.fadeout;
        }, data.animation ? 400 : 0);

    }

    data.show = true;
    data.precent = int;

};

const show = () => {
    data.show = true;
};

const hide = () => {
    data.show = true;
};

const fadeOut = () => {
    data.fadingOut = false;
    setTimeout(() => {
        data.fadingOut = true;
    });
};

export default defineComponent({
    name: "Progressbar",
    data() {
        return data;
    },
    methods: {
        handleAnimationEnd() {
            this.show = false;
            this.precent = 0;
            this.fadingOut = false;
        }
    },
    computed: {
        barClass() {
            return [`bg-${this.color}`, `shadow-${this.color}`];
        }
    }
});

export {
    setPrecent,
    show,
    hide,
    fadeOut,
    data
};
</script>

<style scoped>
.progress {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    border-radius: 0;
    height: 2px;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 999999;
    pointer-events: none;
}

.progress-bar {
    box-shadow: 0px 0px 5px 0px var(--bs-blue);
    transition: width 0.2s linear, background-color 0.4s ease, box-shadow 0.4s ease;
}

.fade-out {
    animation: slideUpFade 0.30s forwards;
}

.shadow-primary {
    box-shadow: 0 0 5px var(--bs-primary);
}

.shadow-success {
    box-shadow: 0 0 5px var(--bs-success);
}

.shadow-danger {
    box-shadow: 0 0 5px var(--bs-danger);
}

.shadow-warning {
    box-shadow: 0 0 5px var(--bs-warning);
}

.shadow-info {
    box-shadow: 0 0 5px var(--bs-info);
}

@keyframes slideUpFade {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>
