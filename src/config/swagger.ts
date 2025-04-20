import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Coordinadora',
      version: '1.0.0',
      description: 'Documentación de la API para la prueba técnica de Coordinadora Full Stack',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./swagger.yml'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

const swaggerDocs = (app: any, port: number) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
  app.get('/swagger.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  
  console.log(`📝 Documentación de Swagger disponible en http://localhost:${port}/api-docs`);
};

export default swaggerDocs;