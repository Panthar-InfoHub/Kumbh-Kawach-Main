"use client"

import { Bell, Calendar, Filter, MapPin, Phone, Shield, User } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import PoliceMap from "./PoliceMap"
import { getPriorityInfo } from "@/src/lib/utils"


// Dummy analytics data
const dummyAnalyticsData = {
    resolvedToday: 8, avgResponseTime: "4.2 min", priorityDistribution: {
        high: 3, medium: 2, low: 2,
    },
}

// Utility functions
const formattedDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`
}



const PoliceDashboard = ({ tickets, totalCount = 617, pageSize = 10, currentPage = 1 }) => {
    const [selectedTicket, setSelectedTicket] = useState()
    const [sexFilter, setSexFilter] = useState("All")
    const [priorityFilter, setPriorityFilter] = useState("All")
    const [latestTickets, setLatestTickets] = useState(tickets)
    const router = useRouter()
    const searchParams = useSearchParams()

    const [isMobile, setIsMobile] = useState(false)
    const siblingCount = 1
    const totalPages = Math.ceil(totalCount / pageSize)

    const filteredTickets = tickets
        .filter((ticket) => sexFilter === "All" || ticket.user?.sex?.toLowerCase() === sexFilter.toLowerCase())
        .filter((ticket) =>
            priorityFilter === "All" ||
            (priorityFilter === "High" && ticket.ticket_priority >= 6) ||
            (priorityFilter === "Medium" && ticket.ticket_priority >= 3 && ticket.ticket_priority < 6) ||
            (priorityFilter === "Low" && ticket.ticket_priority < 3),)

    const handlePageChange = (newPage) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage)
        router.push(`?${params.toString()}`)
    }

    // For pagination in mobile and web
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        handleResize()

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    // Generate pagination range
    const generatePaginationRange = () => {
        const maxVisible = isMobile ? 3 : 5
        const pages = []
        pages.push(1)

        let rangeStart = Math.max(2, currentPage - siblingCount)
        let rangeEnd = Math.min(totalPages - 1, currentPage + siblingCount)

        // Adjust range if at the beginning
        if (currentPage <= 2) {
            rangeEnd = Math.min(maxVisible, totalPages - 1)
        }

        // Adjust range if at the end
        if (currentPage >= totalPages - 1) {
            rangeStart = Math.max(2, totalPages - maxVisible + 1)
        }

        if (rangeStart > 2) {
            pages.push("ellipsis-start")
        }

        for (let i = rangeStart; i <= rangeEnd; i++) {
            pages.push(i)
        }

        // Add ellipsis after range if needed
        if (rangeEnd < totalPages - 1) {
            pages.push("ellipsis-end")
        }

        // Always show last page if there's more than one page
        if (totalPages > 1) {
            pages.push(totalPages)
        }
        return pages
    }

    const paginationRange = generatePaginationRange()

    return (<div className="flex flex-1 flex-col max-w-[100vw] overflow-hidden bg-gray-50">
        <header className="border-b bg-white px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <h1 className="text-lg font-semibold">Suraksha Kawach</h1>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" className="rounded-full text-gray-600">
                        <Bell className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>

        <div className="container mx-auto p-4">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 mt-2">
                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-xs font-medium text-gray-500">Active Tickets</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold">{totalCount}</div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-xs font-medium text-gray-500">Resolve Today</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold">{dummyAnalyticsData.resolvedToday}</div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-xs font-medium text-gray-500">Avg. Response Time</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4">
                        <div className="text-2xl font-bold">{dummyAnalyticsData.avgResponseTime}</div>
                    </CardContent>
                </Card>

                <Card className="bg-white border-none shadow-sm">
                    <CardHeader className="pb-2 pt-4">
                        <CardTitle className="text-xs font-medium text-gray-500">Priority Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-4 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                            <span
                                className="text-xs text-gray-600">L {dummyAnalyticsData.priorityDistribution.low}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                            <span
                                className="text-xs text-gray-600">M {dummyAnalyticsData.priorityDistribution.medium}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                            <span
                                className="text-xs text-gray-600">H {dummyAnalyticsData.priorityDistribution.high}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Side - Tickets */}
                <div className="w-full md:w-1/2 lg:w-5/12">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Tickets</h2>
                            <div className="flex items-center gap-2">
                                <Select value={sexFilter} onValueChange={(val) => sexFilter === val ? setSexFilter("All") : setSexFilter(val)}>
                                    <SelectTrigger className="w-fit h-8 border-2 text-blue-500 transition-all duration-150 ease-in-out hover:bg-blue-400 hover:text-white border-blue-500 text-xs px-3 rounded-full">
                                        <Filter className="h-3 w-3 mr-1" />
                                        {sexFilter === "All" ? "Gender Filter" : sexFilter}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All</SelectItem>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                        <SelectItem value="Not disclosed">Not disclosed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={priorityFilter} onValueChange={(val) => setPriorityFilter(priorityFilter === val ? "All" : val)}>
                                    <SelectTrigger className="w-fit h-8 text-xs text-destructive px-3 rounded-full border-2 border-red-500 hover:bg-red-400 hover:text-white ">
                                        <Filter className="h-3 w-3 mr-1" />
                                        {priorityFilter === "All" ? "Alert Filter" : priorityFilter}
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="All">All Alert</SelectItem>
                                        <SelectItem value="Low">Low Alert</SelectItem>
                                        <SelectItem value="Medium">Medium Alert</SelectItem>
                                        <SelectItem value="High">High Alert</SelectItem>
                                    </SelectContent>
                                </Select>

                            </div>
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                            {filteredTickets.map((ticket) => {
                                const priorityInfo = getPriorityInfo(ticket.ticket_priority)
                                return (<Dialog key={ticket.ticket_id}>
                                    <DialogTrigger asChild>
                                        <Card
                                            className="cursor-pointer hover:bg-gray-50 border border-gray-200 shadow-none"
                                            onClick={() => setSelectedTicket(ticket)}
                                        >
                                            <CardContent className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 border">
                                                        <AvatarImage
                                                            src={ticket?.user?.photoURL || "/placeholder.svg"}
                                                            alt={ticket?.user?.displayName}
                                                        />
                                                        <AvatarFallback>{ticket?.user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h3 className="font-medium text-sm">{ticket?.user?.displayName}</h3>
                                                            <Badge
                                                                className={`text-xs ${priorityInfo.color}`}>{priorityInfo.label}</Badge>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div
                                                                className="flex items-center gap-1 text-xs text-gray-500">
                                                                <MapPin className="h-3 w-3" />
                                                                <span>
                                                                    {ticket.location_data[0].latitude.toFixed(4)},{" "}
                                                                    {ticket.location_data[0].longitude.toFixed(4)}
                                                                </span>
                                                            </div>
                                                            <div
                                                                className="text-xs text-gray-500">{formattedDate(ticket?.createdAt)}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[500px]">
                                        <DialogHeader>
                                            <DialogTitle>Ticket Details</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-16 w-16 border">
                                                    <AvatarImage
                                                        src={ticket?.user?.photoURL || "/placeholder.svg"}
                                                        alt={ticket?.user?.displayName}
                                                    />
                                                    <AvatarFallback>{ticket?.user?.displayName?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h2 className="text-xl font-semibold">{ticket.user?.displayName}</h2>
                                                    <Badge variant="outline"
                                                        className={`mt-1 ${priorityInfo.color}`}>
                                                        {priorityInfo.label} Priority
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="space-y-4 rounded-lg border p-4">
                                                <h3 className="font-medium">Contact Information</h3>
                                                <div className="grid grid-cols-1 gap-3 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                                        <span>{ticket.user?.phoneNumber || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <User className="h-4 w-4 text-muted-foreground" />
                                                        <span>{ticket.user?.email || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        <span>
                                                            {ticket.location_data[0].latitude.toFixed(6)},{" "}
                                                            {ticket.location_data[0].longitude.toFixed(6)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>Created: {formattedDate(ticket?.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {ticket.video && ticket.video.length > 0 && (
                                                <div className="space-y-2">
                                                    <h3 className="font-medium">Evidence Videos</h3>
                                                    <div className="grid grid-cols-3 gap-2">
                                                        {ticket.video.slice(0, 3).map((vid, index) => (<div
                                                            key={vid.video_id || index}
                                                            className="aspect-video bg-gray-100 rounded flex items-center justify-center"
                                                        >
                                                            <span
                                                                className="text-xs text-gray-500">Video {index + 1}</span>
                                                        </div>))}
                                                    </div>
                                                    {ticket.video.length > 3 && (
                                                        <p className="text-xs text-muted-foreground text-center">
                                                            +{ticket.video.length - 3} more videos
                                                        </p>)}
                                                </div>)}

                                            <div className="flex gap-4 justify-between">
                                                <Button className="bg-blue-600 hover:bg-blue-700">
                                                    <Link
                                                        href={`/sos/view?ticketId=${ticket.ticket_id}&firebaseUID=${ticket?.user?.uid}`}>
                                                        View SOS Details
                                                    </Link>
                                                </Button>

                                                <DialogClose asChild>
                                                    <Button type="button" variant="outline">
                                                        Close
                                                    </Button>
                                                </DialogClose>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>)
                            })}
                        </div>

                        {/* Pagination */}
                        <div className="mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            className="cursor-pointer"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage <= 1}
                                        />
                                    </PaginationItem>

                                    {paginationRange.map((page, index) => {
                                        if (page === "ellipsis-start" || page === "ellipsis-end") {
                                            return (<PaginationItem key={`ellipsis-${index}`}>
                                                <PaginationEllipsis />
                                            </PaginationItem>)
                                        }

                                        return (<PaginationItem key={page}>
                                            <PaginationLink
                                                className="cursor-pointer"
                                                isActive={page === currentPage}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>)
                                    })}

                                    <PaginationItem>
                                        <PaginationNext
                                            className="cursor-pointer"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>

                {/* Right Side - Map */}
                <div className="w-full md:w-1/2 lg:w-7/12">
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold">Calendar</h2>
                            <div className="text-sm font-medium">April 2025</div>
                        </div>

                        {/* Map placeholder - in a real implementation, you would integrate a map library here */}
                        <div className="rounded-lg overflow-hidden h-[calc(100vh-280px)] bg-gray-100 relative">
                            <div
                                className="absolute inset-0 bg-cover bg-center"
                            >
                                <PoliceMap points={tickets} />

                            </div>
                            <div className="absolute bottom-4 right-4 bg-white rounded-md shadow-md p-2 text-xs">
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                                    <span>High Priority</span>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                                    <span>Medium Priority</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="inline-block w-3 h-3 bg-blue-500 rounded-full"></span>
                                    <span>Low Priority</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}

export default PoliceDashboard
