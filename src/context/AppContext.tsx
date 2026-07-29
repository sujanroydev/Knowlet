"use client";

import { AuthProvider } from "./AuthContext";
import { HeaderProvider } from "./HeaderContext";
import { ReaderProvider } from "./ReaderContext";
import { KnowvaProvider } from "./KnowvaContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <HeaderProvider>
        <ReaderProvider>
          <KnowvaProvider>
            {children}
          </KnowvaProvider>
        </ReaderProvider>
      </HeaderProvider>
    </AuthProvider>
  );
}
