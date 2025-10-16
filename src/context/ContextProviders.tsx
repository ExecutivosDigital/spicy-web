import { CookiesProvider } from "next-client-cookies/server";
import { ActionSheetsProvider } from "./actionSheetsContext";
import { ApiContextProvider } from "./ApiContext";
import { ChatContextProvider } from "./chatContext";
import { LoadingContextProvider } from "./LoadingContext";
import { ModelGalleryContextProvider } from "./ModelGalleryContext";

export function ContextProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CookiesProvider>
        <ApiContextProvider>
          <ChatContextProvider>
            <ModelGalleryContextProvider>
              <ActionSheetsProvider>
                <LoadingContextProvider>{children}</LoadingContextProvider>
              </ActionSheetsProvider>
            </ModelGalleryContextProvider>
          </ChatContextProvider>
        </ApiContextProvider>
      </CookiesProvider>
    </>
  );
}
