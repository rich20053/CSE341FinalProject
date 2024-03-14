const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Music API',
    description: 'API for My Music Collection'
  },
  host: 'week6service.onrender.com',
  //host: 'localhost:8080',
  schemes: [
    'https'
    //'http'
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