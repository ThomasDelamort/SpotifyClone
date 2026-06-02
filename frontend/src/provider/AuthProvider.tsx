import * as React from "react";
import {axiosInstance} from "@/lib/axios.ts";
import {useAuth} from "@clerk/clerk-react";
import {useState, useEffect} from "react";
import {Loader} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore.ts";




const updateApiToken = (token:string | null) => {
    if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axiosInstance.defaults.headers.common['Authorization'];
}


const AuthProvider = ({children}:{children: React.ReactNode }) => {
    const {getToken} = useAuth();
    const [ loading, setLoading ] = useState(true);
    const { checkAdminStatus } = useAuthStore();

    useEffect(() => {
        const initAuth= async () => {
            try {
                const token = await getToken()
                updateApiToken(token);
                if (token) {
                    await checkAdminStatus();
                }

            } catch (err:any) {
                updateApiToken(null);
                console.log("Error in auth provider", err);
            } finally {
                setLoading(false)
            }
        };
        initAuth();
    }, [getToken]);

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader className="size-8 text-emerald-500 animate-spin " />
        </div>
    )

    return <div>{children}</div>
}
export default AuthProvider;