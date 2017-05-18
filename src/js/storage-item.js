
class StorageItem {
    constructor(storeKey) {
        this.storeKey = storeKey;
    }

    __unbox() {
        return JSON.parse(localStorage.getItem(this.storeKey));
    }

    __store(obj) {
        localStorage.setItem(this.storeKey, JSON.stringify(obj));
    }

    getItem() {
        return this.__unbox();
    }

    setItem(obj) {
        this.__store(obj);
    }

    clear() {
        this.__store(null);
    }
}

//Public API
module.exports = StorageItem;