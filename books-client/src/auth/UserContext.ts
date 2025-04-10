import { createContext } from "react";
import { UserInfo } from "../model";

export const UserContext = createContext<UserInfo>({
  email: "",
  isGuest: true,
});
