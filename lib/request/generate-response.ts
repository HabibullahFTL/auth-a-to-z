import { IResponse } from '@/types/common';
import {} from '../handlers/default-messages';
import {
  getErrorMessageByCode,
  getSuccessMessageByCode,
} from '../handlers/generate-message';

export const generateResponse = <T>({
  success,
  code,
  message,
  data,
}: Partial<IResponse<T>>): IResponse<T> => {
  const isSuccess = success || false;

  return {
    success: isSuccess,
    code,
    message:
      message || isSuccess
        ? getSuccessMessageByCode(code || '')
        : getErrorMessageByCode(code || ''),
    data,
  };
};
