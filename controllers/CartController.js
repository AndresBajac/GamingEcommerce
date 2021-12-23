const fs = require('fs');
const Cart = require('../models/Cart');
const path = require('path')
const ProductController = require('./ProductController');
const cartsFileName = path.join(__dirname, '../Data/carts.json');
const productsFileName = path.join(__dirname, '../Data/products.json');

class CartController {
    constructor() {
        this.carts = [];
        this.lastId = 0;
        this.init()
    }

    init() {
        try {
            const list = fs.readFileSync(cartsFileName, 'utf-8')
            this.carts = JSON.parse(list)
            if (this.carts.length > 0) 
                this.lastId = this.carts[this.carts.length - 1].id + 1;
        }
        catch (e) {
            console.error(e)
            this.carts = []
        }
    }

    getProducts(cartId) {
        // si el archivo carts.json tiene algo
        if (this.carts.length) {
            let cart = this.carts.find(cart => cart.id == cartId)
            // si el carrito elegido existe
            if (cart) {
                console.log("Estos son los productos del carrito elegido ",cart.products)
                // si el carrito elegido tiene productos
                if (cart.products.length) {
                    return cart.products;            
                } else {
                    return { error: `El carrito ${cartId} no tiene productos` }
                }
            }
            else {
                console.log(`No existe el carrito con id: ${cartId}`)
                return { error: `No existe el carrito con id: ${cartId}` }
            }
        }
        // si carts.json no tiene datos
        else {
            console.log(`El archivo esta vacio`)
            return 'el archivo esta vacio'
        }
    }

     find(id) {
        const cart = this.carts.find((cart) => cart.id == id);
        if (cart) {
            return cart;
        } else {
            return {"error": "carrito no encontrado"};
        }
    }

    createCart(cart) {
        console.log(cart);
        const newCart = new Cart(cart)
        newCart.id = this.lastId
        this.carts.push(newCart)
        fs.writeFileSync(cartsFileName, JSON.stringify(this.carts, null, 2))
        this.lastId++
        return newCart.id;
    }

    addProduct(cartId, productId) {
        // busco el carrito al que le quiero agregar un producto nuevo
        let index = this.carts.findIndex(cart => cart.id == cartId);
        // si existe el carrito elegido
        if (index != -1) {
            // si encuentra el producto elegido
            if (ProductController.find(productId)) {       
                this.carts[index].products.push(ProductController.find(productId))
                // lo guardo y salvo el archivo
                try {
                    fs.writeFileSync(cartsFileName, JSON.stringify(this.carts, null, 2))
                    console.log(`Se agregó el producto: ${productId} al carrito: ${cartId}`)
                    return { message: `Se agregó el producto: ${productId} al carrito: ${cartId}` }
                } catch (error) {
                    console.error(error)
                }
            } else {
                return {"error": "producto no encontrado"};
            }
        }
        else {
            console.log(`No existe el carrito con id: ${cartId}`)
            return {"error": "carrito no encontrado"};
        }
    }

    deleteProduct(cartId, productId) {
        // busco el carrito al que le quiero eliminar un producto
        console.log(`se quiere eliminar el producto ${productId} del carrito ${cartId}`);
        let indexCart = this.carts.findIndex(cart => cart.id == cartId);
        // si existe el carrito elegido
        if (indexCart != -1) {
            let indexProduct = this.carts[indexCart].products.findIndex(product => product.id == productId);
            // si encuentra el producto elegido
            if (indexProduct != -1) {
                // lo guardo y salvo el archivo
                try {
                    this.carts[indexCart].products.splice(indexProduct, 1);
                    fs.writeFileSync(cartsFileName, JSON.stringify(this.carts, null, 2))
                    console.log(`Se eliminó el producto: ${productId} del carrito: ${cartId}`)
                    return { message: `Se eliminó el producto: ${productId} del carrito: ${cartId}` }
                } catch (error) {
                    console.error(error)
                }
            } else {
                return {"error": "producto no encontrado"};
            }
        }
        else {
            console.log(`No existe el carrito con id: ${cartId}`)
            return {"error": "carrito no encontrado"};
        }
    }

    deleteCart(id) {
        const index = this.carts.findIndex((cart) => cart.id == id);
        if (index > -1) {    
            this.carts.splice(index, 1);
            try {
                fs.writeFileSync(cartsFileName, JSON.stringify(this.carts, null, 2))
                return 'Carrito eliminado'           
            } catch (error) {
                console.error(error)
                throw new error
            }

        } else {
         return {"error": "carrito no encontrado"};
        }
    }

}

module.exports = new CartController();