import { Navigate } from "react-router";
import { useUserInfo } from "../auth/useUserInfo";
import AdminBooks from "./AdminBooks";

const Admin = () => {
  const userInfo = useUserInfo();
  if (userInfo.isGuest) return <Navigate to="/" replace={true} />;
  return (
    <>
      <AdminBooks />
    </>
  );
};

export default Admin;
