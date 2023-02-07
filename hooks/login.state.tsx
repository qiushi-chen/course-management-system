import { useEffect } from 'react';
import { useRouter } from 'next/router';
import storage from '@/lib/service/storage';
import { Role } from '@/lib/model/role';

export const useLoginState = () => {
  const router = useRouter();

  useEffect(() => {
    if (!storage.token) {
      router.push('/login', undefined, { shallow: true });
    }

    if (!!storage.role) {
      router.push(`/dashboard/${storage.role}`, undefined, { shallow: true });
    }
  }, [router]);
};

export const useUserRole = () => {
  const router = useRouter();
  console.log('1', storage.role());
  console.log('2', router.route.split('/')[2] as Role);

  return storage.role() || (router.route.split('/')[2] as Role);
};
