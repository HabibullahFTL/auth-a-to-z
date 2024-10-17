import {
  errorMessages,
  successMessages,
} from '@/lib/handlers/default-messages';

export type IUserRole = 'USER' | 'ADMIN' | 'BLOCKED';

type IErrorCode = keyof typeof errorMessages | (string & {});
type ISuccessCode = keyof typeof successMessages | (string & {});

export interface IResponse<T = undefined> {
  success: boolean;
  code?: IErrorCode | ISuccessCode;
  message: string;
  data?: T;
}
