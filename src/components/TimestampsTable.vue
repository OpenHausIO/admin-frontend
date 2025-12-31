<script setup>
import dateFormat from "dateformat";
import { settingsStore } from "../store.js";
const settings = settingsStore();
</script>

<script>
export default {
    name: "TimestampsTable",
    props: {
        data: {
            type: Object,
            required: true,
        },
        mappings: {
            type: Object,
            required: true
        },
    }
};
</script>

<template>
    <table>
        <tbody>
            <tr v-for="(value, key) in mappings">
                <td>{{ value }}:</td>
                <td>
                    {{ dateFormat(data[key] || 0, settings.dateformat) }}
                </td>
            </tr>
        </tbody>
    </table>
</template>