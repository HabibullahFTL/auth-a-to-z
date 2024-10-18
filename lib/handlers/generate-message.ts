import { IErrorCode, ISuccessCode } from '@/types/common';
import { errorMessages, successMessages } from './default-messages';

export const getErrorMessageByCode = (
  code: IErrorCode,
  fallbackMessage?: string
) => {
  return (
    errorMessages?.[code as keyof typeof errorMessages] || // Error message with matched key
    fallbackMessage || // Use the fallback message if provided
    errorMessages.UnexpectedError // Default message
  );
};

export const getSuccessMessageByCode = (
  code: ISuccessCode,
  fallbackMessage?: string
) => {
  return (
    successMessages?.[code as keyof typeof successMessages] || // Error message with matched key
    fallbackMessage || // Use the fallback message if provided
    successMessages.DefaultSuccess // Default message
  );
};
