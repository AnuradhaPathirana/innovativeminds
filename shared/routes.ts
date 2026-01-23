import { z } from 'zod';
import { insertEnquirySchema, enquiries } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  enquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/enquiries',
      input: insertEnquirySchema,
      responses: {
        201: z.custom<typeof enquiries.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/enquiries',
      responses: {
        200: z.array(z.custom<typeof enquiries.$inferSelect>()),
        401: errorSchemas.unauthorized,
        500: errorSchemas.internal,
      },
    },
    updateStatus: {
      method: 'PATCH' as const,
      path: '/api/enquiries/:id/status',
      input: z.object({ status: z.enum(["pending", "contacted"]) }),
      responses: {
        200: z.custom<typeof enquiries.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type EnquiryInput = z.infer<typeof api.enquiries.create.input>;
export type EnquiryResponse = z.infer<typeof api.enquiries.create.responses[201]>;
