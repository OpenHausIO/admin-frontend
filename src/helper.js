import { addNotification } from "./components/Notifications.vue";
import { sha256Hex } from "./sha-256.js";

function promisfy(worker, cb) {

    let wrapper = new Promise((resolve, reject) => {
        worker((err, ...args) => {
            if (err) {
                reject(err);
            } else {

                // NOTE: GOOD PRACTICE?!
                if (args.length === 1 && !cb) {
                    resolve(args[0]);
                } else {
                    resolve(args);
                }

            }
        });
    });

    if (cb) {

        wrapper.then((args) => {
            cb(null, ...args);
        }).catch((err) => {
            cb(err);
        });

        //return undefined;

    } else {

        return wrapper;

    }

}


function request(url, options, cb) {

    if (!cb && options instanceof Function) {
        cb = options;
        options = null;
    }

    options = Object.assign({
        method: "GET",
        headers: {
            "content-type": "application/json"
        }
    }, options);


    if (window.localStorage.getItem("x-auth-token")) {
        if (options.headers) {
            options.haders = Object.assign(options.headers, {
                "x-auth-token": window.localStorage.getItem("x-auth-token")
            })
        } else {
            options.headers = {
                "x-auth-token": window.localStorage.getItem("x-auth-token")
            }
        }
    }

    console.log(`[REQUEST] ${options.method}: ${url}`, options);

    return promisfy((done) => {

        let controller = new AbortController();
        let id = setTimeout(() => controller.abort(), 10000);

        fetch(url, {
            ...options,
            signal: controller.signal
        }).then((response) => {

            console.log("REsponse fetch", response)

            clearTimeout(id);

            if (response.headers.get("content-type").match(/json/)) {
                //console.log("content type container 'json'", response.headers);
                return response.json();
            }

            return response.blob();

        }).then((data) => {
            done(null, data);
        }).catch((err) => {

            //TODO: Remove token if we receive a 401 error
            console.error("[REQUEST] Error", err, options);

            done(err);

        });



    }, cb);

}

function debounce(func, wait, immediate = false) {

    let timeout = null;

    return function (...args) {

        let later = () => {

            timeout = null;

            if (!immediate) {
                func.apply(this, args);
            }

        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);

        if (immediate && !timeout) {
            func.apply(this, args);
        }

    };

}

function getItemById(arr, _id, key = "_id") {
    return arr.find((item) => {
        return item[key] === _id;
    });
}

function getItemByProperty(arr, _id, key = "_id") {
    return arr.find((item) => {
        return item[key] === _id;
    });
}


function itemWrapper(items, component) {
    /*
        let update = debounce((item) => {
    
    
            // debounce call here
            console.debug(`Item change in component "${component}"`, item);
    
            //console.log(`Do PATCH request: ${window.location.origin}/api/${component}/${item._id}`, item);
    
            /*
            request(`${window.location.origin}/api/${component}/${item._id}`, {
                method: "PATCH",
                body: JSON.stringify(item)
            }, (err, result) => {
                if (result?.error || err) {
    
                    addNotification(`Could not update item "${item._id}" in component "${component}": ${err || result.error}`, {
                        type: "danger",
                        dismiss: false
                    });
    
                } else {
    
                    addNotification(`Item "${item._id}" in component "${component}" updated`, {
                        type: "success"
                    });
    
                }
            });
            *
    
        }, 500);
    
        return items.map((item) => {
            return new Proxy(item, {
                set(target, prop, value, receiver) {
    
                    update(item);
    
                    return Reflect.set(target, prop, value, receiver);
    
                }
            });
        });
    */
    return items;
}

async function calculateSHA256(blob) {

    let hashHex = null;

    if (crypto.subtle) {
        // native browser implementation
        // works only on HTTPs
        // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle
        const arrayBuffer = await blob.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    } else {
        // works also on HTTP
        // "polyfill"
        hashHex = sha256Hex(blob);
    }


    return hashHex;

}

export {
    getItemById,
    getItemByProperty,
    promisfy,
    request,
    debounce,
    itemWrapper,
    calculateSHA256
};