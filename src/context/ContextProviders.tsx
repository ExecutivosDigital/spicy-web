import { CookiesProvider } from "next-client-cookies/server";
import { ApiContextProvider } from "./ApiContext";
import { ChatContextProvider } from "./chatContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookiesProvider>
        <ApiContextProvider>
          <ChatContextProvider>
            {/* Any other Context Providers */}
            {children}
            {/* Any other Context Providers */}
          </ChatContextProvider>
        </ApiContextProvider>
      </CookiesProvider>
    </>
  );
}
