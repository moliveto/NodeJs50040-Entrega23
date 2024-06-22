import passport from "passport";
import { productsService } from "../services/index.js"

function handlePolicies(policies) {
  return (req, res, next) => {
    // Verificar si la única política es "public"
    if (policies.length === 1 && policies[0] === "public") {
      return next();
    }

    // Usar Passport para autenticar al usuario y verificar el rol
    passport.authenticate("jwt", { session: false }, (err, userJWT, info) => {
      console.log(
        "🚀 ~ file: handle-policies.middleware.js:12 ~ passport.authenticate ~ userJWT:",
        userJWT
      );
      if (err) {
        return next(err);
      }

      if (!userJWT) {
        return res
          .status(401)
          .send({ message: "Acceso denegado. Token inválido o expirado." });
      }

      if (policies.includes(userJWT.user.role)) {
        req.user = userJWT;
        return next();
      } else {
        return res
          .status(403)
          .send({ message: "Acceso denegado. Rol no autorizado." });
      }
    })(req, res, next);
  };
}

function productMdwPremium(req, res, next) {
  passport.authenticate("jwt", { session: false }, async (err, userJWT, info) => {
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
  handlePolicies,
  productMdwPremium,
}