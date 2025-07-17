import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { addNewAddress, deleteAddress, editAddress, fetchAllAddress } from "@/store/shop/address-slice";
import AddressCard from "./address-card";

import toast from 'react-hot-toast'
import { Separator } from "../ui/separator";

const initialAddressFormData = {
    address: '',
    city: '',
    phone: '',
    pincode: '',
    notes: ''
}

function Address({ setCurrentSelectedAddress }) {


    const [formData, setFormData] = useState(initialAddressFormData)
    const [currentEditedId, setCurrentEditedId] = useState(null)
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { addressList } = useSelector(state => state.shopAddress)

    function handleEditAddress(getCurrentAddress) {
        setCurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address: getCurrentAddress?.address,
            city: getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode: getCurrentAddress?.pincode,
            notes: getCurrentAddress?.notes
        })
    }

    function handleDeleteAddress(getCurrentAddress) {
        console.log(getCurrentAddress)
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id }))
            .then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddress(user?.id))
                    toast.success('Address deleted successfully!')
                }
            })
    }


    function handleManageAddress(event) {
        event.preventDefault();

        if (currentEditedId === null && addressList.length >= 3) {
            toast.error('Cannot add more than 3 addresses!');
            setFormData(initialAddressFormData);
            return;
        }

        if (currentEditedId !== null) {
            dispatch(editAddress({
                userId: user?.id,
                addressId: currentEditedId,
                FormData: formData
            })).then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddress(user?.id));
                    setCurrentEditedId(null);
                    setFormData(initialAddressFormData);
                    toast.success('Address updated successfully!');
                }
            });
        } else {
            dispatch(addNewAddress({
                ...formData,
                userId: user?.id
            })).then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchAllAddress(user?.id));
                    setFormData(initialAddressFormData);
                    toast.success('Address added successfully!');
                }
            });
        }
    }

    useEffect(() => {
        dispatch(fetchAllAddress(user?.id))
    }, [dispatch])





    return (
        <Card>
            <div className="text-md font-bold px-5">Select Address</div>
            <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {
                    addressList && addressList.length > 0 ?
                        addressList.map(singleAddressItem =>
                            <AddressCard setCurrentSelectedAddress={setCurrentSelectedAddress}
                                handleEditAddress={handleEditAddress} handleDeleteAddress={handleDeleteAddress} key={singleAddressItem?._id} addressInfo={singleAddressItem} />)
                        : null
                }
            </div>
            <CardHeader>
                <Separator />
                <CardTitle>{
                    currentEditedId !== null ? 'Edit Address' : 'Add New Address'
                }</CardTitle>
                <Separator />
            </CardHeader>
            <CardContent className='space-y-3'>
                <CommonForm formControls={addressFormControls}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                    onSubmit={handleManageAddress}
                />
            </CardContent>
        </Card>
    );
}

export default Address;