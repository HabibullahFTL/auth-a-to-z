'use client';

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import Loader from '../common/loader';

const NoSessionFound = () => {
  useEffect(() => {
    signOut();
  }, []);
  return <Loader />;
};

export default NoSessionFound;
