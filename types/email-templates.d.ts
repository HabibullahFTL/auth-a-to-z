import siteConfig from '@/lib/data/site-configs';

export interface IVerificationEmailTemplate {
  verification: {
    code: string;
    link: string;
  };
  company: typeof siteConfig;
}

export interface IResetPasswordEmailTemplate {
  verification: {
    link: string;
  };
  company: typeof siteConfig;
}
