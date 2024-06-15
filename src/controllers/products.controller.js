import { productsService } from "../services/index.js"

const getAllProducts = async (req, res) => {
    const products = await productsService.getAll();
    res.send({ status: "success", payload: products })
}

const createProduct = async (req, res) => {
    const product = req.body;
    const newProduct = await productsService.create(product);
    res.send({ status: "success", message: "User created", payload: newProduct })
}

const getProduct = async (req, res) => {
    const prodId = req.params.uid;
    const product = await productsService.getProductById(prodId);
    if (!product) return res.status(404).send({ status: "error", error: "product not found" })
    res.send({ status: "success", payload: product })
}

const updateProduct = async (req, res) => {
    const updateBody = req.body;
    const productId = req.params.uid;
    const Product = await productsService.getUserById(productId);
    if (!Product) return res.status(404).send({ status: "error", error: "product not found" })
    const result = await productsService.update(productId, updateBody);
    res.send({ status: "success", message: "product updated" })
}

const deleteProduct = async (req, res) => {
    const productId = req.params.uid;
    const result = await usersService.delete(productId);
    res.send({ status: "success", message: "product deleted" })
}

const insertManyProducts = async (req, res) => {
    const result = await productsService.insertMany();
    res.send({ status: "success", message: "products inserted" })
}

export default {
    getAllProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    insertManyProducts
}