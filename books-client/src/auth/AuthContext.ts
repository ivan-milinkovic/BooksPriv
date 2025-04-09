import { createContext } from "react";

const AuthContext = createContext<string | undefined>(undefined);
export default AuthContext;
