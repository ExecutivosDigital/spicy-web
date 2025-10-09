import { CookiesProvider } from "next-client-cookies/server";
import { ActionSheetsProvider } from "./actionSheetsContext";
import { ApiContextProvider } from "./ApiContext";
import { ChatContextProvider } from "./chatContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookiesProvider>
        <ApiContextProvider>
          <ChatContextProvider>
            <ActionSheetsProvider>
              {/* Any other Context Providers */}
              {children}
            </ActionSheetsProvider>
            {/* Any other Context Providers */}
          </ChatContextProvider>
        </ApiContextProvider>
      </CookiesProvider>
    </>
  );
}
