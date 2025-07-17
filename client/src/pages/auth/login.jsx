import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const initialState = {
    email: '',
    password: ''
}

function AuthLogin() {
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()

    function onSubmit(event) {
        event.preventDefault();
        dispatch(loginUser(formData)).then((data) => {
            if (data.payload.success) {
                toast.success(data.payload.message)
            }
            else {
                toast.error(data.payload.message)
            }
            console.log(data)
        })

    }


    return (
        <div className="backdrop-blur-lg mx-auto w-full max-w-md px-4 py-12 rounded-2xl space-y-10 border-1 border-orange-600">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Sign in to your Account</h1>
                <p className="mt-2">Don't have an account 
                    <Link className="font-medium underline ml-2" to='/auth/register'>Sign Up</Link>
                </p>
            </div>
            <CommonForm formControls={loginFormControls}
                buttonText={'Sign In'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />

        </div>
    );
}

export default AuthLogin;