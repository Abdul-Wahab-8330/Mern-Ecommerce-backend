import { Airplay, ChevronLeftIcon, ChevronRightIcon, CloudLightning, Heater, Images, Shirt, ShirtIcon, ShoppingBasket, UmbrellaIcon, WashingMachine, WatchIcon } from "lucide-react";
import bannerSix from '../../assets/banner6.jpg';
import bannerSeven from '../../assets/banner7.jpg';
import bannerEight from '../../assets/banner8.jpg';
import bannerTwelve from '../../assets/banner12.jpg';
import banner01 from '../../assets/banner01.png';
import banner02 from '../../assets/banner02.png';
import banner03 from '../../assets/banner03.png';
import { Button } from "@/components/ui/button";
import { IoShirtSharp } from "react-icons/io5";
import { IoWoman } from "react-icons/io5";
import { TbMoodKidFilled } from "react-icons/tb";
import { GiWatch } from "react-icons/gi";
import { GiConverseShoe } from "react-icons/gi";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice";
import ShoppingProductTile from "./product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import toast from "react-hot-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { Separator } from "@/components/ui/separator";
const categoriesWithIcon = [
    { id: "men", label: "Men", icon: IoShirtSharp },
    { id: "women", label: "Women", icon: IoWoman },
    { id: "kids", label: "Kids", icon: TbMoodKidFilled },
    { id: "accessories", label: "Accessories", icon: GiWatch },
    { id: "footwear", label: "Footwear", icon: GiConverseShoe },
]
const BrandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levis", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
]

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const { productList, productDetails } = useSelector(state => state.shopProducts)
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false)
    const { user } = useSelector(state => state.auth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const slides = [banner01,banner02,banner03]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, []);


    useEffect(()=>{
        if(productDetails !== null)
        {
            setOpenDetailsDialog(true)
        }
    },[productDetails])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: 'price-lowtohigh' }))
    }, [dispatch])

    function handleGetProductDetails(getCurrentProductId) {
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handleAddtoCart(getCurrentProductId) {
        dispatch(addToCart({ userId: user?.id, productId: getCurrentProductId, quantity: 1 }))
            .then(data => {
                if (data?.payload?.success) {
                    dispatch(fetchCartItems(user?.id))
                    toast.success('Product added to cart')
                }
            })
    }

    function handleNavigateToListingPage(getCurrentItem, section) {
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section]: [getCurrentItem.id]
        }
        sessionStorage.setItem('filters', JSON.stringify(currentFilter))
        navigate(`/shop/listing`)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <div className="relative w-full h-[350px] overflow-hidden">
                {
                    slides.map((slide, index) => {
                        return <img src={slide} key={index} alt="banner" className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`} />
                    })
                }
                <Button onClick={() => setCurrentSlide(prevSlide => (prevSlide - 1 + slides.length) % slides.length)} variant='outline' size='icon' className='absolute top-1/2 left-4 transform border-none active:border-none -translate-y-1/2 bg-white/80'>
                    <ChevronLeftIcon className="w-4 h-4" />
                </Button>
                <Button onClick={() => setCurrentSlide(prevSlide => (prevSlide + 1 + slides.length) % slides.length)} variant='outline' size='icon' className='absolute top-1/2 right-4 transform border-none active:border-none -translate-y-1/2 bg-white/80'>
                    <ChevronRightIcon className="w-4 h-4" />
                </Button>
            </div>
            <section className="py-8 ">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Shop by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 ">
                        {
                            categoriesWithIcon.map(item =>
                                <Card onClick={() => handleNavigateToListingPage(item, 'category')} className='hover:border-gray-600 bg-white cursor-pointer hover:shadow-lg transition-shadow'>
                                    <CardContent className='flex flex-col items-center justify-center p-6 '>
                                        <item.icon className="w-12 h-12 mb-4 text-primary" />
                                        <span className="font-bold">{item.label}</span>
                                    </CardContent>
                                </Card>)
                        }
                    </div>
                </div>
            </section>
                        <Separator/>
            <section className="py-8 ">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Shop by Brand</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
                        {
                            BrandsWithIcon.map(item =>
                                <Card onClick={() => handleNavigateToListingPage(item, 'brand')} className=' hover:border-gray-600 cursor-pointer hover:shadow-lg transition-shadow'>
                                    <CardContent className='flex flex-col items-center justify-center p-6'>
                                        <item.icon className="w-12 h-12 mb-4 text-primary" />
                                        <span className="font-bold">{item.label}</span>
                                    </CardContent>
                                </Card>)
                        }
                    </div>
                </div>
            </section>
                        <Separator/>
            <section className="py-8 ">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">Featured Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                        {
                            productList && productList.length > 0 ?
                                productList.map((productItem) => (
                                    <ShoppingProductTile handleGetProductDetails={handleGetProductDetails}
                                        product={productItem}
                                        handleAddtoCart={handleAddtoCart}

                                    />
                                ))
                                : null
                        }
                    </div>
                </div>
            </section>
            <ProductDetailsDialog
                open={openDetailsDialog}
                setOpen={setOpenDetailsDialog}
                productDetails={productDetails}
            />

        </div>
    );
}

export default ShoppingHome;