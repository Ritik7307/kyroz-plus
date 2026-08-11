import { RxJsonSchema } from 'rxdb';

export const kotSchemaLiteral = {
  title: 'kot schema',
  version: 0,
  description: 'describes a kitchen order ticket',
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100 // RxDB string primary keys require max length
    },
    kotNumber: {
      type: 'number'
    },
    tableNumber: {
      type: 'string'
    },
    orderType: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    customerPhone: {
      type: 'string'
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          dishId: { type: 'string' },
          quantity: { type: 'number' },
          note: { type: 'string' }
        }
      }
    },
    status: {
      type: 'string',
      default: 'pending'
    },
    updatedAt: {
      type: 'number' // Unix timestamp for sync conflict resolution
    },
    deleted: {
      type: 'boolean',
      default: false // Soft delete flag for sync
    }
  },
  required: ['id', 'orderType', 'updatedAt']
} as const;

export const kotSchema: RxJsonSchema<any> = kotSchemaLiteral;
