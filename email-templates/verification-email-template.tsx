import { IVerificationEmailTemplate } from '@/types/email-templates';
import {
  Body,
  Button,
  Container,
  Heading,
  Html,
  Img,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';

export const VerificationEmailTemplate = ({
  type = 'sign-up',
  verification,
  company,
}: IVerificationEmailTemplate) => {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            maxWidth: {
              '600px': '600px',
            },
            colors: {
              body: '#e1dcdc',
              secondary: '#f1f1f1',
              header: '#0056b3',
              button: '#f56a00',
              otp: '#007bff',
            },
          },
        },
      }}
    >
      <Html>
        <Body className="bg-body font-sans p-0">
          <Container className="w-full max-w-600px bg-white rounded-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-header py-6 px-5 text-center">
              <div className="w-full">
                <Img
                  src="https://i.ibb.co.com/7Qqm279/mail-icon.png"
                  alt="Email Icon"
                  width="40"
                  height="40"
                  className="mx-auto"
                />
              </div>
              <Heading className="text-white my-2.5 text-lg">
                {type === 'sign-up'
                  ? 'Thank You for Signing Up!'
                  : 'Confirm Your New Email Address'}
              </Heading>
              <Heading className="text-white my-2.5 text-3xl font-semibold">
                Verify Email Address
              </Heading>
            </div>

            {/* Content Section */}
            <div className="py-4 px-6 text-gray-800 text-center">
              {type === 'change-email' ? (
                <Text className="text-base leading-5 !mt-2 !mb-0">
                  You have requested to change your email address to this one.
                  Please verify this new email address by clicking the link
                  below.
                </Text>
              ) : (
                <>
                  <Text className="text-base leading-5 !mt-2 !mb-0">
                    To activate your account, please verify your email address.
                    Your OTP is:
                  </Text>
                  <Text className="bg-secondary text-2xl text-otp px-8 py-4 rounded-lg tracking-[12px] font-semibold mb-4 inline-block">
                    {verification?.code}
                  </Text>

                  <Text className="text-base leading-5 !mb-1">
                    Or, you can click the button below to verify your email:
                  </Text>
                </>
              )}
              <Button
                href={verification?.link}
                className="bg-button text-white py-3 px-5 no-underline rounded-md text-base mt-2"
              >
                VERIFY YOUR EMAIL
              </Button>
              {type === 'change-email' ? (
                <Text className="text-base leading-5 !mb-1 mt-4">
                  If you did not request to change your email address, please
                  ignore this email or contact support.
                </Text>
              ) : (
                <Text className="text-base leading-5 !mb-1 mt-4">
                  If you did not request to sign up, please ignore this email or
                  contact support.
                </Text>
              )}
            </div>

            {/* Footer Section */}
            <div className="bg-secondary p-5 text-center">
              <Text className="text-sm !mt-0 text-gray-800">
                Thank you for choosing us! <br /> {company?.name} Team
              </Text>
              <Text className="!mb-0 text-sm text-gray-800">Get in touch</Text>
              <Text className="!my-0 text-sm text-gray-800">
                {company?.phone}
              </Text>
              <Text className="!my-0 text-sm text-gray-800">
                {company?.email}
              </Text>

              {/* Social Media Links */}
              <div className="w-full mt-4 mb-0">
                <div className="inline-flex mx-auto">
                  <Link
                    href={`mailto:${company?.email}`}
                    className="mx-2 no-underline"
                  >
                    <Img
                      src="https://i.ibb.co.com/jRJGPjY/mail-icon-black.png"
                      alt="Email"
                      width="24"
                      height="24"
                    />
                  </Link>
                  <Link href={company?.facebook} className="mx-2 no-underline">
                    <Img
                      src="https://i.ibb.co.com/mtK26Mt/facebook-icon.png"
                      alt="Facebook"
                      width="24"
                      height="24"
                    />
                  </Link>
                  <Link href={company?.linkedin} className="mx-2 no-underline">
                    <Img
                      src="https://i.ibb.co.com/ys8FLHT/linkedin-icon.png"
                      alt="LinkedIn"
                      width="24"
                      height="24"
                    />
                  </Link>
                  <Link href={company?.instagram} className="mx-2 no-underline">
                    <Img
                      src="https://i.ibb.co.com/GJftwfS/instagram-icon.png"
                      alt="Instagram"
                      width="24"
                      height="24"
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Copyright Section */}
            <div className="bg-gray-900 text-white p-4 text-center">
              <Text className="text-xs m-0">
                Copyrights © {company?.name} All Rights Reserved
              </Text>
            </div>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
};
