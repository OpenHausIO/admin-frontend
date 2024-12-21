import { reactive } from 'vue'
import { debounce, request } from "./helper.js";

import { addNotification } from "@/components/Notifications.vue";

// https://stackoverflow.com/a/35610685/5781499
// https://github.com/OpenHausIO/backend/blob/e0e3c119a04e3adb81f58425d6ff727974bdc18f/system/component/class.component.js#L51

let itemWrapper = (item, component) => {

    let update = debounce(() => {

        console.log(`Do PATCH request: ${window.location.origin}/api/${component}/${item._id}`, item);

        request(`${window.location.origin}/api/${component}/${item._id}`, {
            method: "PATCH",
            body: JSON.stringify(item)
        }, (err, result) => {

            console.log(err, result);

            if (result.error || err) {

                addNotification(`Could not update item "${item._id}" in component "${component}": ${err || result.error}`, {
                    type: "danger",
                    dismiss: false
                });

            } else {

                addNotification(`Item "${item._id}" in component "${component}" updated`, {
                    type: "success"
                });

            }

        })

    }, 500);

    // with reactivitiy, vue browser extentions display nothing more...
    if (![
        "127.0.0.1",
        "localhost"
    ].includes(window.location.hostname) || window.forceReactiviy) {
        item = reactive(item)
    } else {
        console.error("Reacvitiy may be not working 100%");
    }

    return new Proxy(item, {
        //return new Proxy(item, {
        set(target, prop, value) {

            console.log("Update item object", item);

            // empty string are not allowed
            // however, null is a valid value
            if (value === "") {
                value = null;
            }

            target[prop] = value;

            update();

            return true;

        }
    });

};


const handle = (obj, component) => {
    return new Proxy(obj, {
        set(target, prop, value) {

            // check if prop is number (array item)
            // if so, wrap the object/item in a proxy
            if (new RegExp(/^\d+$/).test(prop)) {
                target[prop] = itemWrapper(value, component);
            } else {
                target[prop] = value;
            }

            return true;

        }
    });
};


const state = {
    rooms: handle([], "rooms"),
    endpoints: handle([], "endpoints"),
    users: handle([], "users"),
    devices: handle([], "devices"),
    plugins: handle([], "plugins"),
    vault: handle([], "vault"),
    store: handle([], "store"),
    ssdp: handle([], "ssdp"),
    mdns: handle([], "mdns"),
    mqtt: handle([], "mqtt"),
    webhooks: handle([], "webhooks"),
    scenes: handle([], "scenes")
};


const settings = reactive({
    dateformat: "yyyy.mm.dd - HH:MM",
    expertSettings: false
});

if (window.localStorage.getItem("expertSettings")) {
    console.warn("expertSettings", window.localStorage.getItem("expertSettings"));
    settings.expertSettings = window.localStorage.getItem("expertSettings") === "true";
}

window.state = state;

export default {
    state,
    settings
}


/*
setTimeout(() => {

    console.clear();
    console.log("Add rooms item");

    states.rooms.push({
        _id: "631b7f4643f642a9762f370f",
        name: "Hello",
        icon: "fa-solid fa-light-bulb",
        timestamps: {
            foo: Date.now(),
            bar: Date.now() - 10000
        },
        enabled: true
    });

    let obj = states.rooms[0];

    obj.name = "New Name";
    obj.enabled = false;

    console.log("Obj", obj);

}, 5000);
*/