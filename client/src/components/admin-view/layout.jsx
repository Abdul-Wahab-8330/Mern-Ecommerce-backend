import { Outlet } from "react-router-dom";
import AdminSideBar from "./sidebar";
import AdminHeader from "./header";
import { useState } from "react";

function AdminLayout() {

    const [opensidebar, setOpensidebar] = useState(false)

    return ( 
        <div className="flex min-h-screen w-full ">
            {/* admin sidebar */}
            <AdminSideBar open={opensidebar} setOpen={setOpensidebar}/>
            <div className="flex flex-1 flex-col ">
                {/* admin header */}
                <AdminHeader open={opensidebar} setOpen={setOpensidebar}/>
                <main className="flex flex-col flex-1 bg-muted/40 p-4 md:p-6">
                <Outlet/>
                </main>
            </div>
        </div>
     );
}

export default AdminLayout;