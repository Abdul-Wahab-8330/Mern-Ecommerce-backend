import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

function ShoppingOrderDetailsView({ orderDetails }) {

    const { user } = useSelector(state => state.auth)

    return (
        <DialogContent className='sm:max-w-[600px] max-h-[95vh] overflow-auto'>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <div className="flex mt-6 items-center justify-between">
                        <p className="font-semibold ">Order ID</p>
                        <Label>{orderDetails?._id}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-semibold ">Order Date</p>
                        <Label>{orderDetails?.orderDate
                            ? new Date(orderDetails.orderDate).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })
                            : 'N/A'}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-semibold ">Order Status</p>
                        <Label>
                            <Badge className={`py-1 px-3 rounded-full ${orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'confirmed'
                                    ? 'bg-green-600'
                                    : orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'rejected'
                                        ? 'bg-red-600'
                                        : orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'pending'
                                            ? 'bg-yellow-500'
                                            : orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'inprocess'
                                                ? 'bg-orange-500'
                                                : orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'inshipping'
                                                    ? 'bg-blue-500'
                                                    : orderDetails?.orderStatus?.toString().trim().toLowerCase() === 'delivered'
                                                        ? 'bg-purple-600'
                                                        : 'bg-black'
                                }`}>
                                {orderDetails?.orderStatus || 'No Status Found'}
                            </Badge>

                        </Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-semibold ">Order Price</p>
                        <Label>${orderDetails?.totalAmount}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-semibold ">Payment Method</p>
                        <Label>{orderDetails?.paymentMethod}</Label>
                    </div>
                    <div className="flex mt-2 items-center justify-between">
                        <p className="font-semibold ">Payment Status</p>
                        <Label>{orderDetails?.paymentStatus}</Label>
                    </div>
                </div>
                <Separator />
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-bold">Order Details</div>
                        <ul className="grid gap-3">
                            {
                                orderDetails?.cartItems && orderDetails?.cartItems.length > 0 ?
                                    orderDetails.cartItems.map(item =>
                                        <li className="flex items-center justify-between">
                                            <span>{item.title}</span>
                                            <span>Quantity: {item.quantity}</span>
                                            <span>Price: ${item.price}</span>
                                        </li>) : null
                            }

                        </ul>
                    </div>
                </div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <div className="font-semibold">Shipping Details</div>
                        <div className="grid gap-0.5 text-muted-foreground">
                            <span>{user?.userName}</span>
                            <span>{orderDetails?.addressInfo?.address}</span>
                            <span>{orderDetails?.addressInfo?.city}</span>
                            <span>{orderDetails?.addressInfo?.pincode}</span>
                            <span>{orderDetails?.addressInfo?.phone}</span>
                            <span>{orderDetails?.addressInfo?.notes ? orderDetails?.addressInfo.notes : 'No Notes'}</span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}

export default ShoppingOrderDetailsView;