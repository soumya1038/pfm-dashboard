import { useEffect, useState } from "react";

const TOKEN_KEY = "pfm_token";

export const useAuth = () => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  return { token, setToken };
};
