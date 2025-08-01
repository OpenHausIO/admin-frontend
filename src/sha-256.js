// ES6 Module implementation of SHA-256
// converted & minified from ChatGPT
// original source: https://gist.github.com/bryanchow/1649353

// Configurable variables
let hexcase = 0; // hex output format. 0 - lowercase; 1 - uppercase

// Exported functions
export async function sha256Hex(blob) {
    const rawString = await blobToRawString(blob);
    return rstr2hex(rstr_sha256(rawString));
}

// Convert a Blob to a raw string
async function blobToRawString(blob) {
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let rawString = "";
    for (let i = 0; i < uint8Array.length; i++) {
        rawString += String.fromCharCode(uint8Array[i]);
    }
    return rawString;
}

// Calculate the sha256 of a raw string
function rstr_sha256(s) {
    return binb2rstr(binb_sha256(rstr2binb(s), s.length * 8));
}

// Convert a raw string to a hex string
function rstr2hex(input) {
    const hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    let output = "";
    for (let i = 0; i < input.length; i++) {
        const x = input.charCodeAt(i);
        output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
}

// Convert a raw string to an array of big-endian words
function rstr2binb(input) {
    const output = new Array((input.length >> 2) + 1).fill(0);
    for (let i = 0; i < input.length * 8; i += 8) {
        output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (24 - i % 32);
    }
    return output;
}

// Convert an array of big-endian words to a string
function binb2rstr(input) {
    let output = "";
    for (let i = 0; i < input.length * 32; i += 8) {
        output += String.fromCharCode((input[i >> 5] >>> (24 - i % 32)) & 0xFF);
    }
    return output;
}

// Main sha256 function, with its support functions
function binb_sha256(m, l) {
    const HASH = [
        1779033703, -1150833019, 1013904242, -1521486534,
        1359893119, -1694144372, 528734635, 1541459225
    ];
    const W = new Array(64);
    let a, b, c, d, e, f, g, h;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (let i = 0; i < m.length; i += 16) {
        [a, b, c, d, e, f, g, h] = HASH;

        for (let j = 0; j < 64; j++) {
            if (j < 16) W[j] = m[j + i];
            else W[j] = safe_add(
                safe_add(safe_add(sha256_Gamma1256(W[j - 2]), W[j - 7]), sha256_Gamma0256(W[j - 15])), W[j - 16]
            );

            const T1 = safe_add(
                safe_add(
                    safe_add(safe_add(h, sha256_Sigma1256(e)), sha256_Ch(e, f, g)),
                    sha256_K[j]
                ),
                W[j]
            );
            const T2 = safe_add(sha256_Sigma0256(a), sha256_Maj(a, b, c));

            h = g;
            g = f;
            f = e;
            e = safe_add(d, T1);
            d = c;
            c = b;
            b = a;
            a = safe_add(T1, T2);
        }

        HASH[0] = safe_add(a, HASH[0]);
        HASH[1] = safe_add(b, HASH[1]);
        HASH[2] = safe_add(c, HASH[2]);
        HASH[3] = safe_add(d, HASH[3]);
        HASH[4] = safe_add(e, HASH[4]);
        HASH[5] = safe_add(f, HASH[5]);
        HASH[6] = safe_add(g, HASH[6]);
        HASH[7] = safe_add(h, HASH[7]);
    }

    return HASH;
}

// Utility functions
function sha256_S(X, n) {
    return (X >>> n) | (X << (32 - n));
}
function sha256_R(X, n) {
    return X >>> n;
}
function sha256_Ch(x, y, z) {
    return (x & y) ^ (~x & z);
}
function sha256_Maj(x, y, z) {
    return (x & y) ^ (x & z) ^ (y & z);
}
function sha256_Sigma0256(x) {
    return sha256_S(x, 2) ^ sha256_S(x, 13) ^ sha256_S(x, 22);
}
function sha256_Sigma1256(x) {
    return sha256_S(x, 6) ^ sha256_S(x, 11) ^ sha256_S(x, 25);
}
function sha256_Gamma0256(x) {
    return sha256_S(x, 7) ^ sha256_S(x, 18) ^ sha256_R(x, 3);
}
function sha256_Gamma1256(x) {
    return sha256_S(x, 17) ^ sha256_S(x, 19) ^ sha256_R(x, 10);
}
function safe_add(x, y) {
    const lsw = (x & 0xFFFF) + (y & 0xFFFF);
    const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

const sha256_K = [
    1116352408, 1899447441, -1245643825, -373957723, 961987163, 1508970993,
    -1841331548, -1424204075, -670586216, 310598401, 607225278, 1426881987,
    1925078388, -2132889090, -1680079193, -1046744716, -459576895, -272742522,
    264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986,
    -1740746414, -1473132947, -1341970488, -1084653625, -958395405, -710438585,
    113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291,
    1695183700, 1986661051, -2117940946, -1838011259, -1564481375, -1474664885,
    -1035236496, -949202525, -778901479, -694614492, -200395387, 275423344,
    430227734, 506948616, 659060556, 883997877, 958139571, 1322822218,
    1537002063, 1747873779, 1955562222, 2024104815, -2067236844, -1933114872,
    -1866530822, -1538233109, -1090935817, -965641998
];
