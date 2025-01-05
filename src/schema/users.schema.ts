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
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
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

export const updateProfileAvatarSchema = {
  description: 'Update user profile avatar',
  tags: ['Users'],
  body: {
    type: 'object',
    required: ['avatar'],
    properties: {
      avatar: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'User profile avatar updated successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
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
