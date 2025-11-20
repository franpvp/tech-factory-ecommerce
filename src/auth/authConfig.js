
import { PublicClientApplication } from "@azure/msal-browser";
export const msalConfig = {
  auth: {
    clientId: "CLIENT_ID",
    authority: "https://login.microsoftonline.com/TENTANT",
    redirectUri: "/",        
    postLogoutRedirectUri: `${window.location.origin}/`,
  },
};

export const loginRequest = {
  scopes: ["User.Read"],
};

export const msalInstance = new PublicClientApplication(msalConfig);