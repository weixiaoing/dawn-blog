"use client"
import { createAuthClient } from "better-auth/react"
const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_API_URL

})


const { signIn, signUp, useSession, signOut } = authClient
const signInWithGitHub = async () => {
    try {
        const data = await signIn.social({
            provider: "github",
            callbackURL: "http://localhost:3000"
        })
    return data
    } catch (error) {
        console.log(error);

    }
}
const signInWithGoole = async () => {
    const data = await signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000"
    })

    return data
}

const signInWithEmail = async (email: string, password: string) => {
    try {
        const data = await signIn.email({
            email, password,
            callbackURL: "http://localhost:3000"
        })
        return data
    } catch (error) {
        console.log(error);

    }
}
export { signInWithGitHub, signInWithGoole, signInWithEmail, useSession, signOut }
export default authClient