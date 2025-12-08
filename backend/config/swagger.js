import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

// Get API URL from environment variables
// Priority: DEPLOYED_URL > API_URL > BACKEND_URL > default localhost
const DEPLOYED_URL = process.env.DEPLOYED_URL || process.env.PRODUCTION_URL;
const API_URL = process.env.API_URL || process.env.BACKEND_URL;
const PORT = process.env.PORT || 5000;

// Determine the primary server URL
// If deployed URL is set, use it; otherwise use API_URL or localhost
const primaryServerUrl = DEPLOYED_URL || API_URL || `http://localhost:${PORT}/api`;

// Build servers array
const servers = [
  {
    url: primaryServerUrl,
    description: DEPLOYED_URL ? 'Production server' : (process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server')
  }
];

// If we have both a deployed URL and a different API URL, show both options
if (DEPLOYED_URL && API_URL && DEPLOYED_URL !== API_URL) {
  servers.push({
    url: API_URL,
    description: 'Alternative server'
  });
} else if (!DEPLOYED_URL && API_URL && API_URL !== `http://localhost:${PORT}/api`) {
  // In development, show both localhost and the configured API_URL if different
  servers.push({
    url: `http://localhost:${PORT}/api`,
    description: 'Local development server'
  });
}

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UZA Empower Backend API',
      version: '1.0.0',
      description: 'Complete backend API documentation for UZA Empower platform with endpoints for Admin, Donor, and Beneficiary dashboards.',
      contact: {
        name: 'UZA Empower API Support',
        email: 'support@uzaempower.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: servers,
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['admin', 'donor', 'beneficiary'],
              description: 'User role'
            },
            phone: {
              type: 'string',
              description: 'User phone number'
            },
            location: {
              type: 'string',
              description: 'User location'
            },
            kycStatus: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected'],
              description: 'KYC verification status'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether user account is active'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation date'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update date'
            }
          }
        },
        Project: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Project ID'
            },
            title: {
              type: 'string',
              description: 'Project title'
            },
            description: {
              type: 'string',
              description: 'Project description'
            },
            category: {
              type: 'string',
              description: 'Project category'
            },
            location: {
              type: 'string',
              description: 'Project location'
            },
            requestedAmount: {
              type: 'number',
              description: 'Requested funding amount'
            },
            totalDisbursed: {
              type: 'number',
              description: 'Total amount disbursed'
            },
            totalSpent: {
              type: 'number',
              description: 'Total amount spent'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'suspended'],
              description: 'Project status'
            },
            createdBy: {
              type: 'string',
              description: 'User ID of project creator'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        FundingRequest: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            requestedAmount: {
              type: 'number'
            },
            purpose: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['pending', 'approved', 'rejected']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Milestone: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected']
            },
            trancheAmount: {
              type: 'number'
            },
            evidence: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  url: {
                    type: 'string'
                  },
                  description: {
                    type: 'string'
                  }
                }
              }
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            type: {
              type: 'string',
              enum: ['disbursement', 'expense', 'revenue']
            },
            category: {
              type: 'string'
            },
            amount: {
              type: 'number'
            },
            description: {
              type: 'string'
            },
            date: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Pledge: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            donorId: {
              type: 'string'
            },
            amount: {
              type: 'number'
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'cancelled']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Alert: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            projectId: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical']
            },
            description: {
              type: 'string'
            },
            status: {
              type: 'string',
              enum: ['active', 'resolved']
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            type: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            message: {
              type: 'string'
            },
            read: {
              type: 'boolean'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            message: {
              type: 'string',
              description: 'Optional success message'
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Unauthorized - Invalid or missing token'
              }
            }
          }
        },
        ForbiddenError: {
          description: 'User does not have permission to access this resource',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Forbidden - Insufficient permissions'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Resource not found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                message: 'Validation failed'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Funding Requests',
        description: 'Funding request management endpoints'
      },
      {
        name: 'Milestones',
        description: 'Project milestone tracking endpoints'
      },
      {
        name: 'Transactions',
        description: 'Transaction management endpoints'
      },
      {
        name: 'Pledges',
        description: 'Donor pledge management endpoints'
      },
      {
        name: 'Alerts',
        description: 'Alert management endpoints'
      },
      {
        name: 'Notifications',
        description: 'Notification management endpoints'
      },
      {
        name: 'KYC',
        description: 'KYC verification endpoints'
      },
      {
        name: 'Dashboards',
        description: 'Dashboard data endpoints for different user roles'
      },
      {
        name: 'Media',
        description: 'File upload and media management endpoints'
      },
      {
        name: 'Payments',
        description: 'Payment processing endpoints'
      },
      {
        name: 'Disputes',
        description: 'Dispute resolution endpoints'
      },
      {
        name: 'Health',
        description: 'Health check endpoints'
      }
    ]
  },
  apis: ['./routes/*.js', './server.js'] // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

