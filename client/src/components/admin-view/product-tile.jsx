import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";

function AdminProductTile({handleDelete, product, setCurrentEditedId, setOpenCreateProductsDialog, setFormData}) {
    return ( 
        <Card className='w-full max-w-sm mx-auto pt-0'>
            <div>
                <div className="relative">
                    <img src={product?.image} alt={product?.title}
                    className="w-full md:h-[250px] h-[340px] object-cover  rounded-t-lg"
                    />
                </div>
            </div>
            <CardContent>
                <h2 className="text-xl  mb-2 ">{product?.title}</h2>
                <div className="flex justify-between items-center mb-2">
                    <span className={`${product.salePrice > 0 ? 'line-through' : ''} text-lg font-semibold text-primary`}>${product?.price}</span>
                    {
                        product?.salePrice > 0 ? 
                      <span className="text-xl font-bold text-orange-600">${product?.salePrice}</span>
                      : null
                    }
                </div>
            </CardContent>
            <CardFooter className='flex justify-between items-center'>
                <Button onClick={()=>{
                    setOpenCreateProductsDialog(true)
                    setCurrentEditedId(product?._id)
                    setFormData(product)
                }}>Edit</Button>
                <Button onClick={()=>(handleDelete(product?._id))}>Delete</Button>
            </CardFooter>
        </Card>
     );
}

export default AdminProductTile;