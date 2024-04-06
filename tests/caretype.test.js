//Externals
const { 
    getAll, 
    getSingle, 
    createCareType, 
    updateCareType, 
    deleteCareType 
  } = require('../controllers/caretype');
  const mongodb = require('../models/connect');
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const ObjectId = require('mongodb').ObjectId;
  const { careTypeCheck } = require('../middleware/validation');
  
    // Test CareType data
    const testCareTypeData = [
      {
        "_id": "65f50361948ed9a2eb274b9f",
        "name": "Watering"
      },
      {
        "_id": "65f50992bff26de7fd7c9e26",
        "name": "Pruning"
      }
    ];
  
    const testCareTypeId = new ObjectId();
  
      // Test request and response objects
      const req = {
        params: { id: testCareTypeId },
        body: testCareTypeData   
      };
    
      let res = {
        setHeader: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    
      let mongoServer;
  
        // ALL TESTS FOR THE caretype.js CONTROLLERS
    describe('CareType Controller', () => {
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
      // Tests CareType getAll
      //  Successful getAll
      test('CareType getAll should retrieve all categories and return status 200', async () => {
        const testToArray = jest.fn().mockResolvedValue(testCareTypeData);
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
        expect(res.json).toHaveBeenCalledWith(testCareTypeData);
      });
  
      //  CareType getAll error handling
      test('CareType getAll should return status 400 if error occurs', async () => {
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
      
      // TESTS FOR CareType getSingle
      //  Successful CareType getSingle
      test('CareType getSingle should retrieve a CareType and return status 200', async () => {
        const testFindOne = jest.fn().mockResolvedValue(testCareTypeData[0]);
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnValue({ 
            findOne: testFindOne })
        });
        const req = { params: { id: testCareTypeData[0]._id } };
    
        await getSingle(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(testCareTypeData[0]);
      });
    
      // CareType getSingle error handling
      test('CareType getSingle should return status 400 if error occurs', async () => {
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
      
      
      // TESTS FOR createCareType
      // Successful createCareType
      test('Should create a CareType and return 201 status', async () => {
        const req = {
          body: {
            name: "Weeding"
          }
        };
      
        const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
        mongodb.getDb = jest.fn().mockReturnValue({
          collection: jest.fn().mockReturnThis(),
          findOne: jest.fn().mockResolvedValue(null),
          insertOne: testInsertOne
        });
      
        await createCareType(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'CareType created successfully' });
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
      
        await careTypeCheck(req, res);
        expect(res.status).toHaveBeenCalledWith(412);
      });
  
    // TESTS FOR updateCareType
    test('Should update a CareType and return 201 status', async () => {
      const req = {
        params: { id: testCareTypeData[0]._id.toString() },
        body: {
          //id: testCareTypeData[0]._id.toString(),
          name: "Bushes"
        }
      };
  
      // test database methods
      const testUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        updateOne: testUpdateOne
      });
  
      await updateCareType(req, res);
  
      expect(res.status).toHaveBeenCalledWith(201);
  
    });
  
    //  Unsuccessful updateCareType - Invalid ID
    test('should return 400 status if invalid CareType ID is provided for update', async () => {
      const req = {
        params: { id: 'invalidID' },
        body: {
          name: "Bushes"
        }
      };
  
      await updateCareType(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  
    // Unsuccessful updateCareType - Invalid fields
    test('Should return 400 status if fields are invalid for update', async () => {
      const req = {
        params: { id: testCareTypeData[0]._id.toString() },
        body: {
          name: 78
        }
      };
  
      await careTypeCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(412);
    });
  
    // TESTS FOR deleteCareType
    // Successful deleteCareType
    test('Should delete a CareType and return 200 status', async () => {
      const req = {
        params: { id: testCareTypeData[0]._id.toString() }
      };
  
      const testDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        deleteOne: testDeleteOne
      });
  
      await deleteCareType(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'CareType deleted successfully' });
    });
  
    // Unsuccessful deleteCareType - Invalid ID
    test('Should return 400 status if invalid CareType ID is provided for delete', async () => {
      const req = {
        params: { id: 'invalidID' }
      };
  
      await deleteCareType(req, res);
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
  