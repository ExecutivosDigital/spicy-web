import { CookiesProvider } from "next-client-cookies/server";
import { ActionSheetsProvider } from "./actionSheetsContext";
import { ApiContextProvider } from "./ApiContext";
import { ChatContextProvider } from "./chatContext";
import { LoadingContextProvider } from "./LoadingContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookiesProvider>
        <ApiContextProvider>
          <ChatContextProvider>
            <ActionSheetsProvider>
              <LoadingContextProvider>{children}</LoadingContextProvider>
            </ActionSheetsProvider>
          </ChatContextProvider>
        </ApiContextProvider>
      </CookiesProvider>
    </>
  );
}
