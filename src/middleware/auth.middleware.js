import passport from "passport";
import { productsService } from "../services/index.js"

function authMdw(role) {
  return (req, res, next) => {

    if (role.length === 1 && role[0] === "PUBLIC") {
      return next();
    }

    passport.authenticate("current", { session: false }, (err, userJWT, info) => {
      if (err) {
        return next(err)
      }

      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Acceso denegado. Token inválido o expirado." });
      }

      const currentRole = userJWT.role
      if (!role.includes(currentRole)) {
        return res
          .status(401)
          .send({ message: "Acceso denegado. Rol no autorizado." });
      }
      req.user = userJWT
      return next()
    })(req, res, next)
  }
}

function productMdwPremium(req, res, next) {
  passport.authenticate("current", { session: false }, async (err, userJWT, info) => {
    const currentRole = userJWT.role
    const userId = userJWT._id
    const isUserPremiumAndAdmin = currentRole === 'premium' || currentRole === "admin"
    const product = await productsService.getProductById(req.params.pid);
    const productIsFromOwner = product.owner === userId

    if (err) {
      return next(err)
    }

    if (!userJWT) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. Token inválido o expirado." });
    }

    if (!isUserPremiumAndAdmin) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. No tienes permiso" });
    }

    if (currentRole === 'premium' && !productIsFromOwner) {
      return res
        .status(401)
        .send({ message: "Acceso denegado. Este producto no te pertenece" });
    }

    req.user = userJWT
    return next()
  })(req, res, next)
}

export {
  authMdw as handlePolicies,
  productMdwPremium,
}