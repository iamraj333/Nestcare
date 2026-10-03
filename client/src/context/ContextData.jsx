import {createContext, useEffect, useState } from "react";

// creating contxt
export const contextData = createContext();

export function ContextAPIProvider({ children }) {
    const [token, SetToken] = useState('')
    const [currentUser, setCurrentUser] = useState({
        role: '',
        user: ''
    })
    const [isLoading, setLoading] = useState(true)

    async function fetchUser() {
        setLoading(true)
        try {
            const response=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/me`,{
                method:"GET",
                credentials:"include"
            })

            const data = await response.json()
            if (response.ok) {
                setCurrentUser({
                    role: data.role,
                    user: data.user
                })
            }
            else {
                setCurrentUser({
                    role: "",
                    user: ""
                })
            }
        }
        catch (e) {
            console.error("Server connection with Context API failed: ", e)
            setCurrentUser({
                role:'',
                user:''
            })
        }
        finally {
            setLoading(false)
        }
    }

    async function logout() {
        try {
            const response=await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/logout`,{
                method:"POST",
                credentials:"include"
            })

            const data=await response.json()

            if (data.success) {
                return { success: data.success };
            }
            else {
                return {error: data.error }
            }
        }
        catch (e) {
            console.error("Server connection for logout failed: ", e)
            return {error:"Logout Failed"}
        }
        finally {
            setCurrentUser({
                role:'',
                user:''
            })
        }
    }

    useEffect(() => {
        fetchUser()
    }, [])



    return (
        <contextData.Provider value={{ currentUser, isLoading, logout, fetchUser }}>
            {children}
        </contextData.Provider>
    )
}