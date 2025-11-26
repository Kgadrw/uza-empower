import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'UZA Empower API',
      version: '1.0.0',
      description: 'Comprehensive API documentation for UZA Empower platform - A funding and project management system',
      contact: {
        name: 'UZA Empower Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.uzaempower.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            phone: { type: 'string', example: '+1234567890' },
            role: { type: 'string', enum: ['ADMIN', 'BENEFICIARY', 'DONOR'], example: 'BENEFICIARY' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Project: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            beneficiaryId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Community Water Well Project' },
            description: { type: 'string', example: 'Building a water well for the local community' },
            category: { type: 'string', example: 'Infrastructure' },
            status: {
              type: 'string',
              enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'SUSPENDED'],
              example: 'ACTIVE',
            },
            targetAmount: { type: 'number', example: 50000 },
            currentAmount: { type: 'number', example: 25000 },
            location: { type: 'string', example: 'Kampala, Uganda' },
            latitude: { type: 'number', example: 0.3476 },
            longitude: { type: 'number', example: 32.5825 },
            startDate: { type: 'string', format: 'date-time', nullable: true },
            endDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Pledge: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            donorId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            amount: { type: 'number', example: 1000 },
            status: { type: 'string', enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        FundingRequest: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            beneficiaryId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            amount: { type: 'number', example: 10000 },
            purpose: { type: 'string', example: 'Purchase materials for construction' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            type: { type: 'string', enum: ['EXPENSE', 'REVENUE'], example: 'EXPENSE' },
            amount: { type: 'number', example: 500 },
            description: { type: 'string', example: 'Purchase of construction materials' },
            category: { type: 'string', example: 'Materials' },
            receiptUrl: { type: 'string', nullable: true },
            latitude: { type: 'number', nullable: true },
            longitude: { type: 'number', nullable: true },
            transactionDate: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Milestone: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            title: { type: 'string', example: 'Foundation Complete' },
            description: { type: 'string', example: 'Foundation has been laid and inspected' },
            targetDate: { type: 'string', format: 'date-time', nullable: true },
            status: {
              type: 'string',
              enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'REJECTED'],
              example: 'PENDING',
            },
            evidenceUrl: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        KYC: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '507f1f77bcf86cd799439011' },
            userId: { type: 'string', example: '507f1f77bcf86cd799439011' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'], example: 'PENDING' },
            documentType: { type: 'string', example: 'National ID' },
            documentNumber: { type: 'string', example: '123456789' },
            documentUrl: { type: 'string', nullable: true },
            businessName: { type: 'string', nullable: true },
            businessRegistration: { type: 'string', nullable: true },
            address: { type: 'string', nullable: true },
            city: { type: 'string', nullable: true },
            country: { type: 'string', nullable: true },
            submittedAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check endpoint',
          description: 'Check if the API is running',
          responses: {
            '200': {
              description: 'API is running',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      message: { type: 'string', example: 'UZA Empower API is running' },
                      timestamp: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/auth/register': {
        post: {
          tags: ['Authentication'],
          summary: 'Register a new user',
          description: 'Create a new user account',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password', 'firstName', 'lastName'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123', minLength: 6 },
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    phone: { type: 'string', example: '+1234567890' },
                    role: { type: 'string', enum: ['ADMIN', 'BENEFICIARY', 'DONOR'], example: 'BENEFICIARY' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '400': {
              description: 'Bad request - User already exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Login user',
          description: 'Authenticate user and get JWT token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                    password: { type: 'string', format: 'password', example: 'password123' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Login successful',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              user: { $ref: '#/components/schemas/User' },
                              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Invalid credentials',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh access token',
          description: 'Get a new access token using refresh token',
          security: [],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['refreshToken'],
                  properties: {
                    refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                              refreshToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Invalid or expired refresh token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Logout user',
          description: 'Logout and invalidate token',
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/users/me': {
        get: {
          tags: ['Users'],
          summary: 'Get current user profile',
          description: 'Get the authenticated user\'s profile information',
          responses: {
            '200': {
              description: 'User profile retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/User' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '401': {
              description: 'Unauthorized',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        put: {
          tags: ['Users'],
          summary: 'Update current user profile',
          description: 'Update the authenticated user\'s profile information',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string', example: 'John' },
                    lastName: { type: 'string', example: 'Doe' },
                    phone: { type: 'string', example: '+1234567890' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Profile updated successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/User' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/users/{id}': {
        get: {
          tags: ['Users'],
          summary: 'Get user by ID',
          description: 'Get user information by ID (Admin only)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'User ID',
            },
          ],
          responses: {
            '200': {
              description: 'User retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/User' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '403': {
              description: 'Forbidden - Admin access required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/kyc/submit': {
        post: {
          tags: ['KYC'],
          summary: 'Submit KYC documents',
          description: 'Submit KYC/KYB documents for verification',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  required: ['documentType', 'documentNumber'],
                  properties: {
                    documentType: { type: 'string', example: 'National ID' },
                    documentNumber: { type: 'string', example: '123456789' },
                    document: { type: 'string', format: 'binary', description: 'Document file' },
                    businessName: { type: 'string', example: 'My Business Ltd' },
                    businessRegistration: { type: 'string', example: 'REG123456' },
                    address: { type: 'string', example: '123 Main Street' },
                    city: { type: 'string', example: 'Kampala' },
                    country: { type: 'string', example: 'Uganda' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'KYC submitted successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/KYC' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/kyc/status': {
        get: {
          tags: ['KYC'],
          summary: 'Get KYC status',
          description: 'Get the current user\'s KYC verification status',
          responses: {
            '200': {
              description: 'KYC status retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/KYC' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/kyc/pending': {
        get: {
          tags: ['KYC'],
          summary: 'Get pending KYC requests',
          description: 'Get all pending KYC requests (Admin only)',
          responses: {
            '200': {
              description: 'Pending KYC requests retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/KYC' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/kyc/{id}/approve': {
        put: {
          tags: ['KYC'],
          summary: 'Approve KYC',
          description: 'Approve a KYC request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'KYC ID',
            },
          ],
          responses: {
            '200': {
              description: 'KYC approved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/KYC' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/kyc/{id}/reject': {
        put: {
          tags: ['KYC'],
          summary: 'Reject KYC',
          description: 'Reject a KYC request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'KYC ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rejectionReason: { type: 'string', example: 'Document not clear' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'KYC rejected successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/KYC' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects': {
        get: {
          tags: ['Projects'],
          summary: 'List all projects',
          description: 'Get a paginated list of all projects (public)',
          security: [],
          parameters: [
            {
              name: 'status',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'SUSPENDED'],
              },
              description: 'Filter by status',
            },
            {
              name: 'category',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by category',
            },
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search in title and description',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Items per page',
            },
          ],
          responses: {
            '200': {
              description: 'Projects retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' },
                          },
                          pagination: {
                            type: 'object',
                            properties: {
                              page: { type: 'integer' },
                              limit: { type: 'integer' },
                              total: { type: 'integer' },
                              pages: { type: 'integer' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Projects'],
          summary: 'Create a new project',
          description: 'Create a new project (Beneficiary only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description', 'targetAmount'],
                  properties: {
                    title: { type: 'string', example: 'Community Water Well Project' },
                    description: { type: 'string', example: 'Building a water well for the local community' },
                    category: { type: 'string', example: 'Infrastructure' },
                    targetAmount: { type: 'number', example: 50000 },
                    location: { type: 'string', example: 'Kampala, Uganda' },
                    latitude: { type: 'number', example: 0.3476 },
                    longitude: { type: 'number', example: 32.5825 },
                    startDate: { type: 'string', format: 'date-time', nullable: true },
                    endDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Project created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/mine': {
        get: {
          tags: ['Projects'],
          summary: 'Get my projects',
          description: 'Get all projects created by the authenticated user',
          responses: {
            '200': {
              description: 'Projects retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Project' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}': {
        get: {
          tags: ['Projects'],
          summary: 'Get project by ID',
          description: 'Get detailed information about a specific project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Project retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
            '404': {
              description: 'Project not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
        put: {
          tags: ['Projects'],
          summary: 'Update project',
          description: 'Update project information (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    description: { type: 'string' },
                    category: { type: 'string' },
                    targetAmount: { type: 'number' },
                    location: { type: 'string' },
                    latitude: { type: 'number' },
                    longitude: { type: 'number' },
                    startDate: { type: 'string', format: 'date-time' },
                    endDate: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Project updated successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/status': {
        put: {
          tags: ['Projects'],
          summary: 'Update project status',
          description: 'Update project status (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED', 'SUSPENDED'],
                    },
                    rejectionReason: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Project status updated successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/budget': {
        get: {
          tags: ['Projects'],
          summary: 'Get project budget',
          description: 'Get budget information for a project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Budget retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              projectId: { type: 'string' },
                              totalBudget: { type: 'number' },
                              allocatedAmount: { type: 'number' },
                              spentAmount: { type: 'number' },
                              breakdown: { type: 'object' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        put: {
          tags: ['Projects'],
          summary: 'Update project budget',
          description: 'Update budget information for a project (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['totalBudget'],
                  properties: {
                    totalBudget: { type: 'number', example: 50000 },
                    breakdown: { type: 'object', example: { materials: 20000, labor: 30000 } },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Budget updated successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/kpis': {
        get: {
          tags: ['Projects'],
          summary: 'Get project KPIs',
          description: 'Get key performance indicators for a project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'KPIs retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              beneficiariesReached: { type: 'integer' },
                              jobsCreated: { type: 'integer' },
                              revenueGenerated: { type: 'number' },
                              impactMetrics: { type: 'object' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/impact-report': {
        get: {
          tags: ['Projects'],
          summary: 'Get impact report',
          description: 'Get comprehensive impact report for a project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Impact report retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/complete': {
        post: {
          tags: ['Projects'],
          summary: 'Mark project as completed',
          description: 'Mark a project as completed (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Project marked as completed',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Project' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests': {
        post: {
          tags: ['Funding Requests'],
          summary: 'Create funding request',
          description: 'Create a new funding request for a project (Beneficiary only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['projectId', 'amount', 'purpose'],
                  properties: {
                    projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    amount: { type: 'number', example: 10000 },
                    purpose: { type: 'string', example: 'Purchase materials for construction' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Funding request created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/FundingRequest' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests/mine': {
        get: {
          tags: ['Funding Requests'],
          summary: 'Get my funding requests',
          description: 'Get all funding requests created by the authenticated user',
          responses: {
            '200': {
              description: 'Funding requests retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/FundingRequest' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests/pending': {
        get: {
          tags: ['Funding Requests'],
          summary: 'Get pending funding requests',
          description: 'Get all pending funding requests (Admin only)',
          responses: {
            '200': {
              description: 'Pending funding requests retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/FundingRequest' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests/{id}': {
        get: {
          tags: ['Funding Requests'],
          summary: 'Get funding request by ID',
          description: 'Get detailed information about a specific funding request',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Funding Request ID',
            },
          ],
          responses: {
            '200': {
              description: 'Funding request retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/FundingRequest' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests/{id}/approve': {
        put: {
          tags: ['Funding Requests'],
          summary: 'Approve funding request',
          description: 'Approve a funding request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Funding Request ID',
            },
          ],
          responses: {
            '200': {
              description: 'Funding request approved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/FundingRequest' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/funding-requests/{id}/reject': {
        put: {
          tags: ['Funding Requests'],
          summary: 'Reject funding request',
          description: 'Reject a funding request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Funding Request ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rejectionReason: { type: 'string', example: 'Insufficient documentation' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Funding request rejected successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/FundingRequest' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/pledges': {
        post: {
          tags: ['Pledges'],
          summary: 'Create a pledge',
          description: 'Create a new pledge for a project (Donor only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['projectId', 'amount'],
                  properties: {
                    projectId: { type: 'string', example: '507f1f77bcf86cd799439011' },
                    amount: { type: 'number', example: 1000 },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Pledge created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Pledge' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/pledges/mine': {
        get: {
          tags: ['Pledges'],
          summary: 'Get my pledges',
          description: 'Get all pledges made by the authenticated user',
          responses: {
            '200': {
              description: 'Pledges retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Pledge' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/pledges/projects/{id}': {
        get: {
          tags: ['Pledges'],
          summary: 'Get project pledges',
          description: 'Get all pledges for a specific project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Pledges retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Pledge' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/pledges/{id}': {
        get: {
          tags: ['Pledges'],
          summary: 'Get pledge by ID',
          description: 'Get detailed information about a specific pledge',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Pledge ID',
            },
          ],
          responses: {
            '200': {
              description: 'Pledge retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Pledge' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/tranches': {
        get: {
          tags: ['Tranches'],
          summary: 'Get project tranches',
          description: 'Get all tranches for a specific project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Tranches retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/tranches/{trancheId}/release': {
        post: {
          tags: ['Tranches'],
          summary: 'Release tranche',
          description: 'Release a tranche for a project (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
            {
              name: 'trancheId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Tranche ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    releaseReason: { type: 'string', example: 'Milestone completed' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Tranche released successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/tranches/{trancheId}/freeze': {
        post: {
          tags: ['Tranches'],
          summary: 'Freeze tranche',
          description: 'Freeze a tranche for a project (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
            {
              name: 'trancheId',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Tranche ID',
            },
          ],
          responses: {
            '200': {
              description: 'Tranche frozen successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/transactions': {
        get: {
          tags: ['Transactions'],
          summary: 'Get project transactions',
          description: 'Get all transactions for a specific project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Transactions retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Transaction' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Transactions'],
          summary: 'Create transaction',
          description: 'Create a new transaction for a project (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['type', 'amount', 'description'],
                  properties: {
                    type: { type: 'string', enum: ['EXPENSE', 'REVENUE'], example: 'EXPENSE' },
                    amount: { type: 'number', example: 500 },
                    description: { type: 'string', example: 'Purchase of construction materials' },
                    category: { type: 'string', example: 'Materials' },
                    receiptUrl: { type: 'string', nullable: true },
                    latitude: { type: 'number', nullable: true },
                    longitude: { type: 'number', nullable: true },
                    transactionDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Transaction created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Transaction' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/transactions/{id}': {
        get: {
          tags: ['Transactions'],
          summary: 'Get transaction by ID',
          description: 'Get detailed information about a specific transaction',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Transaction ID',
            },
          ],
          responses: {
            '200': {
              description: 'Transaction retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Transaction' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/transactions/{id}/media': {
        post: {
          tags: ['Transactions'],
          summary: 'Upload transaction media',
          description: 'Upload media files for a transaction (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Transaction ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    media: {
                      type: 'array',
                      items: { type: 'string', format: 'binary' },
                      description: 'Media files (images, videos, documents)',
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Media uploaded successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/ledger': {
        get: {
          tags: ['Transactions'],
          summary: 'Get project ledger',
          description: 'Get complete ledger for a project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Ledger retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/milestones': {
        get: {
          tags: ['Milestones'],
          summary: 'Get project milestones',
          description: 'Get all milestones for a specific project (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Milestones retrieved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Milestone' },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Milestones'],
          summary: 'Create milestone',
          description: 'Create a new milestone for a project (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title'],
                  properties: {
                    title: { type: 'string', example: 'Foundation Complete' },
                    description: { type: 'string', example: 'Foundation has been laid and inspected' },
                    targetDate: { type: 'string', format: 'date-time', nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Milestone created successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Milestone' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/milestones/{id}/evidence': {
        post: {
          tags: ['Milestones'],
          summary: 'Upload milestone evidence',
          description: 'Upload evidence for a milestone (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Milestone ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    evidence: { type: 'string', format: 'binary', description: 'Evidence file' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Evidence uploaded successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/milestones/{id}/approve': {
        put: {
          tags: ['Milestones'],
          summary: 'Approve milestone',
          description: 'Approve a milestone (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Milestone ID',
            },
          ],
          responses: {
            '200': {
              description: 'Milestone approved successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Milestone' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/milestones/{id}/reject': {
        put: {
          tags: ['Milestones'],
          summary: 'Reject milestone',
          description: 'Reject a milestone (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Milestone ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rejectionReason: { type: 'string', example: 'Insufficient evidence' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Milestone rejected successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: { $ref: '#/components/schemas/Milestone' },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/projects/{id}/top-ups': {
        get: {
          tags: ['Top-Ups'],
          summary: 'Get project top-ups',
          description: 'Get all top-up requests for a specific project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Top-ups retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Top-Ups'],
          summary: 'Create top-up request',
          description: 'Create a new top-up request for a project (Owner or Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['amount', 'reason'],
                  properties: {
                    amount: { type: 'number', example: 5000 },
                    reason: { type: 'string', example: 'Additional materials needed' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Top-up request created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/top-ups/{id}/approve': {
        put: {
          tags: ['Top-Ups'],
          summary: 'Approve top-up',
          description: 'Approve a top-up request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Top-Up ID',
            },
          ],
          responses: {
            '200': {
              description: 'Top-up approved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/top-ups/{id}/reject': {
        put: {
          tags: ['Top-Ups'],
          summary: 'Reject top-up',
          description: 'Reject a top-up request (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Top-Up ID',
            },
          ],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    rejectionReason: { type: 'string', example: 'Insufficient justification' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Top-up rejected successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/alerts': {
        get: {
          tags: ['Alerts'],
          summary: 'Get all alerts',
          description: 'Get all alerts in the system (Admin only)',
          responses: {
            '200': {
              description: 'Alerts retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/alerts/projects/{id}': {
        get: {
          tags: ['Alerts'],
          summary: 'Get project alerts',
          description: 'Get all alerts for a specific project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Alerts retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/alerts/{id}/resolve': {
        put: {
          tags: ['Alerts'],
          summary: 'Resolve alert',
          description: 'Resolve an alert (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Alert ID',
            },
          ],
          responses: {
            '200': {
              description: 'Alert resolved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/disputes/projects/{id}/disputes': {
        post: {
          tags: ['Disputes'],
          summary: 'Create dispute',
          description: 'Create a new dispute for a project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['title', 'description'],
                  properties: {
                    title: { type: 'string', example: 'Budget Mismatch' },
                    description: { type: 'string', example: 'The project budget does not match the actual expenses' },
                  },
                },
              },
            },
          },
          responses: {
            '201': {
              description: 'Dispute created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/disputes/mine': {
        get: {
          tags: ['Disputes'],
          summary: 'Get my disputes',
          description: 'Get all disputes raised by the authenticated user',
          responses: {
            '200': {
              description: 'Disputes retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/disputes/pending': {
        get: {
          tags: ['Disputes'],
          summary: 'Get pending disputes',
          description: 'Get all pending disputes (Admin only)',
          responses: {
            '200': {
              description: 'Pending disputes retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/disputes/{id}/resolve': {
        put: {
          tags: ['Disputes'],
          summary: 'Resolve dispute',
          description: 'Resolve a dispute (Admin only)',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Dispute ID',
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['resolution'],
                  properties: {
                    resolution: { type: 'string', example: 'Dispute resolved after review' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Dispute resolved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'Get notifications',
          description: 'Get all notifications for the authenticated user',
          responses: {
            '200': {
              description: 'Notifications retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/notifications/{id}/read': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark notification as read',
          description: 'Mark a notification as read',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Notification ID',
            },
          ],
          responses: {
            '200': {
              description: 'Notification marked as read',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/admin/dashboard': {
        get: {
          tags: ['Admin'],
          summary: 'Get admin dashboard',
          description: 'Get admin dashboard statistics and overview (Admin only)',
          responses: {
            '200': {
              description: 'Dashboard data retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/admin/review-queue': {
        get: {
          tags: ['Admin'],
          summary: 'Get review queue',
          description: 'Get items pending review (Admin only)',
          responses: {
            '200': {
              description: 'Review queue retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/admin/risk-heatmap': {
        get: {
          tags: ['Admin'],
          summary: 'Get risk heatmap',
          description: 'Get risk assessment heatmap data (Admin only)',
          responses: {
            '200': {
              description: 'Risk heatmap retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/admin/audit-log': {
        get: {
          tags: ['Admin'],
          summary: 'Get audit log',
          description: 'Get system audit log (Admin only)',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Items per page',
            },
          ],
          responses: {
            '200': {
              description: 'Audit log retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/payments/webhook': {
        post: {
          tags: ['Payments'],
          summary: 'Payment webhook',
          description: 'Webhook endpoint for payment providers',
          security: [],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  description: 'Payment webhook payload (varies by provider)',
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Webhook processed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/payments/{id}': {
        get: {
          tags: ['Payments'],
          summary: 'Get payment by ID',
          description: 'Get detailed information about a specific payment',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Payment ID',
            },
          ],
          responses: {
            '200': {
              description: 'Payment retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/payments/projects/{id}/payments': {
        get: {
          tags: ['Payments'],
          summary: 'Get project payments',
          description: 'Get all payments for a specific project',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Project ID',
            },
          ],
          responses: {
            '200': {
              description: 'Payments retrieved successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/messaging/sms': {
        post: {
          tags: ['Messaging'],
          summary: 'Send SMS',
          description: 'Send SMS message (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'message'],
                  properties: {
                    to: { type: 'string', example: '+1234567890' },
                    message: { type: 'string', example: 'Your project has been approved' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'SMS sent successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/messaging/whatsapp': {
        post: {
          tags: ['Messaging'],
          summary: 'Send WhatsApp message',
          description: 'Send WhatsApp message (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'message'],
                  properties: {
                    to: { type: 'string', example: '+1234567890' },
                    message: { type: 'string', example: 'Your project has been approved' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'WhatsApp message sent successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/messaging/email': {
        post: {
          tags: ['Messaging'],
          summary: 'Send email',
          description: 'Send email message (Admin only)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['to', 'subject', 'message'],
                  properties: {
                    to: { type: 'string', format: 'email', example: 'user@example.com' },
                    subject: { type: 'string', example: 'Project Approval' },
                    message: { type: 'string', example: 'Your project has been approved' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Email sent successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/SuccessResponse' },
                },
              },
            },
          },
        },
      },
      '/upload': {
        post: {
          tags: ['Upload'],
          summary: 'Upload file',
          description: 'Upload a file to the system',
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: { type: 'string', format: 'binary', description: 'File to upload' },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'File uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    allOf: [
                      { $ref: '#/components/schemas/SuccessResponse' },
                      {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              id: { type: 'string' },
                              url: { type: 'string' },
                              filename: { type: 'string' },
                            },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
      '/media/{id}': {
        get: {
          tags: ['Upload'],
          summary: 'Get media file',
          description: 'Get a media file by ID (public)',
          security: [],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Media ID',
            },
          ],
          responses: {
            '200': {
              description: 'Media file retrieved successfully',
              content: {
                'application/octet-stream': {
                  schema: { type: 'string', format: 'binary' },
                },
              },
            },
            '404': {
              description: 'Media not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
