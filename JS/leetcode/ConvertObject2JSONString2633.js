Given an object, return a valid JSON string of that object. You may assume the object only inludes strings, integers, arrays, objects, booleans, and null. The returned string should not include extra spaces. The order of keys should be the same as the order returned by Object.keys().

Please solve it without using the built-in JSON.stringify method.

/**
 * @param {any} object
 * @return {string}
 */
var jsonStringify = function(object) {
    if (object === null){
        return 'null';
    } else if (typeof object === 'string'){
        return '"' + object + '"';
    } else if (typeof object === 'number' || typeof object === 'boolean'){
        return String(object)
    } else if (Array.isArray(object)){
        const arr = object.map(item => jsonStringify(item)).join(',');
        return '[' + arr + ']';
    } else if (typeof object === 'object'){
        const keys = Object.keys(object);
        const items = keys.map(key => '"' + key + '":' + jsonStringify(object[key]));
        return '{' + items.join(',') + '}'
    }
};
