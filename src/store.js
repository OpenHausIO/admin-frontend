import { createStore } from 'vuex'

export default createStore({
    state: {
        rooms: [],
        endpoints: [],
        users: [],
        devices: [],
        plugins: [],
        vault: [],
        store: [],
        ssdp: []
    },
    mutations: {
        delete(state, _id) {
            console.log(state)
            console.log("Delete item from strome", _id);
        }
    },
    actions: {

    },
    getters: {

    }
});