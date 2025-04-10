import { useNavigate } from "react-router";
import { apiAxios } from "../axios";
import { useQueryClient } from "@tanstack/react-query";
import { GetUserInfoQuery } from "../queryKeys";

const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  async function onLogout() {
    await apiAxios({
      method: "GET",
      url: "/logout",
    });
    queryClient.invalidateQueries({ queryKey: [GetUserInfoQuery] });
    navigate("/");
  }
  return (
    <button onClick={onLogout} className="secondary-button">
      Logout
    </button>
  );
};

export default Logout;
