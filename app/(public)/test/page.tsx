'use client';
import { ResetPasswordRequestEmailTemplate } from '@/email-templates/reset-password-email-template';
import siteConfig from '@/lib/data/site-configs';

const TestPage = () => {
  return (
    <ResetPasswordRequestEmailTemplate
      company={siteConfig}
      verification={{
        link: 'https://www.habibullahftl.com',
      }}
    />
  );
};

export default TestPage;
