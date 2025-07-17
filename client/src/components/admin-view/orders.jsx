import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import AdminOrdersDetailView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedDate, setSelectedDate] = useState("");
    const { orderList, orderDetails } = useSelector(state => state.adminOrder);
    const dispatch = useDispatch();

    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetailsForAdmin(getId));
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin());
    }, [dispatch]);

    useEffect(() => {
        if (orderDetails !== null) setOpenDetailsDialog(true);
    }, [orderDetails]);

    // Filter Logic
    const filteredOrders = orderList
        ?.filter(order => {
            // Status Filter
            if (selectedStatus !== "all" && order.orderStatus?.toLowerCase() !== selectedStatus) {
                return false;
            }

            // Date Filter
            if (selectedDate) {
                const orderDate = new Date(order.orderDate).toLocaleDateString("en-CA"); // format: YYYY-MM-DD
                if (orderDate !== selectedDate) return false;
            }

            return true;
        })
        .slice()
        .reverse();



    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

                {/* Filters */}
                <div className="flex flex-col md:flex-row sm:items-center gap-4">
                    {/* Filter by Status */}
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="inprocess">In Process</SelectItem>
                            <SelectItem value="inshipping">In Shipping</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Filter by Date */}
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="w-full"
                    />
                </div>

                {/* Orders Table */}
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
                            filteredOrders && filteredOrders.length > 0 ? (
                                filteredOrders.map(orderItem => (
                                    <TableRow key={orderItem._id}>
                                        <TableCell>{orderItem?._id}</TableCell>
                                        <TableCell>{orderItem?.orderDate
                                            ? new Date(orderItem.orderDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })
                                            : 'N/A'}
                                        </TableCell>
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
                                            <Dialog
                                                open={openDetailsDialog}
                                                onOpenChange={() => {
                                                    setOpenDetailsDialog(false);
                                                    dispatch(resetOrderDetails());
                                                }}
                                            >
                                                <Button
                                                    onClick={() => handleFetchOrderDetails(orderItem._id)}
                                                >
                                                    View Details
                                                </Button>
                                                <AdminOrdersDetailView orderDetails={orderDetails} />
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center pt-8">No orders found.</TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default AdminOrdersView;
