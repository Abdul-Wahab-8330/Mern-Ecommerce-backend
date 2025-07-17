import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {

    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { orderList, orderDetails } = useSelector(state => state.shopOrder)

    useEffect(() => {
        dispatch(getAllOrdersByUserId(user?.id))
    }, [dispatch])

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true)
    }, [orderDetails])

    console.log(orderDetails, 'orderDetails')

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order Id</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className="sr-only">Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            orderList && orderList.length > 0 ?
                                orderList.slice().reverse().map(orderItem =>
                                    <TableRow>
                                        <TableCell>{orderItem?._id}</TableCell>
                                        <TableCell>{orderItem?.orderDate
                                            ? new Date(orderItem.orderDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge className={`py-1 px-3 rounded-full ${orderItem?.orderStatus?.toString().trim().toLowerCase() === 'confirmed'
                                                ? 'bg-green-600'
                                                : orderItem?.orderStatus?.toString().trim().toLowerCase() === 'rejected'
                                                    ? 'bg-red-600'
                                                    : orderItem?.orderStatus?.toString().trim().toLowerCase() === 'pending'
                                                        ? 'bg-yellow-500'
                                                        : orderItem?.orderStatus?.toString().trim().toLowerCase() === 'inprocess'
                                                            ? 'bg-orange-500'
                                                            : orderItem?.orderStatus?.toString().trim().toLowerCase() === 'inshipping'
                                                                ? 'bg-blue-500'
                                                                : orderItem?.orderStatus?.toString().trim().toLowerCase() === 'delivered'
                                                                    ? 'bg-purple-600'
                                                                    : 'bg-black'
                                                }`}>
                                                {orderItem?.orderStatus || 'No Status Found'}
                                            </Badge>

                                        </TableCell>
                                        <TableCell>${orderItem?.totalAmount}</TableCell>
                                        <TableCell>
                                            <Dialog open={openDetailsDialog} onOpenChange={() => {
                                                setOpenDetailsDialog(false)
                                                dispatch(resetOrderDetails())
                                            }}>
                                                <Button onClick={() => handleFetchOrderDetails(orderItem._id)}>View Details</Button>
                                                <ShoppingOrderDetailsView orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>)
                                : null
                        }

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );

}

export default ShoppingOrders;