const { Router } = require('express');
const { cartModel } = require('../models/cart.model');
const { productModel } = require('../models/product.model');
const router = Router();

//Crear carrito
router.post("/api/cart", async (req, res) => {
    let {title} = req.body;
    const result = await cartModel.create({title});
    res.send({ result: "Success", payload: result });
})

//Agregando un producto al carrito con la cantidad deseada.
router.put("/api/cart/:cid/products/:pid", async (req, res) => {
    try {
        let { cid } = req.params;
        let { pid } = req.params;
        let { quantity } = req.body;

        //Buscamos carrito por su ID
        let cart = await cartModel.findById({_id: cid}).populate("products.product");
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id proporcionado no existe` })
        }

        //Buscamos producto por su ID.
        let product = await productModel.findById({ _id: pid });
        if (!product) {
            res.status(404).json({ error: `El producto con el id proporcionado no existe` })
        }

        //Validamos la existencia del producto en el carrito
        const foundProductInCart = cart.products.find((p) => {
            return p.product_sku === pid
        })

        //Si existe le actualizamos la cantidad enviada por body.
        //Si no existe pusheamos el nuevo producto con la cantidad enviada por body.
        const indexProduct = cart.products.findIndex((p) => p.product_sku === pid)
        if (foundProductInCart) {
            cart.products[indexProduct].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity: quantity, product_sku: pid });
        }
        
        //Actualizamos las modificaciones del carrito.
        await cartModel.updateOne({ _id:cid}, cart);

        //Presentación
        console.log(JSON.stringify(cart, null, '\t'));
        res.send({ result: "Success", payload: cart });

    } catch (error) {
        res.send({ status: error, error: "Error al agregar producto al carrito." });
    }
})


//Eliminar un producto del carrito
router.delete("/api/cart/:cid", async (req, res) => {
    try {
        let { cid } = req.params;
        let { pid } = req.params;
    
        //Buscamos carrito por su ID
        let cart = await cartModel.findById({ _id: cid });
        if (!cart) {
            res.status(404).json({ error: `El carrito con el id proporcionado no existe` })
        }

        //Vaciamos el array products del carrito.
        cart.products = cart.products.slice(cart.products.length);

        //Actualizamos las modificaciones del carrito.
        let result = await cartModel.updateOne({ _id: cid }, cart);
        console.log(JSON.stringify(cart, null, '\t'));
        res.send({ result: "Success", payload: result });

        
    } catch (error) {
        res.status(404).json({ error: `Error al eliminar un producto.` })
    }

})


module.exports = router;