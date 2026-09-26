<template>
    <div class="hex-viewer">
        <div v-for="(row, idx) in hexRows" :key="idx" class="hex-row">
            <span class="offset">
                {{ row.offset }}
            </span>
            <span class="hex-bytes">
                <span v-for="(byte, byteIdx) in row.bytes" :key="byteIdx" class="byte">
                    {{ byte }}
                </span>
            </span>
            <span class="ascii">
                {{ row.ascii }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// Beispiel Command Payload (kannst du über Props reingeben)
const props = defineProps({
    data: {
        type: Uint8Array,
        default: () => new Uint8Array([
            0x01, 0x02, 0xFF, 0xA5, 0x00, 0x10, 0x20, 0x30,
            0x41, 0x42, 0x43, 0x44, 0x65, 0x66, 0x67, 0x68,
            0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0
        ])
    },
    payload: {
        type: [String, Uint8Array, Object],
        required: true
    },
    readonly: {
        type: Boolean,
        default: true
    }
});

const data = ((payload) => {

    if (typeof payload === "string") {

        const encoder = new TextEncoder();
        return encoder.encode(payload);

    } else if (payload instanceof Object && Object.hasOwnProperty.call(payload, "data") && payload?.type === "Buffer") {

        return new Uint8Array(payload);

    } else {

        return payload ?? new Uint8Array([]);

    }

})(props.payload);

const hexRows = computed(() => {
    const rows = [];
    const bytes = data;

    // Teile in 16-Byte Zeilen auf
    for (let i = 0; i < bytes.length; i += 16) {
        const rowBytes = bytes.slice(i, i + 16);

        // Offset = Position in der Datei (z.B. "00000000", "00000010")
        const offset = i.toString(16).padStart(8, '0').toUpperCase();

        // Konvertiere Bytes zu Hex Strings
        const hexBytes = Array.from(rowBytes).map(b =>
            b.toString(16).padStart(2, '0').toUpperCase()
        );

        // ASCII Darstellung (. für non-printable)
        const ascii = Array.from(rowBytes).map(b =>
            (b >= 32 && b <= 126) ? String.fromCharCode(b) : '.'
        ).join('');

        rows.push({
            offset,
            bytes: hexBytes,
            ascii
        });
    }

    return rows;
});
</script>

<style scoped>
.hex-viewer {
    font-family: 'Courier New', monospace;
    font-size: 14px;
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 8px;
    border-radius: 4px;
    overflow-x: auto;
}

.hex-row {
    display: flex;
    gap: 16px;
    margin-bottom: 4px;
    line-height: 1.5;
}

.offset {
    color: #858585;
    user-select: none;
}

.hex-bytes {
    display: flex;
    gap: 8px;
    flex: 1;
}

.byte {
    color: #4ec9b0;
    cursor: pointer;
}

.byte:hover {
    background: #264f78;
    border-radius: 2px;
}

.ascii {
    color: #ce9178;
    white-space: pre;
}
</style>