// Category Controller
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all categories
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb()
    .collection('category')
    .find()
    .toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  }  
};

// Return one category by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to retrieve a category");
    return;
  }

  try {
    const categoryId = new ObjectId(req.params.id);
    const result = await mongodb.getDb()
      .collection('category')
      .findOne({ _id: categoryId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  };
};

// Create one category from body json
const createCategory = async (req, res, next) => {
  
  try {
    // Create an category
    const category = {
      name: req.body.name
    };

    // Save category in the database
    const response = await mongodb.getDb().collection('category').insertOne(category);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Category created successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message:  'An error occurred while creating the category.', 
      error: err.message,
    });
  }

};
  
// Update a single category
const updateCategory = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to update a category");
    return;
  }

  try {
    const categoryId = new ObjectId(req.params.id);

    // Update an category
    const category = {
      name: req.body.name
    };

    // Update data in database
    const response = await mongodb.getDb().collection('category').replaceOne({ _id: categoryId }, category);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Category updated successfully' });
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while updating the category.', 
      error: err.message,
    });
  }
  
}; 

// Delete one category
const deleteCategory = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to update a category");
    return;
  }
  
  try {
    const categoryId = new ObjectId(req.params.id);
  
    const response = await mongodb.getDb().collection('category').deleteOne({ _id: categoryId }, true);
    if (response.acknowledged) {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while deleting the category.', 
      error: err.message,
    });
  }  
};

module.exports = { 
  getAll, 
  getSingle, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};

