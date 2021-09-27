import React from "react";
import { useRealmApp, RealmAppProvider } from "./UserContext";
import NotesScreen from "./NotesScreen";
import LogIn from "./LogIn";

export const APP_ID = "kepper-app-dnryf";

const RequireLoggedInUser = ({ children }) => {
  // Only render children if there is a logged in user.
  const app = useRealmApp();

  return app.currentUser ? children : <LogIn />;
};

export default function app() {
  return (
    <RealmAppProvider appId={APP_ID}>
      <RequireLoggedInUser>
        <NotesScreen />
      </RequireLoggedInUser>
    </RealmAppProvider>
  );
}
