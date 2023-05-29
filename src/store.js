import {  configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartReducer";
import { productListReducers, productDetailsReducers, productDeleteReducers, productCreateReducers, productUpdateReducers, productReviewCreateReducers, productTopRatedReducers } from "./reducers/productReducer";
import thunk from "redux-thunk";
import { userDeleteReducers, userDetailsReducers, userListReducers, userLoginReducers, userRegisterReducers, userUpdateProfileReducers, userUpdateReducers } from "./reducers/userReducer";
import { orderCreateReducer, orderDelieverReducer, orderDetailsReducer, orderListMyReducer, orderListReducer, orderPayReducer } from "./reducers/orderReducer";


const cartItemsFromStorage = localStorage.getItem("cartItems")
  ? (JSON.parse(localStorage.getItem("cartItems")) !== null 
    ? JSON.parse(localStorage.getItem("cartItems")) : [])
  : [];

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? (JSON.parse(localStorage.getItem("userInfo")) !== null 
    ? JSON.parse(localStorage.getItem("userInfo")) : null)
  : null;

const shippingAddressFromStorage = localStorage.getItem("shippingAddress")
  ? (JSON.parse(localStorage.getItem("shippingAddress")) !== null 
    ? JSON.parse(localStorage.getItem("shippingAddress")) : {})
  : {};

const initialState = {
  cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage },
  userLogin: { userInfo: userInfoFromStorage}
};

const middleware = [thunk];


const store = configureStore({
  reducer: {
    productList: productListReducers,
    productDetails: productDetailsReducers,
    cart: cartReducer,
    userLogin: userLoginReducers,
    userRegister: userRegisterReducers,
    userDetails: userDetailsReducers,
    userUpdateProfile: userUpdateProfileReducers,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    orderList: orderListMyReducer,
    userList: userListReducers,
    userDelete: userDeleteReducers,
    userUpdate: userUpdateReducers,
    productDelete: productDeleteReducers,
    productCreate: productCreateReducers,
    productUpdate: productUpdateReducers,
    orderList: orderListReducer,
    orderDeliver: orderDelieverReducer,
    productReviewCreate: productReviewCreateReducers,
    productTopRated: productTopRatedReducers,
  },
  preloadedState: initialState,
  middleware: middleware
});

export default store;
