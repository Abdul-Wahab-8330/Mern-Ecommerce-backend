import { ChartNoAxesCombined } from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, ListOrdered, ShoppingBasket } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

export const adminSidebarMenuItems = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <LayoutDashboard />
    },
    {
        id: 'products',
        label: 'Products',
        path: '/admin/products',
        icon: <ShoppingBasket />
    },
    {
        id: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <ListOrdered />
    },
]

function AdminSideBar({ open, setOpen }) {

    function MenuItems() {
        const navigate = useNavigate()
        return <nav className="mt-8 flex-col flex gap-2">
            {
                adminSidebarMenuItems.map(menuItems => <div key={menuItems.id} onClick={() => {
                    navigate(menuItems.path)
                    setOpen ? setOpen(false) : null
                }}
                    className="cursor-pointer flex items-center gap-2 px-3 py-2 text-xl rounded-md text-muted-foreground hover:bg-muted hover:text-foreground">
                    {menuItems.icon}
                    <span>{menuItems.label}</span>
                </div>)
            }
        </nav>
    }
    const navigate = useNavigate()

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side='left' className='w-64 [&>button]:text-white [&>button]:hidden [&>button]:bg-white'>
                    <div className="flex flex-col h-full">
                        <SheetHeader className='border-b'>
                            <SheetTitle className='flex gap-2 mt-12 mb-1'>
                                <ChartNoAxesCombined />
                                <span className="text-2xl font-bold">Admin Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems />
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div onClick={() => navigate('/admin/dashboard')} className="flex cursor-pointer items-center gap-2">
                    <ChartNoAxesCombined size={30} />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />

            </aside>
        </Fragment>
    );
}

export default AdminSideBar;