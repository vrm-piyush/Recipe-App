import { createAuthProvider } from "react-token-auth";

export const { useAuth, authFetch, login, logout } = createAuthProvider({
  accessTokenKey: "accessToken",
  onUpdateToken: (token) =>
    fetch("http://localhost:5000/auth/refresh", {
      method: "POST",
      body: token.refresh_token,
    }).then((r) => r.json()),
});
