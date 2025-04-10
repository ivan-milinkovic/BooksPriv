import { useContext } from "react";
import { UserContext } from "./UserContext";

export function useUserInfo() {
  return useContext(UserContext);
}
