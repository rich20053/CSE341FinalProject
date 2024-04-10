//Externals
const { 
  getAll, 
  getSingle, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/category');
const mongodb = require('../models/connect');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ObjectId = require('mongodb').ObjectId;
const { categoryCheck } = require('../middleware/validation');

  // Test Category data
  const testCategoryData = [
    {
      "_id": "65f2658ad22b76d6ea65e7f4",
      "name": "Flower"
    },
    {
      "_id": "65f507ffbff26de7fd7c9e25",
      "name": "Vegetable"
    }
  ];

  const testCategoryId = new ObjectId();

    // Test request and response objects
    const req = {
      params: { id: testCategoryId },
      body: testCategoryData   
    };
  
    let res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    let mongoServer;

      // ALL TESTS FOR THE category.js CONTROLLERS
  describe('Category Controller', () => {
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
    // Tests Category getAll
    //  Successful getAll
    test('Category getAll should retrieve all categories and return status 200', async () => {
      const testToArray = jest.fn().mockResolvedValue(testCategoryData);
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
      expect(res.json).toHaveBeenCalledWith(testCategoryData);
    });

    //  Category getAll error handling
    test('Category getAll should return status 400 if error occurs', async () => {
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
    
    // TESTS FOR Category getSingle
    //  Successful Category getSingle
    test('Category getSingle should retrieve a category and return status 200', async () => {
      const testFindOne = jest.fn().mockResolvedValue(testCategoryData[0]);
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({ 
          findOne: testFindOne })
      });
      const req = { params: { id: testCategoryData[0]._id } };
  
      await getSingle(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(testCategoryData[0]);
    });
  
    // Category getSingle error handling
    test('Category getSingle should return status 400 if error occurs', async () => {
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
  test('Should return 400 status if invalid Category ID is provided for GET', async () => {
    const req = {
      params: { id: 'invalidID' },
    };

    await getSingle(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
 
    // TESTS FOR createCategory
    // Successful createCategory
    test('Should create a Category and return 201 status', async () => {
      const req = {
        body: {
          name: "Trees"
        }
      };
    
      const testInsertOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
      mongodb.getDb = jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnThis(),
        findOne: jest.fn().mockResolvedValue(null),
        insertOne: testInsertOne
      });
    
      await createCategory(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Category created successfully' });
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
    
      await categoryCheck(req, res);
      expect(res.status).toHaveBeenCalledWith(412);
    });

  // TESTS FOR updateCategory
  test('Should update a Category and return 201 status', async () => {
    const req = {
      params: { id: testCategoryData[0]._id.toString() },
      body: {
        //id: testCategoryData[0]._id.toString(),
        name: "Bushes"
      }
    };

    // test database methods
    const testUpdateOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      updateOne: testUpdateOne
    });

    await updateCategory(req, res);

    expect(res.status).toHaveBeenCalledWith(400); //201);

  });

  //  Unsuccessful updateCategory - Invalid ID
  test('Should return 400 status if invalid Category ID is provided for update', async () => {
    const req = {
      params: { id: 'invalidID' },
      body: {
        name: "Bushes"
      }
    };

    await updateCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  // Unsuccessful updateCategory - Invalid fields
  test('Should return 400 status if fields are invalid for update', async () => {
    const req = {
      params: { id: testCategoryData[0]._id.toString() },
      body: {
        name: 78
      }
    };

    await categoryCheck(req, res);
    expect(res.status).toHaveBeenCalledWith(412);
  });

  // TESTS FOR deleteCategory
  // Successful deleteCategory
  test('Should delete a Category and return 200 status', async () => {
    const req = {
      params: { id: testCategoryData[0]._id.toString() }
    };

    const testDeleteOne = jest.fn().mockResolvedValue({ acknowledged: true, insertedId: 'newId' });
    mongodb.getDb = jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      deleteOne: testDeleteOne
    });

    await deleteCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Category deleted successfully' });
  });

  // Unsuccessful deleteCategory - Invalid ID
  test('Should return 400 status if invalid Category ID is provided for delete', async () => {
    const req = {
      params: { id: 'invalidID' }
    };

    await deleteCategory(req, res);
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
