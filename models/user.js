const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    cart: {
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true }
            }
        ]
    }
});

userSchema.methods.addToCart = async function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }
    const updatedCart = { items: updatedCartItems };
    this.cart = updatedCart;
    try {
        await this
            .save();
    } catch (err) {
        console.log(err);
    }
}

userSchema.methods.deleteItemFromCart = async function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    try {
        await this
            .save();
    } catch (err) {
        console.log(err);
    }
}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    this.save();
}

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// const ObjectId = mongodb.ObjectId;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // {items: []}
//     this._id = id;
//   }

//   async save() {
//     const db = getDb();
//     try {
//       const result = await db
//         .collection('users')
//         .insertOne(this);
//       console.log(result);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity
//       });
//     }
//     const updatedCart = { items: updatedCartItems };
//     const db = getDb();
//     try {
//       await db
//         .collection('users')
//         .updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => {
//       return i.productId;
//     });
//     try {
//       const products = await db
//         .collection('products')
//         .find({ _id: { $in: productIds } })
//         .toArray();

//       return products.map(p => {
//         return {
//           ...p,
//           quantity: this.cart.items.find(i => {
//             return i.productId.toString() === p._id.toString();
//           }).quantity
//         };
//       });
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     });
//     const db = getDb();
//     try {
//       await db
//         .collection('users')
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: updatedCartItems } } }
//         );
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   async addOrder() {
//     const db = getDb();
//     try {
//       const products = await this.getCart();
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       };

//       const orderResult = await db
//         .collection('orders')
//         .insertOne(order);

//       this.cart = { items: [] };
//       const userResult = await db
//         .collection('users')
//         .updateOne(
//           { _id: new ObjectId(this._id) },
//           { $set: { cart: { items: [] } } }
//         );
//       console.log(orderResult, userResult);
//     } catch (err) {
//       console.log(err);
//     }
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray();
//   }

//   static async findById(userId) {
//     const db = getDb();
//     try {
//       const user = db
//         .collection('users')
//         .findOne({ _id: new ObjectId(userId) });
//       console.log(user);
//       return user;
//     } catch (err) {
//       console.log(err);
//     }
//   }
// }

// module.exports = User;
