////////////////////////// Importaciones //////////////////////////
const express = require('express');
const { Router } = express;
const fs = require('fs');
const handlebars = require('express-handlebars');
const Product = require('./models/Product');
const Cart = require('./models/Cart');
const ProductController = require('./Controllers/ProductController');
const CartController = require('./Controllers/CartController');
const ServiceException = require("./Exceptions/ServiceException");
const PermissionsException = require("./Exceptions/PermissionException");

////////////////////////// Inicializaciones //////////////////////////
const app = express();
const routerProduct = Router();
const routerCart = Router();
const isAdmin = true;
const PORT = process.env.PORT || 8080
// con __dirname traemos la ruta absoluta
// instanciamos el objeto y le pasamos un filename segun indica el constructor de la clase
// const product = new Product()
// const cart = new Product()
// Creo constante server escuchando el puerto elegido.
const server = app.listen(PORT, () => {
    console.log(`Servidor Corriendo en el puerto: ${server.address().port}`)
});

// creo un middleware para administradores
function adminMiddleware(req, res, next) {
    if(isAdmin)
        next();
    else{
            res.status(401)
            console.log(req.originalUrl);
            res.json(new PermissionsException(-1, `Ruta ${req.originalUrl} metodo ${req.method} no autorizado`))
        }
}

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

// ruta 404
app.use((req, res) => {
    res.status(404);
    res.json(new ServiceException(-2, `La ruta ${req.originalUrl} con metodo metodo ${req.method} no existe`))
})  

//// products

// Trae toda la lista de productos o el producto elegido por id
routerProduct.get("/:id?", (req, res) => {
    if (req.params.id) {
        const id = req.params.id
        res.json({product: ProductController.find(id)})
    } else {
        res.json(ProductController.getProducts())
    }
})

// agrega un producto
routerProduct.post("/", adminMiddleware, (req, res) => {
    req.body.price = +req.body.price;
    const newProduct = req.body
    res.json(ProductController.insert(newProduct))
})

// actualiza un producto
routerProduct.put("/:id", adminMiddleware, (req, res) => {
    const updateProduct = req.body
    const id = +req.params.id
    res.json(ProductController.update(id, updateProduct))
})

// borra un producto
routerProduct.delete("/:id", adminMiddleware, (req, res) => {
    const id = req.params.id
    res.json(ProductController.delete(id))
})


//// carts

// me permite listar todos los productos de un carrito
routerCart.get("/:id/products", (req, res) => {
    const id = req.params.id
    res.json(CartController.getProducts(id))
})

// crea un carrito y devuelve su id
routerCart.post("/", (req, res) => {
    const newCart = req.body
    res.json(CartController.createCart(newCart))
})

// agrega un producto por id al carrito
routerCart.post("/:id/products", (req, res) => {
    const productId = req.params.id
    const cartId = req.body.id
    res.json(CartController.addProduct(cartId, productId))
})

// elimina un producto del carrito por ids
routerCart.delete("/:id/products/:id_prod", (req, res) => {
    const productId = req.params.id_prod
    const cartId = req.params.id
    res.json(CartController.deleteProduct(cartId, productId))
})

// elimina un carrito
routerCart.delete("/:id", (req, res) => {
    const id = req.params.id
    res.json(CartController.deleteCart(id))
})

