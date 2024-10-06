'use server';

import { signUpValidationSchema } from '@/app/validation/auth-schemas';
import { z } from 'zod';

export const signUp = (values: z.infer<typeof signUpValidationSchema>) => {
  return new Promise((resolve, reject) => {
    const validated = signUpValidationSchema.safeParse(values);

    setTimeout(() => {
      if (!validated?.success) {
        return reject({
          error: true,
          message: 'Invalid fields',
        });
      }

      return resolve({
        success: true,
        message: 'Created user',
        data: values,
      });
    }, 2000);
  });
};
