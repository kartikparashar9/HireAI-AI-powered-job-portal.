import { useSelector } from "react-redux";

const useAuth = () => {
  const auth = useSelector((state) => state.auth);

  return {
    user: auth.user,
    accessToken: auth.accessToken,
    isAuthenticated: auth.isAuthenticated,
    isInitialized: auth.isInitialized,
    isLoading: auth.isLoading,
    error: auth.error,
    successMessage: auth.successMessage,
  };
};

export default useAuth;