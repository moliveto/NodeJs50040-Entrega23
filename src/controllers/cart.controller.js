import { cartService } from "../services/index.js"

const addCartCtrl = async (req, res) => {
    const cart = req.body;
    const newcart = await cartService.create(cart);
    res.send({ status: "success", message: "Cart created", payload: newcart })
}

export default {
    addCartCtrl
}