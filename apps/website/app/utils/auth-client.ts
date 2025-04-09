"use client"
import { createAuthClient } from "better-auth/react"
const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: process.env.NEXT_PUBLIC_API_URL
})
export default authClient
const { signIn, signUp, useSession, signOut } = authClient
const signInWithGitHub = async () => {
    const data = await signIn.social({ provider: "github" })
    return data
}
const signInWithGoole = async () => {
    const data = await signIn.social({ provider: "google" })
    return data
}
export { signInWithGitHub, signInWithGoole, useSession, signOut }