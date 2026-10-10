<template>
    <div class="progress border-0" role="progressbar" :class="{ 'fade-out': fadingOut }"
        @animationend="handleAnimationEnd" v-if="show" :style="cssVars">
        <div class="progress-bar" :style="'width: ' + precent + '%'" :class="barClass"></div>
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
    fadeout: true,
    cssVars: {
        "--shadow-vertical-length": "1px",
        "--shadow-blur-radius": "5px",
        "z-index": "9999"
    }
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
    overflow: visible;
}

.progress-bar {
    position: relative;
    overflow: hidden;
    transition: width 0.2s linear, background-color 0.4s ease, box-shadow 0.4s ease;
}

.fade-out {
    animation: slideUpFade 0.30s forwards;
}

.shadow-primary {
    box-shadow: 0 var(--shadow-vertical-length) var(--shadow-blur-radius) var(--bs-primary);
}

.shadow-success {
    box-shadow: 0 var(--shadow-vertical-length) var(--shadow-blur-radius) var(--bs-success);
}

.shadow-danger {
    box-shadow: 0 var(--shadow-vertical-length) var(--shadow-blur-radius) var(--bs-danger);
}

.shadow-warning {
    box-shadow: 0 var(--shadow-vertical-length) var(--shadow-blur-radius) var(--bs-warning);
}

.shadow-info {
    box-shadow: 0 var(--shadow-vertical-length) var(--shadow-blur-radius) var(--bs-info);
}

@keyframes slideUpFade {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

.progress-bar.animated:after {
    content: "";
    position: absolute;
    top: 0;
    left: -50%;
    /* Start links außerhalb */
    width: 50%;
    height: 100%;
    background: linear-gradient(120deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%);
    transform: skewX(-20deg);
    animation: shine 1s linear infinite;
}

@keyframes shine {
    0% {
        left: -50%;
    }

    100% {
        left: 100%;
    }
}
</style>
