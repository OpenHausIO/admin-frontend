<template>
    <div class="hex-viewer">

        <!-- Toolbar -->
        <div v-if="!readonly" class="toolbar">
            <button @click="addByte" class="add-btn">+ Byte hinzufügen</button>
            <span class="byte-count">{{ editableBytes.length }} Bytes</span>
        </div>

        <!-- Hex Grid -->
        <div class="hex-grid">
            <div class="hex-row" v-for="rowIndex in Math.ceil(editableBytes.length / 16)" :key="rowIndex">
                <!-- Offset -->
                <span class="offset">{{ ((rowIndex - 1) * 16).toString(16).padStart(8, '0').toUpperCase() }}</span>

                <!-- Hex Bytes -->
                <div class="hex-bytes">
                    <div v-for="i in 16" :key="i" class="byte-wrapper">
                        <template v-if="(rowIndex - 1) * 16 + (i - 1) < editableBytes.length">
                            <input :value="toHex(editableBytes[(rowIndex - 1) * 16 + (i - 1)])"
                                @input="onByteInput((rowIndex - 1) * 16 + (i - 1), $event)"
                                @keydown="onKeyDown((rowIndex - 1) * 16 + (i - 1), $event)" class="byte" maxlength="2"
                                :readonly="readonly" />
                            <button v-if="!readonly" @click="removeByte((rowIndex - 1) * 16 + (i - 1))"
                                class="remove-btn" title="Byte löschen">×</button>
                        </template>
                        <span v-else class="byte empty">--</span>
                    </div>
                </div>

                <!-- ASCII -->
                <div class="ascii">
                    <span v-for="i in 16" :key="i">
                        {{ (rowIndex - 1) * 16 + (i - 1) < editableBytes.length ? toAscii(editableBytes[(rowIndex - 1) *
                            16 + (i - 1)]) : ' ' }} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    payload: {
        type: [String, Uint8Array, Object],
        default: ''
    },
    readonly: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:payload']);

// Lokaler editierbarer State
const editableBytes = ref([]);

// Payload zu Bytes konvertieren
const payloadToBytes = (payload) => {
    /*
    if (typeof payload === 'string') {
        const encoder = new TextEncoder();
        return Array.from(encoder.encode(payload));
    } else {
        return Array.from(payload);
    }*/
    if (typeof payload === "string") {

        const encoder = new TextEncoder();
        return Array.from(encoder.encode(payload));

    } else if (payload instanceof Object && Object.hasOwnProperty.call(payload, "data") && payload?.type === "Buffer") {

        return Array.from(new Uint8Array(payload.data));

    } else {

        return Array.from(payload ?? new Uint8Array([]));

    }
};

// Initial laden
editableBytes.value = payloadToBytes(props.payload);

// Bei externen Änderungen updaten
watch(() => props.payload, (newPayload) => {
    editableBytes.value = payloadToBytes(newPayload);
});

// Bytes zu Hex formatieren
const toHex = (byte) => {
    return (byte || 0).toString(16).padStart(2, '0').toUpperCase();
};

// Byte editieren
const onByteInput = (index, event) => {
    let value = event.target.value.toUpperCase();

    // Nur Hex erlauben
    value = value.replace(/[^0-9A-F]/g, '');

    if (value.length > 2) {
        value = value.slice(0, 2);
    }

    event.target.value = value;

    // Byte updaten wenn vollständig
    if (value.length === 2) {
        editableBytes.value[index] = parseInt(value, 16);
        emitUpdate();

        // Zum nächsten springen
        const next = event.target.nextElementSibling;
        if (next && next.tagName === 'INPUT') {
            setTimeout(() => {
                next.focus();
                next.select();
            }, 10);
        }
    } else if (value.length === 1) {
        // Partial update
        const currentByte = editableBytes.value[index] || 0;
        const currentHex = toHex(currentByte);
        // Keep second digit if exists
        editableBytes.value[index] = parseInt(value + currentHex[1], 16);
    }
};

// Backspace/Delete handling
const onKeyDown = (index, event) => {
    if (event.key === 'Backspace' && event.target.value === '') {
        event.preventDefault();
        const prev = event.target.previousElementSibling;
        if (prev && prev.tagName === 'INPUT') {
            prev.focus();
            prev.select();
        }
    } else if (event.key === 'Delete') {
        editableBytes.value[index] = 0;
        event.target.value = '00';
        emitUpdate();
    } else if (event.key === 'ArrowLeft' && event.target.selectionStart === 0) {
        event.preventDefault();
        const prev = event.target.previousElementSibling;
        if (prev && prev.tagName === 'INPUT') {
            prev.focus();
        }
    } else if (event.key === 'ArrowRight' && event.target.selectionStart === event.target.value.length) {
        event.preventDefault();
        const next = event.target.nextElementSibling;
        if (next && next.tagName === 'INPUT') {
            next.focus();
        }
    }
};

// Neues Byte hinzufügen
const addByte = () => {
    editableBytes.value.push(0x00);
    emitUpdate();
};

// Byte löschen
const removeByte = (index) => {
    editableBytes.value.splice(index, 1);
    emitUpdate();
};

// Payload emittieren
const emitUpdate = () => {
    const uint8 = new Uint8Array(editableBytes.value);
    const decoder = new TextDecoder();
    const asciiString = decoder.decode(uint8);
    emit('update:payload', asciiString);
};

// ASCII char für Byte
const toAscii = (byte) => {
    return (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.';
};
</script>

<style scoped>
.hex-viewer {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    border-radius: 4px;
    overflow-x: auto;
}

.toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #3e3e42;
}

.add-btn {
    padding: 6px 12px;
    background: #4ec9b0;
    color: #1e1e1e;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

.add-btn:hover {
    background: #3eb89f;
}

.byte-count {
    color: #858585;
    font-size: 12px;
}

.hex-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.hex-row {
    display: flex;
    gap: 16px;
    line-height: 1.5;
}

.offset {
    color: #858585;
    user-select: none;
    min-width: 80px;
}

.hex-bytes {
    display: flex;
    gap: 6px;
    flex: 1;
}

.byte-wrapper {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.byte {
    color: #4ec9b0;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 2px;
    width: 28px;
    text-align: center;
    font-family: 'Courier New', monospace;
    font-size: 14px;
    padding: 2px 4px;
    outline: none;
}

.byte.empty {
    color: #3e3e42;
    cursor: default;
}

.byte:not([readonly]):not(.empty):hover {
    background: #264f78;
    border-color: #264f78;
}

.byte:focus {
    background: #264f78;
    border-color: #4ec9b0;
}

.byte[readonly]:not(.empty) {
    cursor: default;
}

.byte:not([readonly]):not(.empty) {
    cursor: text;
}

.remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 14px;
    height: 14px;
    padding: 0;
    background: #e51400;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 10px;
    line-height: 1;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
}

.byte-wrapper:hover .remove-btn {
    display: flex;
}

.remove-btn:hover {
    background: #c41200;
}

.ascii {
    color: #ce9178;
    white-space: pre;
    display: flex;
    gap: 2px;
}

.ascii span {
    width: 10px;
    text-align: center;
}
</style>