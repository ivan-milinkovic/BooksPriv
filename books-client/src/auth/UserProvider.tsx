import { UserContext } from "./UserContext";
import { UserInfo } from "../model/model";
import { useQuery } from "@tanstack/react-query";
import { GetUserInfoQuery } from "../queries/queryKeys";
import { apiAxios } from "../axios";
import { AxiosError } from "axios";

type Props = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: Props) => {
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

  if (userQuery.isLoading || userQuery.isRefetching) {
    return <>Checking user...</>;
  }

  const newUserInfo = userQuery.data as UserInfo;

  return (
    <UserContext.Provider value={newUserInfo}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
