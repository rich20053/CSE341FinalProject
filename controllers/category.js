//const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all categories
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("gardengrow").collection('category').find();
  console.log(result.toArray.length);
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(lists);
    res.status(200).json(lists);
  });
};

// Return one category by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to retrieve a category");
    return;
  }

  const categoryId = new ObjectId(req.params.id);
  const result = await mongodb.getDb().db("gardengrow").collection('category').find({ _id: categoryId });
  result.toArray().then((lists) => {
    if (lists.length != 0) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    } 
    else {
      res.status(200).json("Category not found.");
    } 
  });
};

// Create one category from body json
const createCategory = async (req, res, next) => {

  // Create an category
  const category = {
    name: req.body.name
  };

  // Save category in the database
  const result = await mongodb.getDb().db("gardengrow").collection('category').insertOne(category);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the category.');
  }
};
  
// Update a single category
const updateCategory = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to update a category");
    return;
  }
  
  const categoryId = new ObjectId(req.params.id);

  // Update an category
  const category = {
    name: req.body.name
  };
  
  // Update data in database
  const response = await mongodb.getDb().db("gardengrow").collection('category').replaceOne({ _id: categoryId }, category);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the category.');
  }
}; 

// Delete one category
const deleteCategory = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid category id to update a category");
    return;
  }
  const categoryId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("gardengrow").collection('category').deleteOne({ _id: categoryId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the category.');
  }
};

module.exports = { 
  getAll, 
  getSingle, 
  createCategory, 
  updateCategory, 
  deleteCategory 
};

