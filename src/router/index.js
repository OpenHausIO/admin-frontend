import { createRouter, createWebHashHistory } from "vue-router";
import { request } from "../helper.js";

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
            path: "/logs",
            name: "Logfiles",
            component: () => import("../views/admin.logfiles.vue")
        },
        {
            path: "/environment",
            name: "Environment",
            component: () => import("../views/admin.environment.vue")
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

router.beforeEach((to, from, next) => {
    if (window.localStorage.getItem("x-auth-token")) {

        console.log("Token found, check if still valid");

        // check if token is still valid
        // if not, remove token
        request("/api/rooms", {
            "x-auth-token": window.localStorage.getItem("x-auth-token")
        }, (err) => {
            if (err) {

                console.log("Token invalid, remove it", err);

                // remove token beacuse its invalid
                window.localStorage.removeItem("x-auth-token");

                // token is invalied
                // redirect to login page
                next({
                    name: "Login"
                });


            } else {

                console.log("Token valid, continue");

                // token is still valid
                if (from.path === "/") {
                    next({
                        path: "/dashboard"
                    });
                } else {
                    next();
                }


            }
        });

    } else {

        console.log("Token not found, check if requests are protected");

        // no token found
        // check if requests are stil valid without token
        request("/api/about", (err) => {
            if (err) {

                console.log("Token required!");

                // token is invalied
                // redirect to login page
                next({
                    name: "Login"
                });


            } else {

                console.log("Request still valid, continue", to, from);

                // token is still valid
                if (to.path === "/") {
                    next({
                        path: "/dashboard"
                    });
                } else {
                    next();
                }

            }
        });

    }
});

export default router;

export {
    router,
    routes
};