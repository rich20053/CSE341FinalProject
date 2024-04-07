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
      name: req.body.name
    };

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
      name: req.body.name
    };

    // Update data in database
    const response = await mongodb.getDb().collection('care').replaceOne({ _id: careId }, care);
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
  
  try {
    const collection = await mongodb.getDb().collection('plants');
  
    const reqPlantDoc = await collection.findOne({name: plantName});
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
  
  try {
    const collection = mongodb.getDb().collection('caretype');
  
    const reqTypeDoc = await collection.findOne({name: typeName});
    const reqTypeId = reqTypeDoc._id;
    console.log(typeName);
    console.log(reqTypeId);
    const result = await mongodb.getDb()
      .collection('care')
      .find({ careTypeId: reqTypeId })
      .toArray();
    result.toArray().then((lists) => {
      //res.setHeader('Content-Type', 'application/json');
      //res.status(200).json(lists);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result);  
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting Care by Plant name.', 
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
/*// Care Controller
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;

// Return all cares
const getAll = async (req, res, next) => {
  
  const result = await mongodb.getDb().collection('care').find();
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });
};

// Return one care by id
const getSingle = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care id to retrieve a care");
    return;
  }

  const careId = new ObjectId(req.params.id);

  const result = await mongodb.getDb().collection('care').find({ _id: careId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists[0]);
  });
};

// Create one care from body json
const createCare = async (req, res, next) => {

  // Create a care
  const care = {
    plantId: new ObjectId(req.body.plantId),
    careTypeId: new ObjectId(req.body.careTypeId),
    description: req.body.description
  }

  // Save care in the database
  const result = await mongodb.getDb().collection('care').insertOne(care);

  if (result.acknowledged) {
    res.status(201).json(result);
  } else {
    res.status(500).json(result.error || 'An error occurred while creating the care.');
  }
};
  
// Update a single care
const updateCare = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care id to update a care");
    return;
  }
  
  const careId = new ObjectId(req.params.id);

  // Update a care
  const care = {
    plantId: new ObjectId(req.body.plantId),
    careTypeId: new ObjectId(req.body.careTypeId),
    description: req.body.description
  }
  
  // Update data in database
  const response = await mongodb.getDb().collection('care').replaceOne({ _id: careId }, care);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while updating the care.');
  }
}; 

// Delete one care
const deleteCare = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid care id to update a care");
    return;
  }

  const careId = new ObjectId(req.params.id);
  
  const response = await mongodb.getDb().collection('care').deleteOne({ _id: careId }, true);
  if (response.deletedCount > 0) {
    res.status(200).send();
  } else {
    res.status(500).json(response.error || 'An error occurred while deleting the care.');
  }
};

// Return list of cares by plant name
const getCareByPlantName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid plant must be included to retrieve a care");
    return;
  }

  const plantName = req.params.name;
  
  const collection = mongodb.getDb().collection('plants');
  
  const reqPlantDoc = await collection.findOne({name: plantName});
  const reqPlantId = reqPlantDoc._id;
  
  const result = await mongodb.getDb().collection('care').find({ plantId: reqPlantId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });

};

// Return list of cares by type name
const getCareByTypeName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid type must be included to retrieve a care");
    return;
  }

  const typeName = req.params.name;
  
  const collection = mongodb.getDb().collection('caretype');
  
  const reqTypeDoc = await collection.findOne({name: typeName});
  const reqTypeId = reqTypeDoc._id;
  
  const result = await mongodb.getDb().collection('care').find({ careTypeId: reqTypeId });
  result.toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  });

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
*/
