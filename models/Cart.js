class Cart {
    constructor() {
        this.id = 0;
        this.timestamp = new Date().toLocaleTimeString();
        this.products = [];
    }
}

module.exports = Cart