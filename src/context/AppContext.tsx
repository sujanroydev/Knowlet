"use client";

import { AuthProvider } from "./AuthContext";
import { HeaderProvider } from "./HeaderContext";
import { ReaderProvider } from "./ReaderContext";
import { KnowvaProvider } from "./KnowvaContext";
import { DrawerProvider } from "./DrawerContext";
import { ThemeProvider } from "./ThemeContext";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HeaderProvider>
          <ReaderProvider>
            <KnowvaProvider>
              <DrawerProvider>{children}</DrawerProvider>
            </KnowvaProvider>
          </ReaderProvider>
        </HeaderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
