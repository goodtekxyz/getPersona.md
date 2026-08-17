'use client';

import { useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from '@/i18n/navigation';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !data?.user) {
      router.replace('/sign-in');
    }
  }, [data, isPending, router]);

  if (isPending) {
    return <p className="support">…</p>;
  }
  if (!data?.user) {
    return null;
  }
  return <>{children}</>;
}
