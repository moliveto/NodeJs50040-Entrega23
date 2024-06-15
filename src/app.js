import express from 'express';
import { engine } from "express-handlebars"
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from "passport";
import displayRoutes from "express-routemap";
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from "path"
import { fileURLToPath } from 'url';

import usersRouter from './routes/users.router.js';
import productsRouter from './routes/products.router.js';
import viewsRoutes from './routes/views.routes.js';
import initializePassport from "./config/pasport.config.js";
import { PORT, PERSISTENCE, MONGO_URI } from "./config/config.js";
import { swaggerOpts } from "./config/swagger.config.js";

const connection = mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const specs = swaggerJsDoc(swaggerOpts);
app.use(
    "/docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, { explorer: true })
);

initializePassport();
app.use(passport.initialize());

app.engine("handlebars", engine())
app.set("views", path.join(`${__dirname}/views`))
app.set("view engine", "handlebars")

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use("/", viewsRoutes);

const httpServer = app.listen(PORT, () => {
    displayRoutes(app);
    console.log(`Listening on ${PORT}, enviroment: ${process.env.NODE_ENV} persistence: ${PERSISTENCE}`);
});
