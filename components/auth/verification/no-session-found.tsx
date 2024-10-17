'use client';

import Loader from '@/components/common/loader';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';

const NoSessionFound = () => {
  useEffect(() => {
    signOut();
  }, []);
  return <Loader />;
};

export default NoSessionFound;
