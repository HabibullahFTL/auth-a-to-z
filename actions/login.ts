'use server';

import { signInValidationSchema } from '@/app/validation/auth-schemas';
import { z } from 'zod';

export const login = (values: z.infer<typeof signInValidationSchema>) => {
  return new Promise((resolve, reject) => {
    const validated = signInValidationSchema.safeParse(values);

    setTimeout(() => {
      if (!validated?.success) {
        return reject({
          error: true,
          message: 'Invalid fields',
        });
      }

      return resolve({
        success: true,
        message: 'Validate login info',
        data: values,
      });
    }, 2000);
  });
};
