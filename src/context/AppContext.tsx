"use client";

import { AuthProvider } from "./AuthContext";
import { HeaderProvider } from "./HeaderContext";
import { ReaderProvider } from "./ReaderContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HeaderProvider>
        <ReaderProvider>{children}</ReaderProvider>
      </HeaderProvider>
    </AuthProvider>
  );
}
