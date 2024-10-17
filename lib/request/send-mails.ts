import { User } from '@prisma/client';
import { Resend } from 'resend';
import { v4 as uuid } from 'uuid';
import { VerificationEmailTemplate } from '../../email-templates/verification-email-template';
import siteConfig from '../data/site-configs';
import { generateResponse } from './generate-response';

interface IProps {
  urlOrigin: string;
  user: Partial<User>;
  verification: {
    token: string;
    code: string;
  };
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async ({
  user,
  verification,
  urlOrigin,
}: IProps) => {
  const confirmationLink = `${urlOrigin}/email-verification?token=${verification?.token}`;

  const response = await resend.emails.send({
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
