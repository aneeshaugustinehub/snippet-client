import { Navigate } from "react-router-dom";
import Loading from "./Loading";
import JoinToday from "../page/JoinToday";
import { useUser } from "./UserContext";

export default function PublicRoute({ children }) {
  const { user, userError, userIsLoading } = useUser();
  const isLoggedIn = !!user;
  
  if (userIsLoading) {
    return <Loading />;
  }
  if (userError) {
    return <JoinToday/>;
  }
  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }
  return children;
}
