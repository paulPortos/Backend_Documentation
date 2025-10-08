const mongoose = require('mongoose');

/**
 * ITEMS MODEL - Blueprint for rental items in the database
 * 
 * This defines the structure for items that users can rent out,
 * like vehicles, apartments, equipment, etc.
 */
const itemSchema = new mongoose.Schema({
  // Picture file path for the item
  picture: {
    type: String,
    required: [true, 'Picture is required'],
    trim: true
  },
  
  // Name/title of the item
  item_name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [200, 'Item name cannot exceed 200 characters']
  },
  
  // Optional description of the item
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
    default: ''
  },
  
  // Category of the item
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Vehicle', 'Apartment', 'Equipment'],
      message: 'Category must be Vehicle, Apartment, or Equipment'
    }
  },
  
  // Price for renting the item
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Location where the item is available
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [300, 'Location cannot exceed 300 characters']
  },
  
  // Whether the item is disabled/hidden
  disable: {
    type: Boolean,
    default: false
  },
  
  // When the item was uploaded
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
  // Reference to the user who uploaded this item
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Index for better search performance
itemSchema.index({ category: 1, location: 1, disable: 1 });
itemSchema.index({ uploadedBy: 1 });
itemSchema.index({ item_name: 'text', description: 'text' }); // Text search

/**
 * HIDE SENSITIVE DATA
 * Don't include sensitive fields in JSON responses
 */
itemSchema.methods.toJSON = function() {
  const itemObject = this.toObject();
  return itemObject;
};

module.exports = mongoose.model('Item', itemSchema);