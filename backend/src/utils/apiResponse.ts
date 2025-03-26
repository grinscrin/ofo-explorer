import type { Context } from 'elysia';

export const apiResponse = {
  success: <T>(data: T, message: string = 'Success') => ({
    success: true,
    message,
    data
  }),
  error: (message: string = 'An error occurred', code: number = 400) => ({
    success: false,
    message,
    code
  })
};

export type ApiResponse = ReturnType<typeof apiResponse.success> | ReturnType<typeof apiResponse.error>;