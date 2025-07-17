import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';


const initialState = {
    userName: '',
    email: '',
    password: ''
}

function AuthRegister() {
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function onSubmit(event) {
        event.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            if (data?.payload?.success) {
                toast.success(data.payload.message);
                navigate('/auth/login');
            } else {
                toast.error(data.payload.message);
            }

            console.log(data)
        })
    }

    console.log(formData)

    return (
        <div className="border-1 border-orange-600 backdrop-blur-lg rounded-2xl py-12 px-5 mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Create New Account</h1>
                <p className="mt-2">Already have an account
                    <Link className="font-medium underline ml-2" to='/auth/login'>Login</Link>
                </p>
            </div>
            <CommonForm formControls={registerFormControls}
                buttonText={'Sign Up'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />

        </div>
    );
}

export default AuthRegister;