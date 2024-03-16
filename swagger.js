const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Garden Grwo API',
    description: 'API for Home Gardening'
  },
  //host: 'gardengrow.onrender.com',
  host: 'localhost:8080',
  schemes: [
    //'https'
    'http'
  ]
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });