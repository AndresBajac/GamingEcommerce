////////////////////////// Importaciones //////////////////////////
const express = require('express');
const { Router } = express;
const fs = require('fs');
const handlebars = require('express-handlebars');
const Product = require('./Models/Product');
const Cart = require('./Models/Cart');
const ProductController = require('./Controllers/ProductController');
const CartController = require('./Controllers/CartController');

////////////////////////// Inicializaciones //////////////////////////
const app = express();
const routerProduct = Router();
const routerCart = Router();
const PORT = process.env.PORT || 8080
// con __dirname traemos la ruta absoluta
// instanciamos el objeto y le pasamos un filename segun indica el constructor de la clase
// const product = new Product()
// const cart = new Product()
// Creo constante server escuchando el puerto elegido.
const server = app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto: ${server.address().port}`)
});

// En caso de error utilizo el método on que nos brinda la constante server
server.on("error", (error) => {console.log("Error al conectar con el servidor", error);})
// no olvidarse de esto si vamos a responder con json. Sino lo muestra vacío
app.use(express.json()) 
 // Reconoce lo que le pasemos en el request como objeto y mantiene su formato
app.use(express.urlencoded({extended: true}))
// Llamamos a los archivos alojados dentro de la carpeta públicaasí: http://localhost:8080/perro.jpg
app.use(express.static('public')) 

// Definimos los routers base de las dos clases (products y carts)
app.use('/api/products', routerProduct) 
app.use('/api/carts', routerCart)

// Defino el motor de plantillas (habdlebars)
app.engine('handlebars',handlebars.engine())

// especifica la carpeta de plantillas (handlebars)
app.set('views', './views')
app.set('view engine', 'handlebars')


////////////////////////// Rutas Web //////////////////////////
// trae toda la lista de productos
app.get("/products", (req, res) => {
    res.render('products', {products: ProductController.getProducts()})
})

// trae el carrito elegido
routerCart.get("/", (req, res) => {
    return res.render('cart')
})

////////////////////////// Rutas Api //////////////////////////

routerProduct.get("/:id?", (req, res) => {
    if (req.params.id) {
        const id = req.params.id
        res.json({product: ProductController.find(id)})
    } else {
        res.json(ProductController.getProducts())
    }
})

routerProduct.post("/", (req, res) => {
    req.body.price = +req.body.price;
    const newProduct = req.body
    res.json(ProductController.insert(newProduct))
})

routerProduct.put("/:id", (req, res) => {
    const updateProduct = req.body
    const id = +req.params.id
    res.json(ProductController.update(id, updateProduct))
})

routerProduct.delete("/:id", (req, res) => {
    const id = req.params.id
    res.json(ProductController.delete(id))
})

routerCart.get("/:id/products", (req, res) => {
    const id = req.params.id
    res.json(CartController.getProducts(id))
})