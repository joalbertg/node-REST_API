const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductsSchema = new Schema({
    name: {
      type: String,
      required: [true, 'Required name']
    },
    unitPrice: {
      type: Number,
      required: [true, 'Required unit price']
    },
    description: {
      type: String,
      required: false
    },
    available: {
      type: Boolean,
      required: true,
      default: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});

module.exports = mongoose.model('Product', ProductsSchema);

