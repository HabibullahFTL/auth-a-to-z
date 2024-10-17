import { signIn } from 'next-auth/react';
import { IconType } from 'react-icons/lib';
import { Button } from '../ui/button';

interface IProps {
  icon: IconType;
  provider: 'google' | 'github';
}

const SocialLoginButton = ({ icon: Icon, provider }: IProps) => {
  return (
    <Button
      variant={'ghost'}
      className="border"
      size={'lg'}
      onClick={async () => {
        await signIn(provider);
      }}
    >
      <Icon className="text-xl" />
    </Button>
  );
};

export default SocialLoginButton;
