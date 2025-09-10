import PoliceDashboard from "@/src/components/dashboard_comp/PoliceDashboard"
import { getTickets, getUser } from "@/src/lib/actions"
import { toast } from "sonner"
import { redirect } from "next/navigation"
import { auth } from "@/src/lib/auth"
import { Suspense } from "react"


export default async function Page({ searchParams }) {

    const session = await auth()
    if (!session?.user) {
        redirect("/sos/police")
    }
    const currentPage = parseInt((await searchParams).page) || 1
    const tickets = await getTickets(currentPage)
    if (tickets.status === "FAIL") {
        toast.error(tickets.message)
    }
    const ticketsWithUsers = await Promise.all(
        tickets.data.map(async (ticket) => ({
            ...ticket,
            user: (await getUser(ticket.user_id)).data // Fetch user data here
        }))
    );

    console.log("Ticket with userss ==> ", ticketsWithUsers)

    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Main Content */}
            <Suspense fallback={<DashboardSkeleton />}>
                <PoliceDashboard tickets={ticketsWithUsers} pageSize={tickets?.pageSize} totalCount={tickets?.total} currentPage={currentPage} />
            </Suspense>
        </div>
    )
}

// components/DashboardSkeleton.jsx
const DashboardSkeleton = () => {
    return (
        <div className="flex flex-1 flex-col">
            <header className="border-b bg-white px-6 py-4">
                <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            </header>

            <div className="flex flex-1 gap-6 p-6">
                <div className="flex-1 space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200" />
                    ))}
                </div>
                <div className="hidden w-80 lg:block">
                    <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
                </div>
            </div>
        </div>
    )
}