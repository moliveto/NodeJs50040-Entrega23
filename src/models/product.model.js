import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  thumbnail: { type: String, default: 'Sin imagen' },
  status: { type: Boolean, default: true },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'users'
  }
},
  {
    timestamps: true, // Automatically adds timestamps for created/updated at
    strictPopulate: false, // Allows populating paths not specified in the schema
  });

schema.plugin(mongoosePaginate);

schema.pre("find", function () {
  this.populate("users.owner");
});

const collection = "products";
const productModel = mongoose.model(collection, schema);

export default productModel;
