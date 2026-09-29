import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../utils/constants";

const RecruiterProtectedRoute = () => {
  return <RoleProtectedRoute allowedRoles={[ROLES.RECRUITER]} />;
};

export default RecruiterProtectedRoute;