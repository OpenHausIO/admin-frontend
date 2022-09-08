import { createRouter, createWebHashHistory } from "vue-router";

const routes = [{
    path: "/rooms",
    name: "Rooms",
    icon: "fa-solid fa-door-open",
    component: () => import("../views/admin.rooms.vue")
}, {
    path: "/devices",
    name: "Devices",
    icon: "fa-solid fa-tv",
    component: () => import("../views/admin.devices.vue")
}, {
    path: "/endpoints",
    name: "Endpoints",
    icon: "fa-regular fa-lightbulb",
    component: () => import("../views/admin.endpoints.vue")
}, {
    path: "/plugins",
    name: "Plugins",
    icon: "fa-solid fa-puzzle-piece",
    component: () => import("../views/admin.plugins.vue")
}, {
    path: "/users",
    name: "Users",
    icon: "fa-solid fa-user",
    component: () => import("../views/admin.users.vue")
}, {
    path: "/vault",
    name: "Vault",
    icon: "fa-solid fa-vault",
    component: () => import("../views/admin.vault.vue")
}, {
    path: "/store",
    name: "Store",
    icon: "fa-solid fa-screwdriver-wrench",
    component: () => import("../views/admin.store.vue")
}, {
    path: "/ssdp",
    name: "SSDP",
    icon: "fa-solid fa-arrow-right-arrow-left",
    component: () => import("../views/admin.ssdp.vue")
}];


const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/dashboard",
            name: "Dasboard",
            component: () => import("../views/admin.dashboard.vue")
        },
        {
            path: "/",
            name: "Login",
            component: () => import("../views/login.vue")
        },
        ...routes,
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            redirect: "/dashboard"
        }
    ]
});

// https://router.vuejs.org/guide/advanced/navigation-guards.html
router.beforeEach((to, from) => {
    return true;
});

export default router;

export {
    router,
    routes
};