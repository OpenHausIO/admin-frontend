import { createApp, watch } from "vue";
import App from "./App.vue";
import router from "./router";
import { itemStore } from "./store";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import { request, itemWrapper } from "./helper.js";
import { addNotification } from "./components/Notifications.vue";

// monkey patch ws
window.events = null;
window.forceReactiviy = false;


// create vue app
const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

if (![
    "localhost",
    "127.0.0.1"
].includes(window.location.hostname)) {
    let noop = () => { };
    console = {
        log: noop,
        warn: noop,
        error: noop,
        info: noop,
        debug: noop
    };
}

app.directive("tooltip", (el, binding) => {
    return new Tooltip(el, {
        title: binding.value || "<i>no value</i>",
        placement: binding.arg || "bottom",
        trigger: "hover",
        customClass: "custom-tooltip"
    });
});


pinia.use(({ store, options }) => {
    if (options?.persistent) {

        if (window.localStorage.getItem(store.$id)) {
            Object.assign(store.$state, JSON.parse(window.localStorage.getItem(store.$id)));
        }

        store.$subscribe((mutation, state) => {
            window.localStorage.setItem(store.$id, JSON.stringify(state));
        });

    }
});


Promise.all([

    // for DOM to be ready
    new Promise((resolve, reject) => {
        document.addEventListener("DOMContentLoaded", () => {

            console.log("[pre] DOM Content ready");

            resolve();

        });
    }),

    // websocket connection to <host>/api/events 
    new Promise((resolve, reject) => {

        console.log(window.location.host)

        let controller = new AbortController();
        let id = setTimeout(() => controller.abort(), 3000);

        let url = window.location.protocol === "https:" ? "wss://" : "ws://";
        url += `${window.location.host}/api/events`;

        let events = ["add", "update", "remove"].map((intent) => {
            return `events[]=${intent}`;
        }).join("&");

        /*
        let components = ["rooms", "scenes", "devices", "endpoints"].map((intent) => {
            return `components[]=${intent}`;
        }).join("&");
        */

        let ws = new WebSocket(`${url}?${events}&x-auth-token=${localStorage.getItem("x-auth-token")}`);

        console.log("connect to", ws.url);

        ws.onerror = (err) => {
            console.error(err);
            reject(err);
        };

        ws.onclose = () => {
            console.warn(`WebSocket connection ${ws.url} closed`);
        };

        ws.onopen = () => {
            console.log(`WebSocket connection ${ws.url} open`);
            clearTimeout(id);
            resolve();
        };

        ws.json = (data) => {
            return ws.send(JSON.stringify(data));
        };

        ws.json = (data) => {
            return ws.send(JSON.stringify(data));
        };

        const store = itemStore();

        ws.onmessage = (msg) => {
            try {

                let data = JSON.parse(msg.data);

                if (Object.prototype.hasOwnProperty.call(store, data.component)) {
                    if (data.event === "add") {

                        let target = store[data.component].find((item) => {
                            console.log("check item main.js", item._id, data.args[0]._id);
                            return item._id == data.args[0]._id;
                        });

                        console.log("Add event, exists?", target)

                        if (target) {
                            return
                        }

                        // add new item to store
                        store[data.component].push(data.args[0]);

                    } else if (data.event === "update") {

                        let target = store[data.component].find((item) => {
                            return item._id == data.args[0]._id;
                        });

                        if (!target) {
                            return;
                        }

                        // update/patch item in store
                        Object.assign(target, data.args[0]);

                    } else if (data.event === "remove") {

                        let index = store[data.component].findIndex((item) => {
                            return item._id == data.args[0]._id;
                        });

                        if (index === -1) {
                            return;
                        }

                        // remove item from store
                        store[data.component].splice(index, 1);

                    }
                }

            } catch (err) {
                console.error("Could not handle message", err);
            }
        };

        window.events = ws;

    }),

    // fetch /api resources
    new Promise((resolve, reject) => {
        Promise.all([
            request("/api/rooms"),
            request("/api/endpoints"),
            request("/api/devices"),
            request("/api/plugins"),
            request("/api/users"),
            request("/api/vault"),
            request("/api/store"),
            request("/api/ssdp"),
            request("/api/mdns"),
            request("/api/mqtt"),
            request("/api/webhooks"),
            request("/api/scenes"),
        ]).then(([
            rooms,
            endpoints,
            devices,
            plugins,
            users,
            vault,
            config, // config = store component
            ssdp,
            mdns,
            mqtt,
            webhooks,
            scenes
        ]) => {

            const store = itemStore();

            /*
            rooms.forEach(item => store.state.rooms.push(item));
            endpoints.forEach(item => store.state.endpoints.push(item));
            devices.forEach(item => store.state.devices.push(item));
            plugins.forEach(item => store.state.plugins.push(item));
            users.forEach(item => store.state.users.push(item));
            vault.forEach(item => store.state.vault.push(item));
            config.forEach(item => store.state.store.push(item));
            ssdp.forEach(item => store.state.ssdp.push(item));
            mdns.forEach(item => store.state.mdns.push(item));
            mqtt.forEach(item => store.state.mqtt.push(item));
            webhooks.forEach(item => store.state.webhooks.push(item));
            scenes.forEach(item => store.state.scenes.push(item));
            */

            store.rooms = itemWrapper(rooms, "rooms");
            store.endpoints = itemWrapper(endpoints, "endpoints");
            store.devices = itemWrapper(devices, "devices");
            store.plugins = itemWrapper(plugins, "plugins");
            store.users = itemWrapper(users, "users");
            store.vault = itemWrapper(vault, "vault");
            store.store = itemWrapper(config, "store");
            store.ssdp = itemWrapper(ssdp, "ssdp");
            store.mdns = itemWrapper(mdns, "mdns");
            store.mqtt = itemWrapper(mqtt, "mqtt");
            store.webhooks = itemWrapper(webhooks, "webhooks");
            store.scenes = itemWrapper(scenes, "scenes");;

            console.log("[pre] api resrouces fetched");

            resolve();

        }).catch((err) => {

            console.error("Could not fetch api resources", err);

            reject(err);

        });
    })

]).then(() => {

    console.log("Preshit done, mount vue app");

    //app.use(VueNotificationList);

    app.mount("#app");

}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});
