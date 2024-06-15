import producModel from "../models/product.model.js";
import { getAllProductsFromJson } from '../data/product-data.js';

export default class Products {

    get = (params) => {
        return producModel.find(params);
    }

    getBy = (params) => {
        return producModel.findOne(params);
    }

    save = (doc) => {
        return producModel.create(doc);
    }

    update = (id, doc) => {
        return producModel.findByIdAndUpdate(id, { $set: doc })
    }

    delete = (id) => {
        return producModel.findByIdAndDelete(id);
    }

    async InsertMany() {
        try {
            const productsData = await getAllProductsFromJson();
            const result = await producModel.insertMany(productsData);
            return result;
        } catch (error) {
            throw new Error(`Error en insersion masiva de productos ${error}`);
        }
    }
}