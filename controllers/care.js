// Care Controller
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all categories
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb()
    .collection('care')
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

// Return one Care by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Care id to retrieve a Care");
    return;
  }

  try {
    const careId = new ObjectId(req.params.id);
    const result = await mongodb.getDb()
      .collection('care')
      .findOne({ _id: careId });
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  };
};

// Create one Care from body json
const createCare = async (req, res, next) => {
  
  try {
    // Create an Care
    const care = {
      plantId: new ObjectId(req.body.plantId),
      careTypeId: new ObjectId(req.body.careTypeId),
      description: req.body.description
    }
    // Save Care in the database
    const response = await mongodb.getDb().collection('care').insertOne(care);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Care created successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message:  'An error occurred while creating the Care.', 
      error: err.message,
    });
  }

};
  
// Update a single Care
const updateCare = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Care id to update a Care");
    return;
  }

  try {
    const careId = new ObjectId(req.params.id);

    // Update an Care
    const care = {
      plantId: new ObjectId(req.body.plantId),
      careTypeId: new ObjectId(req.body.careTypeId),
      description: req.body.description
    }
    // Update data in database
    const response = await mongodb.getDb().collection('care').updateOne({ _id: careId }, care);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Care updated successfully' });
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while updating the Care.', 
      error: err.message,
    });
  }
  
}; 

// Delete one Care
const deleteCare = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Care id to update a Care");
    return;
  }
  
  try {
    const careId = new ObjectId(req.params.id);
  
    const response = await mongodb.getDb().collection('care').deleteOne({ _id: careId }, true);
    if (response.acknowledged) {
      res.status(200).json({ message: 'Care deleted successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while deleting the Care.', 
      error: err.message,
    });
  }  
};

// Return list of cares by plant name
const getCareByPlantName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid plant must be included to retrieve a care");
    return;
  }

  const plantName = req.params.name;
  const regex = new RegExp(plantName, 'd'); // Case insensitive regex for names 
  
  try {
    const collection = await mongodb.getDb().collection('plants');
  
    const reqPlantDoc = await collection.findOne({name: regex});
    const reqPlantId = reqPlantDoc._id;
  
    const result = await mongodb.getDb().collection('care').find({ plantId: reqPlantId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting Care by Plant name.', 
      error: err.message
    });
  }  
};

// Return list of cares by type name
const getCareByTypeName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid type must be included to retrieve a care");
    return;
  }

  const typeName = req.params.name;
  const regex = new RegExp(typeName, 'd'); // Case insensitive regex for names 
  
  try {
    const collection = mongodb.getDb().collection('caretype');
  
    const reqTypeDoc = await collection.findOne({name: regex});
    const reqTypeId = new ObjectId(reqTypeDoc._id);
    const result = await mongodb.getDb()
      .collection('care')
      .find({ careTypeId: reqTypeId })
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);  
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting Care by Type name.', 
      error: err.message
    });
  }  

};

module.exports = { 
  getAll, 
  getSingle, 
  createCare, 
  updateCare, 
  deleteCare,
  getCareByPlantName,
  getCareByTypeName  
};

