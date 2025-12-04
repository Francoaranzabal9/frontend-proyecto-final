import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const Login = () => {

  const { login } = useAuth()

  return (
    <Layout>
      <h1>Login</h1>
    </Layout>
  );
};

export default Login;