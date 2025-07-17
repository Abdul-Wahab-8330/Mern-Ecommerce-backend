import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { LucideShoppingBasket, ShoppingBasket, ShoppingCart } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
    const navigate = useNavigate()

    const totalCartAmount = cartItems && cartItems.length > 0 ?
        cartItems.reduce((sum, currentItem) =>
            sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price)
            * currentItem?.quantity, 0)
        : 0;

    return (
        <SheetContent className='sm:max-w-md px-5 pb-2 overflow-auto'>
            <SheetHeader>
                <SheetTitle className='font-semibold'>Your Cart</SheetTitle>
                <Separator />
            </SheetHeader>

            <div className="mt-8 space-y-4 h-full">
                {
                    cartItems && cartItems.length > 0 ?
                        cartItems.map(item => <UserCartItemsContent cartItem={item} />)
                        : <div className="w-full h-full flex flex-col justify-center items-center">
                            <div className=""><ShoppingCart className="h-24 w-24 text-orange-600" /></div>
                            <div className="text-lg text-black font-bold py-4 text-center ">No Items in Cart</div>
                        </div>
                }
            </div>
            <Separator/>

            {cartItems && cartItems.length > 0 ?

                <div className="mt-8 space-y-4">
                    <div className="flex justify-between">
                        <span className="font-bold">Total</span>
                        <span className="font-bold">${totalCartAmount}</span>
                    </div>
                </div>
                : null
            }
            {cartItems && cartItems.length > 0 ?
                <Button onClick={() => {
                    navigate('/shop/checkout')
                    setOpenCartSheet(false)
                }} className='w-full mt-6'>Checkout</Button>
                : null
            }
        </SheetContent>
    );
}

export default UserCartWrapper;