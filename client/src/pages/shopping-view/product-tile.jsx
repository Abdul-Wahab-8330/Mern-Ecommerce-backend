import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

function ShoppingProductTile({ product, handleGetProductDetails, handleAddtoCart }) {
    return (
        <Card className='w-full pt-0 max-w-sm mx-auto pb-2 cursor-pointer hover:shadow-gray-500'>
            <div onClick={() => handleGetProductDetails(product?._id)}>
                <div className="relative">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="w-full h-[390px] md:h-[320px] object-cover rounded-t-lg "
                    />
                    {
                        product?.totalStock === 0 ? (
                            <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700 rounded-full">
                                Out Of Stock
                            </Badge>
                        )
                            : product?.totalStock < 10 ? (
                                <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700 rounded-full">
                                    {`Only ${product?.totalStock} Items left`}
                                </Badge>
                            )

                                : product?.salePrice > 0 ? (
                                    <Badge className="absolute top-2 left-2 bg-orange-600 hover:bg-orange-700 rounded-full">
                                        Sale
                                    </Badge>
                                ) : null
                    }

                </div>
                <CardContent className='p-4'>
                    <h2 className="text-xl  mb-2">{product?.title}</h2>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[16px] font-semibold text-muted-foreground">{product?.category?.charAt(0).toUpperCase() + product?.category?.slice(1)}</span>
                        <span className="text-[16px]  text-muted-foreground">  {product?.brand?.charAt(0).toUpperCase() + product?.brand?.slice(1)}</span>
                    </div>
                    <div className="flex justify-end items-center mb-2">
                        <div className={`${product?.salePrice > 0 ? 'line-through' : 'hidden'} text-lg font-semibold text-primary`}>
                            <span className="text-sm text-muted-foreground mr-2">${product?.price}</span>
                        </div>
                        <div>
                            <span className="font-semibold text-lg text-orange-600">${`${product?.salePrice > 0 ? product?.salePrice : product.price} `}</span>
                        </div>
                    </div>
                </CardContent>

            </div>
            <CardFooter>
                {
                    product?.totalStock === 0 ?  <Button disabled={true} onClick={() => handleAddtoCart(product?._id, product?.totalStock)} className=' opacity-60 cursor-not-allowed w-full bg-transparent border-gray-800 border-1 text-black hover:text-white'>
                        Out Of Stock
                    </Button> : <Button onClick={() => handleAddtoCart(product?._id, product?.totalStock)} className='w-full bg-transparent border-gray-800 border-1 text-black hover:text-white hover:bg-orange-600'>
                        Add to Cart
                    </Button>
                }

            </CardFooter>
        </Card>
    );
}

export default ShoppingProductTile;