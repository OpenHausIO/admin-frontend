import { defineStore } from "pinia";
import { request, debounce } from "./helper.js"
import { addNotification } from "./components/Notifications.vue";
import { computed, ref } from "vue";

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

const userStore = defineStore('user', () => {
    // State
    const user = ref(null)
    const token = ref(localStorage.getItem('x-auth-token') || null)
    const authChecked = ref(false)
    const authenticated = ref(false)

    // User aus localStorage wiederherstellen
    if (localStorage.getItem('user')) {
        try {
            user.value = JSON.parse(localStorage.getItem('user'))
        } catch (err) {
            console.warn('Could not parse user object from local storage')
        }
    }

    // Sync Getters
    const isAuthenticated = computed(() => authenticated.value)
    const isAdmin = computed(() => {
        if (user.value) {
            return user.value?.admin || false;
        } else {
            return true;
        }
    });

    // Actions
    async function checkAuth() {
        try {
            // Schneller Check mit sessionStorage
            const sessionAuth = sessionStorage.getItem('authenticated')

            if (sessionAuth === 'true' && token.value) {
                authenticated.value = true
                authChecked.value = true
                return true
            }

            const response = await fetch('/auth/check', {
                method: 'GET',
                headers: {
                    'x-auth-token': token.value
                }
            });

            authenticated.value = response.ok && response.status === 200
            authChecked.value = true

            if (authenticated.value) {
                sessionStorage.setItem('authenticated', 'true')
            } else {

                sessionStorage.removeItem('authenticated')
                localStorage.removeItem('x-auth-token')
                localStorage.removeItem('user')

            }

            return authenticated.value

        } catch (err) {
            console.warn('Could not check if authenticated', err)
            authenticated.value = false
            authChecked.value = true
            return false
        }
    }

    async function login(credentials) {
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            })

            if (response.ok && response.status === 200) {
                const data = await response.json()

                user.value = data.user
                token.value = data.token
                authenticated.value = true
                authChecked.value = true

                sessionStorage.setItem('authenticated', 'true')
                localStorage.setItem('x-auth-token', data.token)
                localStorage.setItem('user', JSON.stringify(data.user))

                return data;
            } else {
                return false
            }

        } catch (err) {
            console.warn('Could not login', err)
            return false
        }
    }

    async function logout() {

        sessionStorage.removeItem('authenticated')
        localStorage.removeItem('x-auth-token')
        localStorage.removeItem('user')

        if (token.value) {
            fetch('/auth/logout', {
                method: 'POST',
                headers: {
                    'x-auth-token': token.value
                }
            }).catch(() => {
                // Ignoriere Fehler beim Logout
            })
        }

        user.value = null
        token.value = null
        authenticated.value = false
        authChecked.value = false

        return true;
    }

    return {
        // State
        user,
        token,
        authChecked,

        // Getters (sync!)
        isAuthenticated,
        isAdmin,

        // Actions
        checkAuth,
        login,
        logout
    }
})

export {
    itemStore,
    settingsStore,
    userStore
};