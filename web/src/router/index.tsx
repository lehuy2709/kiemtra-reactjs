import { createBrowserRouter } from "react-router-dom";
import ProductsPage from "../components/Product";
import OrdersPage from "../components/Order";

const router = createBrowserRouter([
    {
        path: "/products",
        element: <ProductsPage/>
    },
    {
        path: "/orders",
        element: <OrdersPage></OrdersPage>
    }
])
export default router