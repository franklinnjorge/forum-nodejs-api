export const createAnswerSchema = {
  description: 'Create a new answer',
  tags: ['Answers'],
  body: {
    type: 'object',
    required: ['questionId', 'content'],
    properties: {
      questionId: { type: 'string' },
      content: { type: 'string' },
    },
  },
  response: {
    201: {
      description: 'Answer created successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        questionId: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string' },
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

export const listAnswersSchema = {
  description: 'List all answers for a question',
  tags: ['Answers'],
  params: {
    type: 'object',
    properties: {
      questionId: { type: 'string' },
    },
    required: ['questionId'],
  },
  response: {
    200: {
      description: 'Answers retrieved successfully',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          questionId: { type: 'string' },
          content: { type: 'string' },
          createdAt: { type: 'string' },
        },
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

export const getAnswerByIdSchema = {
  description: 'Get an answer by ID',
  tags: ['Answers'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Answer retrieved successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        questionId: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string' },
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

export const editAnswerSchema = {
  description: 'Edit an answer',
  tags: ['Answers'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  body: {
    type: 'object',
    required: ['content'],
    properties: {
      content: { type: 'string' },
    },
  },
  response: {
    200: {
      description: 'Answer edited successfully',
      type: 'object',
      properties: {
        id: { type: 'string' },
        questionId: { type: 'string' },
        content: { type: 'string' },
        updatedAt: { type: 'string' },
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

export const deleteAnswerSchema = {
  description: 'Delete an answer',
  tags: ['Answers'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      description: 'Answer deleted successfully',
      type: 'object',
      properties: {
        message: { type: 'string' },
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
