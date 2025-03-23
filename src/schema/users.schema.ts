export const createSchema = {
  description: 'Register a new user',
  tags: ['Users'],
  body: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'User registered successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}
export const authenticateSchema = {
  description: 'Authenticate a user',
  tags: ['Users'],
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
      password: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'User authenticated successfully',
      type: 'object',
      properties: {
        token: { type: 'string' },
      },
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const profileSchema = {
  description: 'Get user profile',
  tags: ['Users'],
  security: [
    {
      BearerAuth: [],
    },
  ],
  response: {
    200: {
      description: 'User profile retrieved successfully',
      type: 'object',
      properties: {
        user: {
          id: { type: 'string', description: 'Unique identifier of the user' },
          name: { type: 'string', description: 'Name of the user' },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          avatarUrl: { type: 'string', description: 'URL of the user avatar' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation date',
          },
          updatedAt: {
            oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
            description: 'Date when the profile was last updated',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string', description: 'Error message' },
      },
    },
  },
}

export const updateProfileAvatarSchema = {
  tags: ['Users'],
  description: 'Update user profile avatar',
  consumes: ['multipart/form-data'],
  response: {
    200: {
      description: 'User profile avatar updated successfully',
      type: 'object',
      properties: {
        user: {
          id: { type: 'string', description: 'Unique identifier of the user' },
          name: { type: 'string', description: 'Name of the user' },
          email: {
            type: 'string',
            format: 'email',
            description: 'User email address',
          },
          avatarUrl: { type: 'string', description: 'URL of the user avatar' },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'User creation date',
          },
          updatedAt: {
            oneOf: [{ type: 'string', format: 'date-time' }, { type: 'null' }],
            description: 'Date when the profile was last updated',
          },
        },
      },
    },
    401: {
      description: 'Unauthorized',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}
