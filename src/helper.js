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
    getItemByProperty
}