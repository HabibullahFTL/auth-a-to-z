import { ResetPasswordRequestEmailTemplate } from '@/email-templates/reset-password-email-template';
import { User } from '@prisma/client';
import { Resend } from 'resend';
import { v4 as uuid } from 'uuid';
import { VerificationEmailTemplate } from '../../email-templates/verification-email-template';
import siteConfig from '../data/site-configs';
import { generateResponse } from './generate-response';

interface IVerificationProps {
  urlOrigin: string;
  user: Partial<User>;
  verification: {
    token: string;
    code: string;
  };
}
interface IResetPasswordRequestProps {
  urlOrigin: string;
  user: Partial<User>;
  verification: {
    token: string;
  };
}

const resendMailService = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  user,
  verification,
  urlOrigin,
}: IVerificationProps) => {
  const confirmationLink = `${urlOrigin}/email-verification?token=${verification?.token}`;

  const response = await resendMailService.emails.send({
    from: `${siteConfig?.name} <${siteConfig?.fromEmail}>`,
    replyTo: siteConfig?.email,
    to: [user?.email || ''], // There can be pass an array of emails like ['abc@gmail.com', 'def@gmail.com'] or a single email 'abc@gmail.com
    subject: `Verify your email address - ${siteConfig?.name}`,
    headers: {
      'X-Entity-Ref-ID': uuid(), // This will prevent threading in gmail though we send multiple email with same title
    },
    react: VerificationEmailTemplate({
      verification: {
        code: verification?.code,
        link: confirmationLink,
      },
      company: siteConfig,
    }),
  });

  if (response?.error) {
    console.log('response?.error', response?.error);

    return generateResponse({ code: 'ResendVerificationFailed' });
  }

  return generateResponse({ success: true, code: 'EmailVerificationSent' });
};

export const sendResetPasswordRequestEmail = async ({
  user,
  verification,
  urlOrigin,
}: IResetPasswordRequestProps) => {
  const confirmationLink = `${urlOrigin}/reset-password?token=${verification?.token}`;

  const response = await resendMailService.emails.send({
    from: `${siteConfig?.name} <${siteConfig?.fromEmail}>`,
    replyTo: siteConfig?.email,
    to: [user?.email || ''], // There can be pass an array of emails like ['abc@gmail.com', 'def@gmail.com'] or a single email 'abc@gmail.com
    subject: `Reset your password - ${siteConfig?.name}`,
    headers: {
      'X-Entity-Ref-ID': uuid(), // This will prevent threading in gmail though we send multiple email with same title
    },
    react: ResetPasswordRequestEmailTemplate({
      verification: {
        link: confirmationLink,
      },
      company: siteConfig,
    }),
  });

  if (response?.error) {
    return generateResponse({ code: 'ResetPasswordRequestFailed' });
  }

  return generateResponse({ success: true, code: 'ResetPasswordRequestSent' });
};
