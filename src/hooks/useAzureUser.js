import { useMsal } from "@azure/msal-react";

export function useAzureUser() {
  const { accounts } = useMsal();

  if (!accounts || accounts.length === 0) {
    return null;
  }

  const account = accounts[0];

  return {
    name: account.name,
    email: account.username,
    isAuthenticated: true
  };
}