import React, { useEffect } from 'react'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import AuthLayout from './components/auth/layout'
import AuthRegister from './pages/auth/register'
import AuthLogin from './pages/auth/login'
import AdminLayout from './components/admin-view/layout'
import AdminDashboard from './pages/admin-view/dashboard'
import AdminProducts from './pages/admin-view/products'
import AdminOrders from './pages/admin-view/orders'
import AdminFeatures from './pages/admin-view/features'
import ShoppingLayout from './components/shopping-view/layout'
import NotFound from './pages/not-found'
import ShoppingHome from './pages/shopping-view/home'
import ShoppingAccount from './pages/shopping-view/account'
import ShoppingListing from './pages/shopping-view/listing'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux'
import { checkAuth } from './store/auth-slice'
import loader from '../src/assets/loading.gif'
import ShoppingCheckout from './pages/shopping-view/checkout'
import PaypalReturnPage from './pages/shopping-view/paypal-return'
import PaymentSuccessPage from './pages/shopping-view/payment-success'
import SearchProducts from './pages/shopping-view/search'

const App = () => {


  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  if (isLoading) return <div className='w-screen h-screen fixed flex justify-center items-center '><img className='w-[40px] h-inherit w-inherit' src={loader} alt="Loading..." /></div>


  return (
    <div className='flex flex-col overflow-auto bg-white'>

      <Routes>
        <Route path='/' element={<Navigate to="/auth/login" replace />} />
        <Route path='/auth' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout />
          </CheckAuth>
        }>
          <Route path='login' element={<AuthLogin />} />
          <Route path='register' element={<AuthRegister />} />
        </Route >
        <Route path='/admin' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path='dashboard' element={<AdminProducts />} />
          <Route path='products' element={<AdminProducts />} />
          <Route path='orders' element={<AdminOrders />} />
          <Route path='features' element={<AdminFeatures />} />
        </Route>
        <Route path='/shop' element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path='home' element={<ShoppingHome />} />
          <Route path='account' element={<ShoppingAccount />} />
          <Route path='checkout' element={<ShoppingCheckout />} />
          <Route path='listing' element={<ShoppingListing />} />
          <Route path='paypal-return' element={<PaypalReturnPage />} />
          <Route path='payment-success' element={<PaymentSuccessPage />} />
          <Route path='search' element={<SearchProducts />} />
        </Route>
        <Route path='*' element={<NotFound />} />
        <Route path='/unauth-page' element={<UnauthPage />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
