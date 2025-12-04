import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

const AddProduct = () => {

  const { token } = useAuth()

  return (

    <Layout>
      <h1>AddProduct</h1>
    </Layout>
  );
};

export default AddProduct;