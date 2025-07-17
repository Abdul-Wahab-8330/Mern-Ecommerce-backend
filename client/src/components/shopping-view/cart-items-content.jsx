import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";
import toast from "react-hot-toast";
import { Separator } from "../ui/separator";

function UserCartItemsContent({ cartItem }) {
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.shopCart)
    const { productList } = useSelector(state => state.shopProducts)



    const dispatch = useDispatch()
    function handleUpdateQuantity(getCartItem, typeOfAction) {

        if (typeOfAction == 'plus') {
            let getCartItems = cartItems.items || []
            if (getCartItems.length) {
                const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCartItem?.productId)
                const getCurrentProductIndex = productList.findIndex(product => product._id === getCartItem?.productId)
                const getTotalStock = productList[getCurrentProductIndex].totalStock
                if (indexOfCurrentCartItem > -1) {
                    const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                    if (getQuantity + 1 > getTotalStock) {
                        toast.error(`Only ${getQuantity} quantity can be added for this product.`)
                        return;
                    }
                }

            }
        }
        if (typeOfAction === 'plus') {
            dispatch(updateCartQuantity({
                userId: user?.id,
                productId: getCartItem?.productId,
                quantity: getCartItem?.quantity + 1
            })).then(data => {
                if (data?.payload?.success) {
                    toast.success('Cart items updated successfully!');
                }
            });
        } else if (typeOfAction === 'minus' && getCartItem?.quantity > 1) {
            dispatch(updateCartQuantity({
                userId: user?.id,
                productId: getCartItem?.productId,
                quantity: getCartItem?.quantity - 1
            })).then(data => {
                if (data?.payload?.success) {
                    toast.success('Cart items updated successfully!');
                }
            });
        }

    }
    function handleCartItemDelete(getCartItem) {
        dispatch(deleteCartItem({ userId: user?.id, productId: getCartItem?.productId }))
            .then(data => {
                if (data?.payload?.success) {
                    toast.success('Cart item deleted successfully!')
                }
            })
    }

    return (
        <>
            <div className="flex items-center space-x-4">
                <img src={cartItem?.image} alt={cartItem?.title}
                    className="w-20 h-20 rounded object-cover" />
                <div className="flex-1">
                    <h3 className="font-bold">{cartItem?.title}</h3>
                    <div className="flex items-center mt-1 gap-2">
                        <Button disabled={cartItem?.quantity === 1}
                            onClick={() => handleUpdateQuantity(cartItem, 'minus')}
                            className='h-8 w-8 rounded-full' variant='outline' size='icon'>
                            <Minus className="w-4 h-4" />
                            <span className="sr-only">Decrease</span>
                        </Button>
                        <span className="font-semibold">{cartItem?.quantity}</span>
                        <Button onClick={() => handleUpdateQuantity(cartItem, 'plus')}
                            className='h-8 w-8 rounded-full' variant='outline' size='icon'>
                            <Plus className="w-4 h-4" />
                            <span className="sr-only">Increase</span>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <p className="font-semibold">
                        ${((cartItem?.salePrice > 0 ?
                            cartItem?.salePrice :
                            cartItem?.price) * cartItem?.quantity).toFixed(2)}
                    </p>
                    <div onClick={() => handleCartItemDelete(cartItem)} className="h-9 w-9 flex justify-center items-center bg-gray-100 rounded-full hover:border-2 cursor-pointer "><Trash className="cursor-pointer  " size={20} /></div>
                </div>
            </div>

            <Separator className='mt-4' />
        </>


    );
}

export default UserCartItemsContent;