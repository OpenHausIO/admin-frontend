import { defineStore } from "pinia";
import { request, debounce } from "./helper.js"
import { addNotification } from "./components/Notifications.vue";

const itemStore = defineStore("items", {
    state() {
        return {
            rooms: [],
            endpoints: [],
            devices: [],
            scenes: [],
            mdns: [],
            mqtt: [],
            plugins: [],
            scenes: [],
            ssdp: [],
            store: [],
            users: [],
            vault: [],
            webhooks: []
        }
    },
    actions: {
        update(key, data, cb) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                //console.log(`Update property set "${key}"`, data);

                let target = Array.from(this[key]).find((item) => {
                    return item._id === data._id;
                });

                if (!target) {
                    return;
                }

                if (!cb) {
                    cb = (err) => {
                        if (err) {
                            addNotification(`Error: ${err}`, {
                                type: "danger",
                                dismiss: false
                            });
                        } else {
                            addNotification(`Item "${data._id}" updated`, {
                                type: "success"
                            });
                        }
                    };
                }

                request(`/api/${key}/${data._id}`, {
                    method: "PATCH",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                }, (err, data) => {

                    if (err || data?.error) {
                        console.error(err || data?.error);
                    } else {
                        Object.assign(target, data);
                    }

                    cb(err || data?.error, data);

                });

            } else {

                console.warn(`Could not update property "${key}" in store`);

            }
        },
        add(key, data, cb) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                if (!cb) {
                    cb = (err) => {
                        if (err) {
                            addNotification(`Error: ${err}`, {
                                type: "danger",
                                dismiss: false
                            });
                        } else {
                            addNotification(`Item "${data._id}" updated`, {
                                type: "success"
                            });
                        }
                    };
                }

                request(`/api/${key}`, {
                    method: "PUT",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                }, (err, data) => {

                    console.log("put request", err || data);

                    if (err || data?.error) {

                        cb(err || data?.error);
                        console.error(err || data?.error);

                    } else {

                        // NOTE: remove the .push?
                        // because events are handled via websocket
                        // drop the updateing/removing/adding from the store
                        // and handle that only via websocket events?

                        let target = this[key].find((item) => {
                            console.log("check item store.js", item._id, data._id);
                            return item._id == data._id;
                        });

                        cb(err || data?.error, data);

                        if (target) {
                            return;
                        }

                        this[key].push(data);
                    }

                });

            } else {

                console.warn(`Could not add item to property "${key}" in store`);

            }
        },
        remove(key, data, cb) {
            if (Object.prototype.hasOwnProperty.call(this, key)) {

                console.log(`Remove property to store "${key}"`, data);

                if (!cb) {
                    cb = (err) => {
                        if (err) {
                            addNotification(`Error: ${err}`, {
                                type: "danger",
                                dismiss: false
                            });
                        } else {
                            addNotification(`Item "${data._id}" removed`, {
                                type: "success"
                            });
                        }
                    };
                }

                request(`/api/${key}/${data._id}`, {
                    method: "DELETE",
                    headers: {
                        "content-type": "application/json"
                    }
                }, (err, data) => {

                    if (err || data?.error) {
                        console.error(err || data?.error);
                    }

                    cb(err || data?.error, data);

                    let index = this[key].findIndex((item) => {
                        return item._id === data._id;
                    });

                    if (index === -1) {
                        return;
                    }

                    this[key].splice(index, 1);

                });

            } else {

                console.warn(`Could not remove item to property "${key}" in store`);

            }
        }
    }
});

const settingsStore = defineStore("settings", {
    state() {
        return {
            dateformat: "yyyy.mm.dd - HH:MM:ss",
            expertSettings: false
        }
    },
    persistent: true
});

export {
    itemStore,
    settingsStore
};