// Plant Controller
const mongodb = require('../models/connect');
const ObjectId = require('mongodb').ObjectId;
const displayPlants = require('../util/displayplants');

// Return all Plants
const getAll = async (req, res, next) => {
  try {
    const result = await mongodb.getDb()
    .collection('plants')
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

// Return one Plant by id
const getSingle = async (req, res, next) => {

  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Plant id to retrieve a Plant");
    return;
  }

  try {
    const plantId = new ObjectId(req.params.id);
    const result = await mongodb.getDb()
      .collection('plants')
      .findOne({ _id: plantId });
      
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ 
      message: 'Error occurred', 
      error: err.message,
    });
  };
};

// Create one Plant from body json
const createPlant = async (req, res, next) => {
  
  try {
    // Use plant id
    //plantId = new ObjectId(req.body.plantId);

    // Create an plant
    const plant = {
      name: req.body.name,
      scientificName: req.body.scientificName,
      categoryId: new ObjectId(req.body.categoryId),
      coldestZone: req.body.coldestZone,
      warmestZone: req.body.warmestZone,
      colors: req.body.colors,
      height: req.body.height,
      space: req.body.space,
      daysToGermination: req.body.daysToGermination,
      daysToFlower: req.body.daysToFlower,
      daysToHarvest: req.body.daysToHarvest
    };

    // Save Plant in the database
    const response = await mongodb.getDb().collection('plants').insertOne(plant);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Plant created successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message:  'An error occurred while creating the Plant.', 
      error: err.message,
    });
  }

};
  
// Update a single Plant
const updatePlant = async (req, res, next) => {

  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Plant id to update a Plant");
    return;
  }

  try {
    // Use plant id
    const plantId = new ObjectId(req.body.plantId);
    const plantStr = req.body.plantId;
    
    // Update an plant
    const plant = {
      $set: {
        name: req.body.name,
        scientificName: req.body.scientificName,
        categoryId: new ObjectId(req.body.categoryId),
        coldestZone: req.body.coldestZone,
        warmestZone: req.body.warmestZone,
        colors: req.body.colors,
        height: req.body.height,
        space: req.body.space,
        daysToGermination: req.body.daysToGermination,
        daysToFlower: req.body.daysToFlower,
        daysToHarvest: req.body.daysToHarvest
      }
    };

    // Update data in database
    const response = await mongodb.getDb().collection('plants').updateOne({ _id: plantId }, plant);
    if (response.acknowledged) {
      res.status(201).json({ message: 'Plant updated successfully ' + plantId + " " + plantStr});
    }
    
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while updating the Plant.', 
      error: err.message,
    });
  }
  
}; 

// Delete one Plant
const deletePlant = async (req, res, next) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid Plant id to update a Plant");
    return;
  }
  
  try {
    const plantId = new ObjectId(req.params.id);
  
    const response = await mongodb.getDb().collection('plants').deleteOne({ _id: plantId }, true);
    if (response.acknowledged) {
      res.status(200).json({ message: 'Plant deleted successfully' });
    }
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while deleting the Plant.', 
      error: err.message,
    });
  }  
};

// Return list of plants by category
const getPlantsByCategoryName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid cpategory must be included to retrieve a plant");
    return;
  }

  try {
    const categoryName = req.params.name;
    
    const regex = new RegExp(categoryName, 'd'); // Case insensitive regex for names 
  
    const collection = mongodb.getDb().collection('category');
  
    const reqCategoryDoc = await collection.findOne({name: regex});
    const reqCategoryId = reqCategoryDoc._id;

    const result = await mongodb.getDb().collection('plants')
      .find({ categoryId: reqCategoryId });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by category name.', 
      error: err.message,
    });
  }
}

// Return list of plants by hardiness zone
const getPlantsByHardinessZone = async (req, res, next) => {
  try {
    const hardinessZone = parseInt(req.params.zone);

    if (hardinessZone < 0 || hardinessZone > 13) {
      res.status(400).json("A valid zone must be included to retrieve a plant");
      return;
    }

    const rangeLowEnd = { coldestZone: { $lte: hardinessZone } }; // First condition
    const rangeHighEnd = { warmestZone: { $gte: hardinessZone } }; // Second condition
    const collection = mongodb.getDb().collection('plants');
    // This works ---- const result = await collection.find({ warmestZone: hardinessZone });
    const result = await collection.find({ $and: [rangeLowEnd, rangeHighEnd] });
  
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    }); 
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by hardiness zone.', 
      error: err.message,
    });
  }

};

// Return list of plants by name
const getPlantsByName = async (req, res, next) => {
  try {
    if (req.params.name.length == 0) {
      res.status(400).json("A valid name must be included to retrieve a plant");
      return;
    }

    const plantName = req.params.name;

    const regex = new RegExp(plantName, 'd'); // Case insensitive regex for names 
  
    const result = await mongodb.getDb().collection('plants').find({ name: regex });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by name.', 
      error: err.message,
    });
  }

};

// Return list of plants by scientific name
const getPlantsByScientificName = async (req, res, next) => {

  try {
    if (req.params.name.length == 0) {
      res.status(400).json("A valid scientific name must be included to retrieve a plant");
      return;
    }

    const plantName = req.params.name;

    const regex = new RegExp(plantName, 'd'); // Case insensitive regex for names 
  
    const result = await mongodb.getDb().collection('plants').find({ scientificName: regex });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by scientific name.', 
      error: err.message,
    });
  }

};

// Return list of plants by color
const getPlantsByColor = async (req, res, next) => {
  try {
    if (req.params.color.length == 0) {
      res.status(400).json("A valid color must be included to retrieve a plant");
      return;
    }

    const plantColor = req.params.color;

    const regex = new RegExp(plantColor, 'd'); // Regular Expression for colors 
  
    //const books = await collection.find({ authors: { $elemMatch: { name: 'John Doe' } } }).toArray();
 
    const result = await mongodb.getDb().collection('plants').find({ colors: regex });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by color.', 
      error: err.message,
    });
  }

};

// Return list of plants ordered by height
const getPlantsOrderedByHeight = async (req, res, next) => {

  try {
    if (req.params.direction != 1 && req.params.direction != -1) {
      res.status(400).json("A valid direction must be included to order plants.");
      return;
    }

    const direction = parseInt(req.params.direction);

    //const products = await collection.find().sort({ price: 1 }).toArray();
    //const products = await collection.find().sort({ price: 1, name: -1 }).toArray();
    const result = await mongodb.getDb().collection('plants').find().sort({ height: direction });

    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants ordered by height.', 
      error: err.message,
    });
  }

};

// Return list of plants by height
const getPlantsByHeight = async (req, res, next) => {
  try {
    if (req.params.height.length == 0) {
      res.status(400).json("A valid height must be included to retrieve a plant");
      return;
    }

    const plantHeight = parseInt(req.params.height);

    const result = await mongodb.getDb().collection('plants').find({ height: plantHeight });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by height.', 
      error: err.message,
    });
  }

};

// Return list of plants by height range
const getPlantsByHeightRange = async (req, res, next) => {
  try {
    if (req.params.lowheight.length == 0 || req.params.topheight.length == 0) {
      res.status(400).json("two valid heights must be included to retrieve a plant");
      return;
    }

    const plantLowHeight = parseInt(req.params.lowheight);
    const plantTopHeight = parseInt(req.params.topheight);

    //const products = await collection.find({ price: { $gte: minPrice, $lte: maxPrice } }).toArray();
    
    const result = await mongodb.getDb().collection('plants').find({ height: { $gte: plantLowHeight, $lte: plantTopHeight } });
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by height.', 
      error: err.message,
    });
  }

};

// Return list of plants ordered by days to germination
const getPlantsOrderedByDaysToGermination = async (req, res, next) => {
  try {
    if (req.params.direction != 1 && req.params.direction != -1) {
      res.status(400).json("A valid direction must be included to order plants.");
      return;
    }

    const direction = parseInt(req.params.direction);

    //const products = await collection.find().sort({ price: 1, name: -1 }).toArray();
    const result = await mongodb.getDb().collection('plants').find().sort({ daysToGermination: direction });

    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by height.', 
      error: err.message,
    });
  }

};

// Return list of plants ordered by days to flower
const getPlantsOrderedByDaysToFlower = async (req, res, next) => {
  try {
    if (req.params.direction != 1 && req.params.direction != -1) {
      res.status(400).json("A valid direction must be included to order plants.");
      return;
    }

    const direction = parseInt(req.params.direction);

    const result = await mongodb.getDb().collection('plants').find().sort({ daysToFlower: direction });

    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by height.', 
      error: err.message,
    });
  }

};

// Return list of plants ordered by days to harvest
const getPlantsOrderedByDaysToHarvest = async (req, res, next) => {
  try {
    if (req.params.direction != 1 && req.params.direction != -1) {
      res.status(400).json("A valid direction must be included to order plants.");
      return;
    }

    const direction = parseInt(req.params.direction);

    const result = await mongodb.getDb().collection('plants').find().sort({ daysToHarvest: direction });

    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by height.', 
      error: err.message,
    });
  }

};

// Return all plants and print out full detail
const getAllFull = async (req, res, next) => {

  try {
     const result = await mongodb.getDb()
     .collection('plants')
     .find();
    await result.toArray().then(async (lists) => {
      res.setHeader('Content-Type', 'text/html');
      const headers = res.headers;
      var allPlants = await displayPlants.plantHTML(lists);
      res.status(200);
      res.send(allPlants);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting all Plants and displaying a full display.', 
      error: err.message
    });
  }  
};

// Return one plant by id and print out full detail
const getSingleFull = async (req, res, next) => {
  
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid plant id to retrieve a plant");
    return;
  }

  try {
    const plantId = new ObjectId(req.params.id);

    const result = await mongodb.getDb()
       .collection('plants')
       .find({ _id: plantId });
    plantList = result.toArray().then(async (plantList) => {
      res.setHeader('Content-Type', 'text/html');
      var allPlants = await displayPlants.plantHTML(plantList);
      res.status(200);
      res.send(allPlants);
    });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting all Plants and displaying a full display.', 
      error: err.message
    });
  }  
};

// Return list of plants by category in html format
const getFullPlantsByCategoryName = async (req, res, next) => {
  if (req.params.name.length == 0) {
    res.status(400).json("A valid cpategory must be included to retrieve a plant");
    return;
  }

  try {
    const categoryName = req.params.name;
    
    const regex = new RegExp(categoryName, 'd'); // Case insensitive regex for names 
  
    const collection = mongodb.getDb().collection('category');
  
    const reqCategoryDoc = await collection.findOne({name: regex});
    const reqCategoryId = reqCategoryDoc._id;

    const result = await mongodb.getDb()
    .collection('plants')
    .find({ categoryId: reqCategoryId });
   await result.toArray().then(async (lists) => {
     res.setHeader('Content-Type', 'text/html');
     const headers = res.headers;
     var allPlants = await displayPlants.plantHTML(lists);
     res.status(200);
     res.send(allPlants);
   });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by category name.', 
      error: err.message,
    });
  }
}

// Return list of plants by color in html format
const getFullPlantsByColor = async (req, res, next) => {
  try {
    if (req.params.color.length == 0) {
      res.status(400).json("A valid color must be included to retrieve a plant");
      return;
    }

    const plantColor = req.params.color;

    const regex = new RegExp(plantColor, 'd'); // Regular Expression for colors 

    const result = await mongodb.getDb()
    .collection('plants')
    .find({ colors: regex });
   await result.toArray().then(async (lists) => {
     res.setHeader('Content-Type', 'text/html');
     const headers = res.headers;
     var allPlants = await displayPlants.plantHTML(lists);
     res.status(200);
     res.send(allPlants);
   });
  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by color.', 
      error: err.message,
    });
  }
}

  // Return list of plants by name in html
const getFullPlantsByName = async (req, res, next) => {
  try {
    if (req.params.name.length == 0) {
      res.status(400).json("A valid name must be included to retrieve a plant");
      return;
    }

    const plantName = req.params.name;

    const regex = new RegExp(plantName, 'd'); // Case insensitive regex for names 
  
    const result = await mongodb.getDb().collection('plants')
    .find({ name: regex });
    /*
    result.toArray().then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
*/
    await result.toArray().then(async (lists) => {
      res.setHeader('Content-Type', 'text/html');
      const headers = res.headers;
      var allPlants = await displayPlants.plantHTML(lists);
      res.status(200);
      res.send(allPlants);
    });
 

  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by name.', 
      error: err.message,
    });
  }

};

// Return list of plants by hardiness zone
const getFullPlantsByHardinessZone = async (req, res, next) => {
  try {
    const hardinessZone = parseInt(req.params.zone);

    if (hardinessZone < 0 || hardinessZone > 13) {
      res.status(400).json("A valid zone must be included to retrieve a plant");
      return;
    }

    const rangeLowEnd = { coldestZone: { $lte: hardinessZone } }; // First condition
    const rangeHighEnd = { warmestZone: { $gte: hardinessZone } }; // Second condition
    const collection = mongodb.getDb().collection('plants');
    // This works ---- const result = await collection.find({ warmestZone: hardinessZone });
    const result = await collection.find({ $and: [rangeLowEnd, rangeHighEnd] });
  
    await result.toArray().then(async (lists) => {
      res.setHeader('Content-Type', 'text/html');
      const headers = res.headers;
      var allPlants = await displayPlants.plantHTML(lists);
      res.status(200);
      res.send(allPlants);
    });
 


  } catch (err) {
    res.status(400).json({ 
      message: 'An error occurred while getting plants by hardiness zone.', 
      error: err.message,
    });
  }

};

module.exports = { 
  getAll, 
  getSingle, 
  createPlant, 
  updatePlant, 
  deletePlant, 
  getPlantsByCategoryName,
  getPlantsByName,
  getPlantsByScientificName,
  getPlantsByColor,
  getPlantsByHardinessZone,
  getPlantsOrderedByHeight,
  getPlantsByHeight,
  getPlantsByHeightRange,
  getPlantsOrderedByDaysToGermination,
  getPlantsOrderedByDaysToFlower,
  getPlantsOrderedByDaysToHarvest,
  getAllFull,
  getSingleFull,
  getFullPlantsByCategoryName,
  getFullPlantsByColor,
  getFullPlantsByName,
  getFullPlantsByHardinessZone
};

