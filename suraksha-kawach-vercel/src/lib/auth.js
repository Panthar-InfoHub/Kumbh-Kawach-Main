import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { checkPassword } from "./actions";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                station_id: {name: "Station ID", type: "text", label: "Station ID", placeholder: "Enter your station ID"},
                password: {name: "Password", type: "password", label: "Password", placeholder: "Enter your password"},
            },
            async authorize(credentials) {

                const isPasswordCorrect = await checkPassword(credentials.password, credentials.station_id)

                if (!isPasswordCorrect) {
                    console.log("Password is incorrect")
                    return null
                }

                const user = { id: "police-station-1", station_id: credentials.station_id, name: "Police Station", success: true };

                return user;
            }
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.station_id = user.station_id
            }
            return token
        },
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id
                session.user.station_id = token.station_id
            }
            return session
        },
        authorized({ request, auth }) {
            const isLoggedIn = !!auth?.user

            console.log("User logged in : ", isLoggedIn)
            if (request.nextUrl.pathname === "/sos/police" && isLoggedIn) {
                return Response.redirect(new URL("/sos/police/dashboard", request.nextUrl))
            }

            return !!auth
        }
    },
    pages: {
        signIn: "/sos/police"
    }
})
