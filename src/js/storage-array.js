
class StorageArray {
    constructor(storeKey) {
        this.storeKey = storeKey;

        var testAra = this.__unbox();
        if(testAra == null)
        {
            this.__store([]); //Initialize the Array
        }
    }

    addItem(obj) {
        var array = this.__unbox();
        array.push(obj);
        this.__store(array);
    }

    getItem(index) {
        var array = this.__unbox();
        return array[index];
    }

    getItems() {
        return this.__unbox();
    }

    length() {
        var array = this.__unbox();
        return array.length;
    }

    remove(index) {
        var array = this.__unbox();
        array.splice(index, 1);
        this.__store(array);
    }

    __store(obj) {
        localStorage.setItem(this.storeKey, JSON.stringify(obj));
    }

    /**
     * @return {Array}
     */
    __unbox() {
        return JSON.parse(localStorage.getItem(this.storeKey));
    }

    clear() {
        this.__store([]);
    }
}

//Public API
module.exports = StorageArray;