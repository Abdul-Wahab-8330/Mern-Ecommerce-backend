import { LogOut, Menu, Search, ShoppingCart, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import logo from '../../assets/ecom-logo.png'

function MenuItems({ closeSheet }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    function handleNavigate(menuItem) {
        sessionStorage.removeItem('filters');

        const isCategory = menuItem.id !== 'home' && menuItem.id !== 'products';
        const filter = isCategory ? { category: [menuItem.id] } : null;
        sessionStorage.setItem('filters', JSON.stringify(filter));

        if (location.pathname.includes('listing') && isCategory) {
            setSearchParams(new URLSearchParams({ category: menuItem.id }));
        } else {
            navigate(menuItem.path);
        }

        if (typeof closeSheet === 'function') closeSheet(false);
    }

    const currentPath = location.pathname;
    const currentCategory = searchParams.get('category');

    return (
        <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
            {shoppingViewHeaderMenuItems.map((item) => {
                const isActive =
                    (item.id === 'home' && currentPath === item.path) ||
                    (item.id === 'products' && currentPath === '/shop/listing' && !currentCategory) ||
                    (item.id !== 'home' && item.id !== 'products' && currentPath === '/shop/listing' && currentCategory === item.id);

                return (
                    <Label
                        key={item.id}
                        onClick={() => handleNavigate(item)}
                        className={`text-sm font-medium tracking-wider cursor-pointer relative transition duration-200 ${isActive
                                ? 'text-blue-600 after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px] after:bg-blue-600'
                                : 'text-gray-700'
                            }`}
                    >
                        {item.label}
                    </Label>
                );
            })}
        </nav>
    );
}


function HeaderRightContent() {
    const { user } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.shopCart)
    const [openCartSheet, setOpenCartSheet] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function handleLogout() {
        dispatch(logoutUser())
    }

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchCartItems(user.id))
        }
    }, [dispatch, user])



    console.log(cartItems.items, 'cartitems')

    return <div className=" flex lg:items-center lg:flex-row flex-col gap-4">
        <Link to='/shop/search'>
            <div className="flex justify-center items-center bg-muted hover:border-gray-500 py-[7px] px-[10px] rounded-full border">
                <Search className="text-gray-800 w-[17px]" />
            </div>
        </Link>
        <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
            <Button style={{backgroundColor:'gray'}} onClick={() => setOpenCartSheet(true)} variant='outline' size='icon' className='rounded-full  relative '>
                <ShoppingCart className="w-7 h-7 font-bold" />
                <Badge className='absolute -top-3 -right-3 rounded-full bg-blue-600 '>
                    {
                        cartItems.items && cartItems.items.length > 0 ?
                            cartItems.items.length
                            : 0
                    }
                </Badge>
                <span className="sr-only">User Cart</span>
            </Button>
            <UserCartWrapper setOpenCartSheet={setOpenCartSheet} cartItems={cartItems && cartItems.items && cartItems.items.length > 0 ? cartItems.items : []} />
        </Sheet>

        <DropdownMenu >
            <DropdownMenuTrigger className='cursor-pointer' asChild>
                <Avatar className='bg-black'>
                    <AvatarFallback className='bg-black text-white font-extrabold'>
                        {user?.userName?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side='right' className='w-56'>
                <DropdownMenuLabel>
                    Logged in as {user?.userName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                    <UserCog className="mr-2 h-4 w-4" />
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
}


function ShoppingHeader() {
    const [isOpen, setIsOpen] = useState(false)


    const { isAuthenticated } = useSelector(state => state.auth)

    return (
        <header className="fixed top-0 z-40 w-full border-b bg-gray-100 ">
            <div className="flex h-16 justify-between items-center px-4 md:px-6">
                <Link to='/shop/home' className="flex items-center gap-2 text-gray-700">
                    <span className="font-bold"><img src={logo} alt="Logo" className="w-44" /></span>
                </Link>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button size='icon' className='lg:hidden bg-transparent text-black hover:bg-transparent'>
                            <Menu className="h-7 w-7" />
                            <span className='sr-only'>Toggle Header Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side='left' className='w-full max-w-xs p-4'>
                        <MenuItems closeSheet={setIsOpen} />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block ">
                    <MenuItems />
                </div>
                <div className='hidden lg:block'>
                    <HeaderRightContent />
                </div>
            </div>
        </header>
    );
}

export default ShoppingHeader;