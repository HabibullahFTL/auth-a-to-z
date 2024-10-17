import siteConfig from '@/lib/data/site-configs';

export interface IVerificationEmailTemplate {
  verification: {
    code: string;
    link: string;
  };
  company: typeof siteConfig;
}
