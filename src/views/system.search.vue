<template>
    <div>


        <input v-model="query" type="text" placeholder="Keywords" class="border p-2 rounded w-100 bg-dark" />

        <div class="form-check form-switch">
            <label class="form-check-label">
                <input class="form-check-input" type="checkbox" v-model="searchKeys">
                Search in keys
            </label>
        </div>

        <div v-if="results.length">

            <h3 class="font-bold mt-4">Results:</h3>

            <div v-for="(result, index) in results" :key="index" class="mb-4">

                <h5 class="text-sm font-semibold text-gray-500">
                    {{ result.component }}
                </h5>

                <pre
                    class="p-2 overflow-x-auto whitespace-pre-wrap"><code v-html="highlightMatch(JSON.stringify(result.item, null, 2).trim(), query)"></code></pre>

            </div>

        </div>

    </div>
</template>

<script>
import { itemStore } from "../store.js"

export default {

    name: "SearchBar",

    data() {
        return {
            query: "",
            results: [],
            searchKeys: false,
            dataSources: []
        }
    },

    methods: {
        searchInObject(obj, searchTerm) {
            if (Array.isArray(obj)) {
                return obj.some((item) => this.searchInObject(item, searchTerm))
            }

            if (typeof obj === "object" && obj !== null) {
                return Object.entries(obj).some(([key, value]) => {
                    const keyMatch = this.searchKeys && key.toLowerCase().includes(searchTerm.toLowerCase())
                    const valueMatch = this.searchInObject(value, searchTerm)
                    return keyMatch || valueMatch
                })
            }

            if (typeof obj === "string" || typeof obj === "number") {
                return String(obj).toLowerCase().includes(searchTerm.toLowerCase())
            }

            return false
        },
        runSearch() {
            if (!this.query) {
                this.results = []
                return
            }

            const foundItems = []

            this.dataSources.forEach(({ component, items }) => {
                items.forEach((item) => {
                    if (this.searchInObject(item, this.query)) {
                        foundItems.push({ component, item })
                    }
                })
            })

            this.results = foundItems
        },

        highlightMatch(text, searchTerm) {

            if (!searchTerm) {
                return text;
            }

            const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            const regex = new RegExp(escapedTerm, "gi");
            return text.replace(regex, (match) => `<mark class="text-black">${match}</mark>`);

        }
    },

    mounted() {
        const items = itemStore();
        this.dataSources = [
            "devices",
            "endpoints",
            "mdns",
            "mqtt",
            "plugins",
            "rooms",
            "scenes",
            "ssdp",
            "store",
            "users",
            "vault",
            "webhooks"
        ].map((prop) => {
            return {
                component: prop,
                items: items[prop]
            }
        });
    },

    watch: {
        query() {
            this.runSearch()
        },
        searchKeys() {
            this.runSearch()
        }
    }

}
</script>