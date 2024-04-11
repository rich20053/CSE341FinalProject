
// CareType Controller
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all categories
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb()
    .collection('caretype')
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

// Return one CareType by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid CareType id to retrieve a CareType");
    return;
  }

  try {
    const careTypeId = new ObjectId(req.params.id);
    const result = await mongodb.getDb()
      .collection('caretype')
      .findOne({ _id: careTypeId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message
    });
  };
};

// Create one CareType from body json
const createCareType = async (req, res, next) => {
  
  try {
    // Create an CareType
    const CareType = {
      name: req.body.name
    };

    // Save CareType in the database
    const response = await mongodb.getDb().collection('caretype').insertOne(CareType);

    if (response.acknowledged) {
      res.status(201).json({ message: 'CareType created successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message:  'An error occurred while creating the CareType.', 
      error: err.message,
    });
  }

};
  
// Update a single CareType
const updateCareType = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid CareType id to update a CareType");
    return;
  }

  try {
    const careTypeId = new ObjectId(req.params.id);

    // Update an CareType
    const careType = {
      $set: {
        name: req.body.name
      }
    };

    // Update data in database
    const response = await mongodb.getDb().collection('caretype').updateOne({ _id: careTypeId }, careType);
    if (response.acknowledged) {
      res.status(201).json({ message: 'CareType updated successfully' });
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while updating the CareType.', 
      error: err.message,
    });
  }
  
}; 

// Delete one CareType
const deleteCareType = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid CareType id to update a CareType");
    return;
  }
  
  try {
    const CareTypeId = new ObjectId(req.params.id);
  
    const response = await mongodb.getDb().collection('caretype').deleteOne({ _id: CareTypeId }, true);
    if (response.acknowledged) {
      res.status(200).json({ message: 'CareType deleted successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while deleting the CareType.', 
      error: err.message,
    });
  }  
};

module.exports = { 
  getAll, 
  getSingle, 
  createCareType, 
  updateCareType, 
  deleteCareType 
};
