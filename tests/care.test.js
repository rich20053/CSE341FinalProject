//Externals
const { 
    getAll, 
    getSingle, 
    createCare, 
    updateCare, 
    deleteCare,
    getCareByPlantName,
    getCareByTypeName
  } = require('../controllers/care');
  const mongodb = require('../models/connect');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const ObjectId = require('mongodb').ObjectId;
  const { careCheck } = require('../middleware/validation');
  
    // Test Care data
    const testCareData = [
        {
          "_id": "65f509d8948ed9a2eb274ba0",
          "plantId": "65f50aa8afd2c0fe57d924e2",
          "careTypeId": "65f50ab6afd2c0fe57d924e3",
          "description": "Give your roses 1 to 2 inches of water each week in a single watering session from early spring through fall. Increase the frequency to every three or four days in hot and dry weather. Porous soils will also benefit from additional deep soakings."
        },
        {
          "_id": "6604d9b5c97f087af33de0be",
          "plantId": "65f2708ad22b76d6ea65e7f8",
          "careTypeId": "65f50361948ed9a2eb274b9f",
          "description": "Tulip Watering"
        },
        {
          "_id": "6604da56c97f087af33de0bf",
          "plantId": "65f2708ad22b76d6ea65e7f8",
          "careTypeId": "65f50992bff26de7fd7c9e26",
          "description": "Tulip Pruning"
        }
      ];
  
    const testCareId = new ObjectId();
  
      // Test request and response objects
      const req = {
        params: { id: testCareId },
        body: testCareData   
      };
    
      let res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    
      let mongoServer;
  
        // ALL TESTS FOR THE care.js CONTROLLERS
    describe('Care Controller', () => {
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
      // Tests Care getAll
      //  Successful getAll
      test('Care getAll should retrieve all categories and return status 200', async () => {
        const testToArray = jest.fn().mockResolvedValue(testCareData);
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
        expect(res.json).toHaveBeenCalledWith(testCareData);
      });
  
      //  Care getAll error handling
      test('Care getAll should return status 400 if error occurs', async () => {
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
      
      // TESTS FOR Care getSingle
      //  Successful Care getSingle
      test('Care getSingle should retrieve a Care and return status 200', async () => {
        const testFindOne = jest.fn().mockResolvedValue(testCareData[0]);
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({ 
            findOne: testFindOne })
        });
        const req = { params: { id: testCareData[0]._id } };
    
        await getSingle(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testCareData[0]);
      });
    
      // Care getSingle error handling
      test('Care getSingle should return status 400 if error occurs', async () => {
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
      
  //  Unsuccessful getSingle - Invalid ID
  test('Should return 400 status if invalid Care ID is provided for GET', async () => {
    const req = {
      params: { id: 'invalidID' },
    };

    await getSingle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

      // TESTS FOR createCare
      // Successful createCare
      test('Should create a Care and return 201 status', async () => {
        const req = {
          body: {
            "plantId": "65f2708ad22b76d6ea65e7f8",
            "careTypeId": "65f50992bff26de7fd7c9e26",
            "description": "Prune in late winter or early spring. Remove dead parts. Remove any dead branches and canes. Prune broken or unhealthy branches. Prune diseased or damaged branches back to healthy wood. Remove crossed branches. Clip away branches that cross through the center of the plant. Prevent rubbing branches."
          }
        
        };
      
        const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: testInsertOne
        });
      
        await createCare(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Care created successfully' });
      });
      
      // Validation Failure
      test('Should return 412 status if fields do not validate.', async () => {
        const req = {
            body: {
              "name": 9
            }              
          };
      
        const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: testInsertOne
        });
      
        await careCheck(req, res);
        expect(res.status).toHaveBeenCalledWith(412);
      });
  
    // TESTS FOR updateCare
    test('Should update a Care and return 201 status', async () => {
      const req = {
        params: { id: testCareData[0]._id.toString() },
        body: {
            "plantId": "65f2708ad22b76d6ea65e7f8",
            "careTypeId": "65f50992bff26de7fd7c9e26",
            "description": "Test Description."
        }       
      };
  
      // test database methods
      const testUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: testUpdateOne
      });
  
      await updateCare(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
  
    });
  
    //  Unsuccessful updateCare - Invalid ID
    test('should return 400 status if invalid Care ID is provided for update', async () => {
      const req = {
        params: { id: 'invalidID' },
        body: {
            "plantId": "65f2708ad22b76d6ea65e7f8",
            "careTypeId": "65f50992bff26de7fd7c9e26",
            "description": "Test Description."
        }
      };
  
      await updateCare(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  
    // Unsuccessful updateCare - Invalid fields
    test('Should return 400 status if fields are invalid for update', async () => {
      const req = {
        params: { id: testCareData[0]._id.toString() },
        body: {
          name: 78
        }
      };
  
      await careCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(412);
    });
  
    // TESTS FOR deleteCare
    // Successful deleteCare
    test('Should delete a Care and return 200 status', async () => {
      const req = {
        params: { id: testCareData[0]._id.toString() }
      };
  
      const testDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        deleteOne: testDeleteOne
      });
  
      await deleteCare(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Care deleted successfully' });
    });
  
    // Unsuccessful deleteCare - Invalid ID
    test('Should return 400 status if invalid Care ID is provided for delete', async () => {
      const req = {
        params: { id: 'invalidID' }
      };
  
      await deleteCare(req, res);
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
