import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { UserInfo } from "../model";
import { useQuery } from "@tanstack/react-query";
import { GetUserInfoQuery } from "../queryKeys";
import { apiAxios } from "../axios";
import { AxiosError } from "axios";

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const userQuery = useQuery({
    queryKey: [GetUserInfoQuery],
    queryFn: async (): Promise<UserInfo | null> => {
      try {
        const res = await apiAxios({
          method: "get",
          url: "/whoami",
        });
        return res.data as UserInfo;
      } catch (err) {
        const e = err as AxiosError;
        if (e.status === 401) {
          console.log("Ignoring 401 from /whoami");
          return null;
        } else throw err;
      }
    },
    retry: 0,
  });

  const newUserInfo = userQuery.data as UserInfo;

  useEffect(() => {
    setUserInfo(newUserInfo);
  }, [newUserInfo]);

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
