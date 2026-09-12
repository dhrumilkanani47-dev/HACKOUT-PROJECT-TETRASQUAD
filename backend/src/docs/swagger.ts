import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EV GreenCharge API',
      version: '1.0.0',
      description: 'AI-Powered EV Charging Assistant API primarily designed for India (₹/kWh, Indian networks & SLDC telemetry).',
      contact: {
        name: 'EV GreenCharge Engineering',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Provide JWT token generated via /api/auth/login or /api/auth/register',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
