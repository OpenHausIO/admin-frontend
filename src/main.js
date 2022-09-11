import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store.js";

import VueNotificationList from '@dafcoe/vue-notification'

import { request } from "./helper.js";


// monkey patch ws
window.events = null;



// create vue app
const app = createApp(App);


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
        let id = setTimeout(() => controller.abort(), 1000);

        let ws = new WebSocket(`ws://${window.location.host}/api/events`);

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

        ws.onmessage = (msg) => {

            let data = JSON.parse(msg.data);

            console.log("[EVENT]", data);
            //app.$emit("event", data);

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
        ]).then(([
            rooms,
            endpoints,
            devices,
            plugins,
            users,
            vault,
            config, // config = store component
            ssdp
        ]) => {


            rooms.forEach(item => store.state.rooms.push(item));
            endpoints.forEach(item => store.state.endpoints.push(item));
            devices.forEach(item => store.state.devices.push(item));
            plugins.forEach(item => store.state.plugins.push(item));
            users.forEach(item => store.state.users.push(item));
            vault.forEach(item => store.state.vault.push(item));
            config.forEach(item => store.state.store.push(item));
            ssdp.forEach(item => store.state.ssdp.push(item));


            console.log("[pre] api resrouces fetched");

            resolve();

        }).catch((err) => {

            console.error("Could not fetch api resources", err);

            reject(err);

        });
    })

]).then(() => {

    console.log("Preshit done, mount vue app");

    app.use(router);
    app.use(store);

    app.use(VueNotificationList)

    app.mount("#app");

}).catch((err) => {

    alert("Could not start: " + err.message);
    console.warn("Display overlay with error", err);

});
