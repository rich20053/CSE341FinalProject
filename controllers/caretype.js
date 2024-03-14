const { isNull } = require('util');
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all care types
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().db("gardengrow").collection('caretype').find({"artist_id": artistId});
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};  

// Return one care type by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care type id to retrieve a care type");
    return;
  }

  const caretypeId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().db("gardengrow").collection('caretype').find({ _id: caretypeId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Create one care type from body json
const createCareType = async (req, res, next) => {

  // Create a care type
  const caretype = {
    name: req.body.name
  }

  // Save care type in the database
  const result = await mongodb.getDb().db("gardengrow").collection('caretype').insertOne(caretype);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the care type.');
  }
};
  
// Update a single care type
const updateCareType = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care type id to update a care type.");
    return;
  }
  
  const caretypeId = new ObjectId(req.params.id);

  // Update a care type
  const caretype = {
    name: req.body.name
  }
  
  // Update data in database
  const response = await mongodb.getDb().db("gardengrow").collection('caretype').replaceOne({ _id: caretypeId }, caretype);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the care type.');
  }
}; 

// Delete one care type
const deleteCareType = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care type id to update a care type.");
    return;
  }

  const caretypeId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().db("gardengrow").collection('caretype').deleteOne({ _id: caretypeId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the care type.');
  }
};
  
module.exports = { 
    getAll,
    getSingle, 
    createCareType, 
    updateCareType, 
    deleteCareType 
  };

