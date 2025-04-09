import { useState } from "react";
import AuthContext from "./AuthContext";

type Props = { children: React.ReactNode };

const AuthProvider = ({ children }: Props) => {
  const [accessToken, _setAccessToken] = useState<string | undefined>();
  return (
    <AuthContext.Provider value={accessToken}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
