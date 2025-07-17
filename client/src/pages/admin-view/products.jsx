import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { PlusIcon } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import ProdcutImageUpload from "./image-upload";
import { useDispatch, useSelector } from "react-redux";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import toast from "react-hot-toast";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData={
    image:null,
    title:'',
    description:'',
    category:'',
    brand:'',
    price:"",
    salePrice:'',
    totalStock:''
}

function AdminProducts() {

    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const {productList} = useSelector(state=>state.adminProducts)
    const dispatch = useDispatch()

    function onSubmit(event){
        event.preventDefault()
        currentEditedId !== null ?
        dispatch(editProduct({
            id:currentEditedId, formData,
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllProducts())
                setFormData(initialFormData)
                setOpenCreateProductsDialog(false)
                setCurrentEditedId(null)
                toast.success('Product Updated Successfully')
            }
        }) : 
        dispatch(addNewProduct({
            ...formData,
            image:uploadedImageUrl
        })).then((data)=>{
            console.log(data);
            if(data?.payload?.success){
                setOpenCreateProductsDialog(false)
                dispatch(fetchAllProducts())
                setImageFile(null)
                setFormData(initialFormData)
                toast.success('Product Added Successfully')
            }
        })
    }

    function handleDelete(getCurrentProductId){
        console.log(getCurrentProductId)
        dispatch(deleteProduct(getCurrentProductId)).then(data=>{
            if(data?.payload?.success){
                dispatch(fetchAllProducts())
            }
        })
    }
 

    useEffect(()=>{
    dispatch(fetchAllProducts())
    },[dispatch])

    console.log(productList,uploadedImageUrl, 'productList')

    const [formData, setFormData] = useState(initialFormData)
    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false)
    return ( 
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={()=>setOpenCreateProductsDialog(true)}><PlusIcon/> Add New Product</Button>
            </div>
            <div className="grid gap-4 lg:grid-cols-4 md:grid-cols-3">
                {
                    productList && productList.length > 0 ? 
                    productList.map(productItem=> <AdminProductTile  handleDelete={handleDelete} key={productItem?._id} setFormData={setFormData} setOpenCreateProductsDialog={setOpenCreateProductsDialog} setCurrentEditedId={setCurrentEditedId} product={productItem}/>) : null
                }
            </div>
            <Sheet className='' open={openCreateProductsDialog} onOpenChange={()=>{
                setOpenCreateProductsDialog(false)
                setCurrentEditedId(null)
                setFormData(initialFormData)
            }}>
                <SheetContent side='right' className='overflow-auto [&>button]:hidden px-6 py-2'>
                    <SheetHeader>
                        <SheetTitle className='-ml-6 font-semibold tracking-tight text-[20px] border-b'>{currentEditedId !== null ? 
                        'Edit Product' :
                        'Add New Product'    
                    }</SheetTitle>
                    </SheetHeader>

                    <ProdcutImageUpload isEditMode={currentEditedId != null} imageLoadingState={imageLoadingState} setImageLoadingState={setImageLoadingState} imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl}/>
                    <div className="py-5">
                        <CommonForm currentEditedId={currentEditedId} imageFile={imageFile} onSubmit={onSubmit} formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? 'Edit' : 'Add'} formControls={addProductFormElements} />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
     );
}

export default AdminProducts;