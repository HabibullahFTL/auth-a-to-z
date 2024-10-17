'use client';
import { VerificationEmailTemplate } from '@/email-templates/verification-email-template';
import siteConfig from '@/lib/data/site-configs';

const TestPage = () => {
  return (
    <VerificationEmailTemplate
      company={siteConfig}
      verification={{
        code: 'kkk',
        link: 'https://www.habibullahftl.com',
      }}
    />
  );
};

export default TestPage;
