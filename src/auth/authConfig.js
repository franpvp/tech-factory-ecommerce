
import { PublicClientApplication } from "@azure/msal-browser";
export const msalConfig = {
  auth: {
    clientId: "967bfb43-f7a4-47db-8502-588b15908297",
    authority: "https://login.microsoftonline.com/ba56039b-5f8d-4ed6-9375-45ff34bb5a71",
    redirectUri: "/",        
    postLogoutRedirectUri: `${window.location.origin}/`,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);