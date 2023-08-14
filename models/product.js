const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    imageUrl: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//   constructor(title, price, description, imageUrl, id, userId) {
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this._id = id ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   async save() {
//     const db = getDb();
//     try {
//       let dbOp;
//       if (this._id) {
//         //update the product
//         dbOp = await db
//           .collection('products')
//           .updateOne({ _id: this._id }, { $set: this });
//       } else {
//         dbOp = await db
//           .collection('products')
//           .insertOne(this);
//       }
//       const result = await dbOp;
//       console.log(result);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async fetchAll() {
//     const db = getDb();
//     try {
//       const products = await db
//         .collection('products')
//         .find()
//         .toArray();
//       console.log(products);
//       return products;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async findById(prodId) {
//     const db = getDb();
//     try {
//       const product = await db
//         .collection('products')
//         .find({ _id: new mongodb.ObjectId(prodId) })
//         .next();
//       console.log(product);
//       return product;
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   static async deleteById(prodId) {
//     let db = getDb();
//     try {
//       const result = await db
//         .collection('products')
//         .deleteOne({ _id: new mongodb.ObjectId(prodId) });
//       console.log('DELETED');
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = Product;