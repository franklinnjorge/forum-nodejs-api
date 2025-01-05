export const createQuestionSchema = {
  description: 'Create a new question',
  tags: ['Questions'],
  body: {
    type: 'object',
    required: ['title', 'content'],
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Question created successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
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

export const listQuestionsSchema = {
  description: 'List all questions',
  tags: ['Questions'],
  response: {
    200: {
      description: 'Questions retrieved successfully',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
        },
      },
    },
  },
}

export const getQuestionByIdSchema = {
  description: 'Get a question by ID',
  tags: ['Questions'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Question retrieved successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },
    404: {
      description: 'Question not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const editQuestionSchema = {
  description: 'Edit a question',
  tags: ['Questions'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Question updated successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        content: { type: 'string' },
      },
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Question not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}

export const deleteQuestionSchema = {
  description: 'Delete a question',
  tags: ['Questions'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Question deleted successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Question not found',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
}
