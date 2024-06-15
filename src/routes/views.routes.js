import express from 'express';
import passport from 'passport';
import { isValidPasswd } from "../utils/encrypt.js";
import userModel from "../models/users.model.js";
import { generateJWT } from "../utils/jwt.js";

import ProductsModel from "../models/product.model.js"
import CartModel from '../models/carts.model.js';

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", {})
})

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  const findUser = await userModel.findOne({ email });
  //console.log("findUser:", findUser);

  if (!findUser) {
    return res
      .status(401)
      .json({ message: `este usuario no esta registrado` });
  }

  const isValidComparePsw = await isValidPasswd(password, findUser.password);
  if (!isValidComparePsw) {
    return res.status(401).json({ message: `credenciales invalidas` });
  }

  const {
    first_name,
    last_name,
    email: emailDb,
    age,
    role,
    carts,
  } = findUser;

  const token = await generateJWT({
    first_name,
    last_name,
    email: emailDb,
    age,
    role,
    carts,
    id: findUser._id,
  });

  res.cookie('token', token, { httpOnly: true });
  //res.json({ message: 'Login exitoso' });
  res.redirect('profile');
});

const authenticate = passport.authenticate('current', { session: false });
router.get('/profile', authenticate, async (req, res) => {
  const user = req.user;
  res.render('profile', { user: user });
});

router.get('/logout', async (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password, role } = req.body;

    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      age,
      role,
      password: password,
    });

    // TODO: Validar que se creo correctamente
    if (!newUser) {
      // Manejar el error
    }

    //return res.json({ message: `usuario creado`, user: newUser });
    res.redirect('/login');
  } catch (error) {
    console.log("error:", error);
    res.json("error:", error);
  }
});

router.get('/forgotpassword', (req, res) => {
  res.render('forgotpassword');
});

router.get('/updatepassword/:token', (req, res) => {
  const token = req.params.token
  res.render("updatepassword", {
    title: "Practica Integradora 3 - Actualizar contraseña",
    token: token
  })
})


// vista de productos en handlebars con boton comprar
router.get("/products", async (req, res) => {
  const { page = 1, limit = 10, sort, filter } = req.query
  try {

    const sortTogle = (sort) => {
      let srt = parseInt(sort)
      console.log(srt)
      console.log(sort)
      if (sort === undefined) return 1
      else { return srt *= -1 }
    }

    const sorting = sortTogle(sort)

    const response = await ProductsModel.paginate({ filter }, { limit: limit, page: page, sort: { price: sorting } })

    if (page > response.totalPages) {
      return res.json({ status: "failed", message: "LA PAGINA SELECCIONADA NO EXISTE" })
    }

    const cart = await CartModel.create({})

    //Convierto la query de mongo a un objeto javascript plano para que lo pueda leer Handlebars
    const products = response.docs.map(doc => {
      return {
        id: doc._id,
        cart: cart._id,
        title: doc.title,
        description: doc.description,
        category: doc.category,
        thumbnail: doc.thumbnail,
        price: doc.price,
        stock: doc.stock,
        code: doc.code
      }
    })

    //paso el objeto plano al view de handlebars
    res.render("products", {
      title: "Practica Integradora 3",
      docs: products,
      page: response.page,
      sort: sorting,
      nextPage: response.nextPage,
      prevPage: response.prevPage,
      totalPages: response.totalPages,
      hasPrevPage: response.hasPrevPage,
      hasNextPage: response.hasNextPage,
    })

  } catch (error) {
    return res.json({ status: "failed", error: error.message })
  }
});

export default router;