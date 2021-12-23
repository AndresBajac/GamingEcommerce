const fs = require('fs');
const Product = require('../models/Product');
const path = require('path')
const fileName = path.join(__dirname, '../Data/products.json');

class ProductController {
    constructor() {
        this.products = [];
        this.lastId = 0;
        this.init()
    }


    init() {
        try {
            const list = fs.readFileSync(fileName, 'utf-8')
            this.products = JSON.parse(list)
            if (this.products.length > 0)
                this.lastId = this.products[this.products.length - 1].id + 1;
        }
        catch (e) {
            console.error(e)
            this.products = []
        }
    }

    getProducts() {
       return this.products;
    }

    find(id) {
        const product = this.products.find((product) => product.id == id);
        if (product) {
            return product;
        } else {
            return false
        }
    }

    insert(product) {
        const newProduct = new Product(product)
        newProduct.id = this.lastId
        this.products.push(newProduct)
        fs.writeFileSync(fileName, JSON.stringify(this.products, null, 2))
        this.lastId++
        return this.products;
    }

    update(id, product) {
        const index = this.products.findIndex((product) => product.id == id);
        if (index > -1) {
            this.products[index] = product
            fs.writeFileSync(fileName, JSON.stringify(this.products, null, 2))
            return product
        } else {
            return {"error": "producto no encontrado"};
        }
    }

    delete(id) {
        const index = this.products.findIndex((product) => product.id == id);
        if (index > -1) {    
            this.products.splice(index, 1);
            fs.writeFileSync(fileName, JSON.stringify(this.products, null, 2))
            return 'Producto eliminado'
        } else {
         return {"error": "producto no encontrado"};
        }
    }
    
}

module.exports = new ProductController();