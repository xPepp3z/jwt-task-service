import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'Documentazione API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
    tags: [
      {
        name: 'Tasks',
        description: 'Operazioni sulle task',
      },
      {
        name: 'Auth',
        description: 'Autenticazione e gestione account',
      },
    ],
    components: {
      securitySchemes: {
        TokenQueryAuth: {
          type: 'apiKey',
          in: 'query',
          name: 'token',
          description: 'JWT passato come query parameter (?token=...)',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
