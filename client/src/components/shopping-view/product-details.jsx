import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import toast from "react-hot-toast";
import { setProductDetails } from "@/store/shop/products-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {

    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.shopCart)

    const dispatch = useDispatch()
    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        let getCartItems = cartItems.items || []
        if (getCartItems.length) {
            const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId)
            if (indexOfCurrentItem > -1) {
                const getQuantity = getCartItems[indexOfCurrentItem].quantity;
                if (getQuantity + 1 > getTotalStock) {
                    toast.error(`Only ${getQuantity} quantity can be added for this product.`)
                    return;
                }
            }
        }


        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
            .then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id))
                    toast.success('Product added to cart')
                }
            })
    }
    function handleDialogClose() {
        setOpen(false)
        dispatch(setProductDetails())
    }

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent
                className="max-h-[85vh] md:max-h-[90vh] rounded-lg overflow-y-auto sm:p-10 p-4 w sm:max-w-[80vw] lg:max-w-[70vw]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="w-full relative overflow-hidden rounded-lg pt-5">
                        <img
                            src={productDetails?.image}
                            alt={productDetails?.title}
                            className="w-full  sm:h-[400px] object-cover rounded-md"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col items-start gap-4">
                        <h1 className="text-2xl sm:text-3xl font-bold">
                            {productDetails?.title}
                        </h1>
                        <p className="text-muted-foreground text-base sm:text-lg">
                            {productDetails?.description}
                        </p>

                        <div className="flex justify-between items-center w-full">
                            <p
                                className={`text-xl font-bold text-primary  ${productDetails?.salePrice > 0 ? "line-through" : ""
                                    }`}
                            >
                                ${productDetails?.price}
                            </p>
                            {productDetails?.salePrice > 0 && (
                                <p className="text-orange-600 text-2xl font-semibold ">
                                    ${productDetails?.salePrice}
                                </p>
                            )}
                        </div>

                        {/* Ratings */}
                        <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-0.5">
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <StarIcon key={i} className="w-5 h-5 text-yellow-500 fill-amber-500 " />
                                    ))}
                            </div>
                            <span className="text-muted-foreground text-sm">(4.5)</span>
                        </div>

                        {/* Add to Cart Button */}
                        {
                            productDetails?.totalStock === 0 ?
                                <Button disabled={true} onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalStock)} className="w-full mt-4   ">Out Of Stock</Button>
                                : <Button onClick={() => handleAddtoCart(productDetails?._id, productDetails?.totalStock)} className="w-full mt-4">Add to Cart</Button>


                        }

                        <Separator className="my-4" />

                        {/* Reviews Section */}
                        <div className="w-full">
                            <h2 className="text-lg font-bold mb-3">Reviews</h2>
                            <div className="space-y-6 max-h-[200px] overflow-y-auto pr-1">
                                {[...Array(3)].map((_, i) => (
                                    <div className="flex gap-4" key={i}>
                                        <Avatar className="w-10 h-10 border">
                                            <AvatarFallback>AW</AvatarFallback>
                                        </Avatar>
                                        <div className="grid gap-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold">Zain Asif</h3>
                                            </div>
                                            <div className="flex items-center gap-0.5">
                                                {Array(5)
                                                    .fill(0)
                                                    .map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            className=" w-4 h-4 text-yellow-500 fill-amber-500"
                                                        />
                                                    ))}
                                            </div>
                                            <p className="text-muted-foreground text-sm">
                                                This is an awesome product.
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Review Input */}
                            <div className="mt-4 flex gap-2">
                                <Input placeholder="Write a review..." />
                                <Button className='bg-orange-600 hover:bg-amber-700'>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;
