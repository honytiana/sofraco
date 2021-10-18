exports.reIndexOf = (arr, rx) => {
    const length = arr.length;
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            return i;
        }
    }
    return -1;
};

exports.reLastIndexOf = (arr, rx) => {
    const length = arr.length;
    let lastIndexOf = -1;
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            lastIndexOf = i;
        }
    }
    return lastIndexOf;
}

exports.reAllIndexOf = (arr, rx) => {
    const length = arr.length;
    let allIndexOf = [];
    for (let i = 0; i < length; i++) {
        if (arr[i].match(rx)) {
            allIndexOf.push(i);
        }
    }
    return allIndexOf;
}