'use client';
import { TwoFactorTokenEmailTemplate } from '@/email-templates/two-factor-token-email-template';
import siteConfig from '@/lib/data/site-configs';

const TestPage = () => {
  return (
    <TwoFactorTokenEmailTemplate
      company={siteConfig}
      verification={{
        code: '123456',
      }}
    />
  );
};

export default TestPage;
