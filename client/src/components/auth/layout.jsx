import { ShoppingBag, ShoppingBagIcon } from 'lucide-react'
import React from 'react'
import { GiShoppingCart } from 'react-icons/gi'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
    return (
        <div className='flex min-h-screen w-full'>
            <div className=' hidden lg:flex justify-center items-center bg-orange-600 w-1/2 px-12 text-white'>
                <div className='max-w-md space-y-6 text-center text-primary-foreground'>
                     <h1 className='text-4xl font-extrabold tracking-tight'>Welcome to Ecommerce Shopping</h1>
                     <div className='w-full h-full flex justify-center items-center'>
                        <GiShoppingCart className='w-35 h-35'/>
                     </div>
                </div>
            </div>
            
            <div className='auth-image flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8'>
                <Outlet/>
            </div>
        </div>
    )
}

export default AuthLayout
