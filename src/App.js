import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/header";
import Footer from "./components/footer";
import HomeScreen from "./screens/homescreen";
import ProductScreen from "./screens/productscreen";
import CartScreen from "./screens/cartscreen";
import LoginScreen from "./screens/loginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/profileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import UserEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header></Header>
        <main>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart/:id?" element={<CartScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/admin/userList" element={<UserListScreen/>} />
              <Route path="/admin/user/:id/edit" element={<UserEditScreen/>} />
              <Route path="/admin/productlist" element={<ProductListScreen/>} />
              <Route path="/admin/product/:id/edit" element={<ProductEditScreen/>} />
              <Route path="/admin/orderlist" element={<OrderListScreen/>} />
            </Routes>
          </Container>
        </main>
        <Footer></Footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
