//Externals
const { 
    getAll, 
    getSingle, 
    createPlant, 
    updatePlant, 
    deletePlant 
  } = require('../controllers/plants');
  const mongodb = require('../models/connect');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const ObjectId = require('mongodb').ObjectId;
  const { plantCheck } = require('../middleware/validation');
  
    // Test Plants data
    const testPlantsData = [
        {
          "_id": "65f2708ad22b76d6ea65e7f8",
          "name": "tulip",
          "scientificName": "tulipa",
          "categoryId": "65f2658ad22b76d6ea65e7f4",
          "coldestZone": 3,
          "warmestZone": 7,
          "colors": [
            "Red",
            "Yellow",
            "Pink"
          ],
          "height": 28,
          "space": 5,
          "daysToGermination": 84,
          "daysToFlower": 112,
          "daysToHarvest": 180
        },
        {
          "_id": "65f5d8b13f7caaee850e6cb6",
          "name": "Petunia",
          "scientificName": "Petunia integrifolia",
          "categoryId": "65f2658ad22b76d6ea65e7f4",
          "coldestZone": 3,
          "warmestZone": 11,
          "colors": [
            "Purple",
            "Pink",
            "Blue"
          ],
          "height": 10,
          "space": 12,
          "daysToGermination": 10,
          "daysToFlower": 75,
          "daysToHarvest": 84
        },
        {
          "_id": "660261fc6d25f2b0a3b12a4e",
          "name": "Burbank Russet Potato",
          "scientificName": "Solanum tuberosum",
          "categoryId": "65f507ffbff26de7fd7c9e25",
          "coldestZone": 3,
          "warmestZone": 10,
          "colors": [
            "White"
          ],
          "height": 30,
          "space": 22,
          "daysToGermination": 28,
          "daysToFlower": 75,
          "daysToHarvest": 130
        }
      ];
  
    const testPlantsId = new ObjectId();
  
      // Test request and response objects
      const req = {
        params: { id: testPlantsId },
        body: testPlantsData   
      };
    
      let res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    
      let mongoServer;
  
        // ALL TESTS FOR THE Plants.js CONTROLLERS
    describe('Plants Controller', () => {
      beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        mongodb.initDb = jest.fn().mockResolvedValue(mongoServer.getUri());
        await mongodb.initDb();
      });
  
      beforeEach(() => {
        // Reset or reinitialize the res object before each test
        res = {
          setHeader: jest.fn(),
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
        };
      });
  
      // 
      // Tests Plants getAll
      //  Successful getAll
      test('Plants getAll should retrieve all categories and return status 200', async () => {
        const testToArray = jest.fn().mockResolvedValue(testPlantsData);
        const testFind = jest.fn().mockReturnThis();
        mongodb.initDb;
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({ 
            find: testFind,
            toArray: testToArray
          })
        });
        // Create a test request object
        const req = {}; 
  
        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testPlantsData);
      });
  
      //  Plants getAll error handling
      test('Plants getAll should return status 400 if error occurs', async () => {
        const testToArray = jest.fn().mockRejectedValue(new Error('Test error'));
        const testFind = jest.fn().mockReturnThis();
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({
            find: testFind,
            toArray: testToArray
          })
        });
      
        await getAll(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Test error' });
      });
      
      // TESTS FOR Plants getSingle
      //  Successful Plants getSingle
      test('Plants getSingle should retrieve a Plants and return status 200', async () => {
        const testFindOne = jest.fn().mockResolvedValue(testPlantsData[0]);
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({ 
            findOne: testFindOne })
        });
        const req = { params: { id: testPlantsData[0]._id } };
    
        await getSingle(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testPlantsData[0]);
      });
    
      // Plants getSingle error handling
      test('Plants getSingle should return status 400 if error occurs', async () => {
        const testFindOne = jest.fn().mockRejectedValue(new Error('Test error'));
        mongodb.getDb = jest.fn().mockReturnValue({ 
          collection: jest.fn().mockReturnValue({ 
            findOne: testFindOne 
          }) 
        });
     
        await getSingle(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Error occurred', error: 'Test error' });
      });
      
      
      // TESTS FOR createPlants
      // Successful createPlants
      test('Should create a Plants and return 201 status', async () => {
        const req = {
          body:  {
            "name": "Petunia",
            "scientificName": "Petunia integrifolia",
            "categoryId": "65f2658ad22b76d6ea65e7f4",
            "coldestZone": 3,
            "warmestZone": 11,
            "colors": [
              "Purple",
              "Pink",
              "Blue"
            ],
            "height": 10,
            "space": 12,
            "daysToGermination": 10,
            "daysToFlower": 75,
            "daysToHarvest": 84
          }
        
        };
      
        const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: testInsertOne
        });
      
        await createPlant(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Plant created successfully' });
      });
      
      // Validation Failure
      test('Should return 412 status if fields do not validate.', async () => {
        const req = {
            body:  {
                "name": "Petunia",
                "scientificName": "Petunia integrifolia",
                "categoryId": "65f2658ad22b76d6ea65e7f4",
                "coldestZone": 3,
                "warmestZone": 11,
                "colors": [
                  "Purple",
                  "Pink",
                  "Blue"
                ],
                "height": 10,
                "space": 12,
                "daysToGermination": 10,
                "daysToFlower": 75,
                "daysToHarvest": 84
              }                    
          };
      
        const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: testInsertOne
        });
      
        await plantCheck(req, res);
        expect(res.status).toHaveBeenCalledWith(412);
      });
  
    // TESTS FOR updatePlants
    test('Should update a Plants and return 201 status', async () => {
      const req = {
        params: { id: testPlantsData[0]._id.toString() },
        body:  {
            "name": "Petunia",
            "scientificName": "Petunia integrifolia",
            "categoryId": "65f2658ad22b76d6ea65e7f4",
            "coldestZone": 3,
            "warmestZone": 11,
            "colors": [
              "Purple",
              "Pink",
              "Blue"
            ],
            "height": 10,
            "space": 12,
            "daysToGermination": 10,
            "daysToFlower": 75,
            "daysToHarvest": 84
          }        
      };
  
      // test database methods
      const testUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: testUpdateOne
      });
  
      await updatePlant(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
  
    });
  
    //  Unsuccessful updatePlants - Invalid ID
    test('should return 400 status if invalid Plants ID is provided for update', async () => {
      const req = {
        params: { id: 'invalidID' },
        body:  {
            "name": "Petunia",
            "scientificName": "Petunia integrifolia",
            "categoryId": "65f2658ad22b76d6ea65e7f4",
            "coldestZone": 3,
            "warmestZone": 11,
            "colors": [
              "Purple",
              "Pink",
              "Blue"
            ],
            "height": 10,
            "space": 12,
            "daysToGermination": 10,
            "daysToFlower": 75,
            "daysToHarvest": 84
          }        
      };
  
      await updatePlant(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  
    // Unsuccessful updatePlants - Invalid fields
    test('Should return 400 status if fields are invalid for update', async () => {
      const req = {
        params: { id: testPlantsData[0]._id.toString() },
        body:  {
            "name": "Petunia",
            "scientificName": "Petunia integrifolia",
            "categoryId": "65f2658ad22b76d6ea65e7f4",
            "coldestZone": 3,
            "warmestZone": 11,
            "colors": [
              "Purple",
              "Pink",
              "Blue"
            ],
            "height": 10,
            "space": 12,
            "daysToGermination": 10,
            "daysToFlower": 75,
            "daysToHarvest": 84
          }
        
      };
  
      await plantCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  
    // TESTS FOR deletePlants
    // Successful deletePlants
    test('Should delete a Plants and return 200 status', async () => {
      const req = {
        params: { id: testPlantsData[0]._id.toString() }
      };
  
      const testDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        deleteOne: testDeleteOne
      });
  
      await deletePlant(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Plant deleted successfully' });
    });
  
    // Unsuccessful deletePlants - Invalid ID
    test('Should return 400 status if invalid Plants ID is provided for delete', async () => {
      const req = {
        params: { id: 'invalidID' }
      };
  
      await deletePlant(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
      
      // Tests are finished. Close the connections.
      afterAll(async () => {
        await mongodb.closeDb();
        if (mongoServer) {
          await mongoServer.stop();
        }
      });
    });
  