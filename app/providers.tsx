'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import QueryWrapper from '@/lib/query';
import { AuthProvider } from '@/contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryWrapper>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryWrapper>
    </Provider>
  );
}