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
            "Content-Type": "application/json"
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
        let id = setTimeout(() => controller.abort(), 1000);

        fetch(url, {
            ...options,
            signal: controller.signal
        }).then((response) => {
            clearTimeout(id);
            return response.json();
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

        console.log("Debounce child claled")

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

export {
    getItemById,
    getItemByProperty,
    promisfy,
    request,
    debounce
};