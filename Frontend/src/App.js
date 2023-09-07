import './App.css';
import Header from './Components/layout/Header/Header';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Footer from './Components/layout/Footer/Footer';
import Home from './Components/layout/Home/Home';
import ProductDetails from './Components/layout/Home/ProductDetails';
import Products from './Components/layout/Product/Products';
import Search from './Components/layout/Search/Search';
import LoginSignup from './Components/User/LoginSignup';
import { useEffect } from 'react';
import store from '../src/Components/Store/Store'
import { loadUser } from '../src/Components/Store/Actions/userAction'
import { useSelector } from 'react-redux';
import UserOptions from './Components/layout/Header/UserOptions';
import Profile from './Components/layout/Profile/Profile';
import UpdateProfile from './Components/layout/updateProfile/UpdateProfile';
import UpdatePassword from './Components/layout/UpdatePassword/UpdatePassword';
import ForgotPassword from './Components/layout/ForgotPassword/ForgotPassword';
import ResetPassword from './Components/layout/ResetPassword/ResetPassword';
import Cart from './Components/layout/Cart/Cart';
import Shipping from './Components/layout/Shipping/Shipping';
import ConfirmOrder from './Components/layout/Shipping/ConfirmOrder';
import Tripe from './Components/layout/Shipping/Tripe';
import OrderSuccess from './Components/layout/Order/OrderSuccess'
import MyOrders from './Components/layout/Order/MyOrders';
import OrderDetails from './Components/layout/Order/OrderDetails';
import Dashboard from './Components/layout/Admin/Dashboard'
import ProductList from './Components/layout/Admin/ProductList';
import NewProduct from './Components/layout/Admin/NewProduct'
import UpdateProduct from './Components/layout/Admin/UpdateProduct';
import OrderList from './Components/layout/Admin/OrderList';
import ProcessOrder from './Components/layout/Admin/ProcessOrder';
import UsersList from './Components/layout/Admin/UsersList'
import UpdateUser from './Components/layout/Admin/UpdateUser'
import ProductReviews from './Components/layout/Admin/ProductReviews'
import About from './Components/layout/About/About'
import Contact from './Components/layout/Contact/Contact'
import NotFound from './Components/layout/Not Found/NotFound'
import ProtectedRoute from './Components/layout/Route/ProtectedRoute';
import AdminRoute from './Components/layout/Route/AdminRoute';
function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user)
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/product/:id' element={<ProductDetails />} />
        <Route exact path='/products' element={<Products />} />
        <Route exact path='/products/:keyword' element={<Products />} />
        <Route exact path='/search' element={<Search />} />
        <Route exact path="/login" element={<LoginSignup />} />
        <Route exact path="/about" element={<About />} />
        <Route exact path="/contact" element={<Contact />} />
        <Route exact path="/password/forgot" element={<ForgotPassword />} />
        <Route exact path="/password/reset/:token" element={<ResetPassword />} />
        <Route exact path="/cart" element={<Cart />} />
        <Route path='*' element={<NotFound />} />

        <Route element={<ProtectedRoute />}>
          <Route exact path="/order/confirm" element={<ConfirmOrder />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/me/update" element={<UpdateProfile />} />
          <Route exact path="/password/update" element={<UpdatePassword />} />
          <Route exact path="/shipping" element={<Shipping />} />
          <Route exact path="/process/payment" element={<Tripe />} />
          <Route exact path="/success" element={<OrderSuccess />} />
          <Route exact path="/order/me" element={<MyOrders />} />
          <Route exact path="/order/:id" element={<OrderDetails />} />
        </Route>
        <Route element={<AdminRoute />}>
          <Route exact path="/admin/dashboard" element={<Dashboard />} />
          <Route exact path="/admin/products" element={<ProductList />} />
          <Route exact path="/admin/product/new" element={<NewProduct />} />
          <Route exact path="/admin/product/:id" element={<UpdateProduct />} />
          <Route exact path="/admin/orders" element={<OrderList />} />
          <Route exact path="/admin/order/:id" element={<ProcessOrder />} />
          <Route exact path="/admin/users" element={<UsersList />} />
          <Route exact path="/admin/user/:id" element={<UpdateUser />} />
          <Route exact path="/admin/reviews" element={<ProductReviews />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
