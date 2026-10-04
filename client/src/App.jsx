import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AppRoutes from "./routes/AppRoutes";
import { initializeAuth } from "./features/auth/authSlice";

const App = () => {
  const dispatch = useDispatch();

  const { isInitialized } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuth());
    }
  }, [dispatch, isInitialized]);

  return <AppRoutes />;
};

export default App;