import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ProductFilter from "./filter";
import { Button } from "@/components/ui/button";
import { ArrowUpDownIcon } from "lucide-react";
import { sortOptions } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import toast from "react-hot-toast";


function createSearchParamsHelper(filterParams) {
    const queryParams = [];

    for (const [key, value] of Object.entries(filterParams)) {
        if (Array.isArray(value) && value.length > 0) {
            const paramValue = value.join(',')
            queryParams.push(`${key}=${encodeURIComponent(paramValue)}`)
        }
    }
    return queryParams.join('&')
}

function ShoppingListing() {
    const dispatch = useDispatch()
    const { productList, productDetails } = useSelector(state => state.shopProducts)
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.shopCart)
    const [filters, setFilters] = useState({})
    const [sort, setSort] = useState(null)
    const [searchParams, setSearchParams] = useSearchParams();
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)

    const categorySearchParam = searchParams.get('category')


    function handleSort(value) {
        setSort(value)
    }

    function handleFilter(getSectionId, getCurrentOption) {
        let copyFilters = { ...filters }
        const indexOfCurrentSection = Object.keys(copyFilters).indexOf(getSectionId)
        if (indexOfCurrentSection === -1) {
            copyFilters = {
                ...copyFilters,
                [getSectionId]: [getCurrentOption]
            }
        } else {
            const indexOfCurrentSection = copyFilters[getSectionId].indexOf(getCurrentOption)
            if (indexOfCurrentSection === -1) copyFilters[getSectionId].push(getCurrentOption)
            else copyFilters[getSectionId].splice(indexOfCurrentSection, 1)
        }
        setFilters(copyFilters)
        sessionStorage.setItem('filters', JSON.stringify(copyFilters))
    }

    function handleGetProductDetails(getCurrentProductId) {
        console.log(getCurrentProductId)
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddtoCart(getCurrentProductId, getTotalStock) {
        console.log(cartItems, 'cartItemscartItemscartItems')

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

    useEffect(() => {
        setSort('price-lowtohigh')
        setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
    }, [categorySearchParam])

    useEffect(() => {
        if (filters && Object.keys(filters).length > 0) {
            const createQueryString = createSearchParamsHelper(filters)
            setSearchParams(new URLSearchParams(createQueryString))
        }
    }, [filters])

    useEffect(() => {
        if (filters !== null && sort !== null)
            dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }))
    }, [dispatch, sort, filters])
    useEffect(() => {
        if (productDetails !== null) {
            setOpenDetailsDialog(true)
        }
    }, [productDetails])

    console.log(productList, 'productListproductList')

    return (
        <div className="grid grid-cols-1 gap-6 p-4 md:p-6 md:grid-cols-[200px_1fr]">
            <ProductFilter filters={filters} handleFilter={handleFilter} />
            <div className="bg-background w-full rounded-lg shadow-sm">
                <div className="p-4 border-b flex  items-center justify-between">
                    <h2 className="text-lg font-extrabold">All Products</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">{productList.length} Products</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className='flex items-center gap-1' variant='outline' size='sm' >
                                    <ArrowUpDownIcon className="h-4 w-4" />
                                    <span>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='w-[200px]'>
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                                    {
                                        sortOptions.map(sortItem => <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>)
                                    }
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3 gap-4 p-4">
                    {
                        productList && productList.length > 0 ?
                            productList.map(productItem =>
                                <ShoppingProductTile
                                    handleGetProductDetails={handleGetProductDetails}
                                    key={productItem._id}
                                    product={productItem}
                                    handleAddtoCart={handleAddtoCart}
                                />) : <span className=" py-4 text-gray-600 font-medium">No Products Here</span>
                    }
                </div>
            </div>
            <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
        </div>
    );
}

export default ShoppingListing;