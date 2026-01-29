import { createRouter, createWebHashHistory } from "vue-router";
import { request } from "../helper.js";
import { settingsStore, userStore } from "../store.js";

const components = [{
    path: "/rooms",
    name: "Rooms",
    icon: "fa-solid fa-door-open",
    component: () => import("../views/components.rooms.vue")
}, {
    path: "/devices",
    name: "Devices",
    icon: "fa-solid fa-tv",
    component: () => import("../views/components.devices.vue")
}, {
    path: "/endpoints",
    name: "Endpoints",
    icon: "fa-regular fa-lightbulb",
    component: () => import("../views/components.endpoints.vue")
}, {
    path: "/plugins",
    name: "Plugins",
    icon: "fa-solid fa-puzzle-piece",
    component: () => import("../views/components.plugins.vue")
}, {
    path: "/users",
    name: "Users",
    icon: "fa-solid fa-user",
    component: () => import("../views/components.users.vue")
}, {
    path: "/vault",
    name: "Vault",
    icon: "fa-solid fa-vault",
    component: () => import("../views/components.vault.vue")
}, {
    path: "/store",
    name: "Store",
    icon: "fa-solid fa-screwdriver-wrench",
    component: () => import("../views/components.store.vue")
}, {
    path: "/ssdp",
    name: "SSDP",
    icon: "fa-solid fa-arrow-right-arrow-left",
    component: () => import("../views/components.ssdp.vue")
}, {
    path: "/mdns",
    name: "MDNS",
    icon: "fa-solid fa-reply-all",
    component: () => import("../views/components.mdns.vue")
}, {
    path: "/mqtt",
    name: "MQTT",
    icon: "fa-solid fa-file-pen",
    component: () => import("../views/components.mqtt.vue")
}, {
    path: "/webhooks",
    name: "Webhooks",
    icon: "fa-solid fa-anchor",
    component: () => import("../views/components.webhooks.vue")
}, {
    path: "/scenes",
    name: "Scenes",
    icon: "fa-solid fa-clone",
    component: () => import("../views/components.scenes.vue")
}];


const system = [/*{
    path: "/search",
    name: "Search",
    icon: "fa-solid fa-magnifying-glass",
    component: () => import("../views/system.search.vue")
},*/ {
        path: "/system/backup",
        name: "Backup",
        icon: "fa-solid fa-file-zipper",
        component: () => import("../views/system.backup.vue")
    }, {
        path: "/system/logfiles",
        name: "Logfiles",
        icon: "fa-solid fa-file",
        component: () => import("../views/system.logfiles.vue")
    }/*, {
    path: "/system/environment",
    name: "Environment Variables",
    icon: "fa-solid fa-circle-info",
    component: () => import("../views/system.environment.vue")
}, {
    path: "/system/versions",
    name: "Software Verions",
    icon: "fa-solid fa-circle-info",
    component: () => import("../views/system.versions.vue")
}/*, {
    path: "/system/general",
    name: "General",
    icon: "",
    component: () => import("../views/system.general.vue")
}*/, {
        path: "/system/prune",
        name: "Prune",
        icon: "fa-solid fa-broom",
        component: () => import("../views/system.prune.vue")
    }/*, {
        path: "/system/connector",
        name: "Connector",
        icon: "fa-solid fa-arrow-right-arrow-left",
        component: () => import("../views/system.connector.vue")
    }*/];


const test = [{
    path: "/test/selection-order",
    name: "SelectionOrder",
    component: () => import("../views/test.selection-order.vue")
}, {
    path: "/test/object-select",
    name: "ObjectSelect",
    component: () => import("../views/test.object-select.vue")
}, {
    path: "/test/data-table",
    name: "DataTable",
    component: () => import("../views/test.data-table.vue")
}, {
    path: "/test/alarm",
    name: "Alarm",
    component: () => import("../views/test.alarm.vue")
}];


const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: "/dashboard",
        name: "Dasboard",
        component: () => import("../views/dashboard.vue")
    }, /*{
            path: "/",
            name: "Login",
            component: () => import("../views/auth.login.vue")
        },*/ {
        path: "/auth/login",
        name: "Login ",
        component: () => import("../views/auth.login.vue")
    },
    ...components,
    ...system,
    {
        path: "/test",
        component: () => import("../views/test.vue")
    },
    ...test,
    {
        path: "/embedded",
        props: (route) => {
            return {
                src: route.query.src
            };
        },
        component: () => import("../views/embedded.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        name: "NotFound",
        redirect: "/dashboard"
    }]
});

router.beforeEach(async (to, from, next) => {

    console.log("Bevore enter", to);

    const user = userStore();
    //const common = commonStore();

    console.log("USer", user)

    const isAuthRoute = to.fullPath.startsWith("/auth");
    const isLoginRoute = to.fullPath === "/auth/login";

    await user.checkAuth();

    if (isLoginRoute && to.query.clean === "true") {
        return next();
    }
    if (isAuthRoute) {
        return next();
    }

    console.log("isAuthenticated", user.isAuthenticated);

    if (user.isAuthenticated) {
        return next();
    }

    next("/auth/login");

});

/*
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
*/

export default router;

export {
    router,
    components,
    system,
    test
};