import { Delete, Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent,  CardHeader } from "../ui/card";
import { Label } from "../ui/label";

function AddressCard({addressInfo, handleDeleteAddress, handleEditAddress,setCurrentSelectedAddress}) {
    return ( 
        <Card onClick={setCurrentSelectedAddress? ()=>setCurrentSelectedAddress(addressInfo) : null} className='cursor-pointer py-4 hover:border-gray-600 border-2'>
            <CardHeader className=' flex justify-end space-x-2'>
                <Button onClick={()=>handleEditAddress(addressInfo)} className='h-7 w-7 bg-background text-black border hover:bg-background'><Edit variant='outline' className="h-4 w-4 cursor-pointer"/></Button>
                <Button onClick={()=>handleDeleteAddress(addressInfo)} className='h-7 w-7 bg-background text-black border hover:bg-ba  ckground'><Trash variant='outline'  className="h-4 w-4 cursor-pointer"/></Button>
            </CardHeader>
            <CardContent className='grid px-3 gap-4'>
                <Label> <u>Address:</u> {addressInfo?.address}</Label>
                <Label><u>City:</u> &nbsp; &nbsp; &nbsp; &nbsp; {addressInfo?.city}</Label>
                <Label><u>Pin Code:</u> {addressInfo?.pincode}</Label>
                <Label><u>Phone:</u> &nbsp; &nbsp; {addressInfo?.phone}</Label>
                <Label><u>Notes:</u> &nbsp; &nbsp; {addressInfo?.notes}</Label>
            </CardContent>
            
        </Card>
     );
}

export default AddressCard;