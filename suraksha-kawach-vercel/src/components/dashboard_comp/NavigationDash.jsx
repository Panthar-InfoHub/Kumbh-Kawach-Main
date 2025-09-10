"use client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/src/lib/actions";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { FileText, Info, Mail, User, VideoIcon } from "lucide-react";
import Image from "next/image";
import { Suspense, useEffect, useRef, useState } from "react";
import MapChangeOption from "../my_components/MapChangeOption";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";


const NavigationDash = ({ hindiSummary, priority, userInfo, status, files, setMapType, ticketSummary, ticketData }) => {

    const snapPoints = [0.4, "355px", 1];
    const videoRefs = useRef({});
    const [snap, setSnap] = useState(snapPoints[0]);
    const [openDrawer2, setOpenDrawer2] = useState(false);
    const [visibleIndices, setVisibleIndices] = useState(new Set());


    useEffect(() => {
        if (!files) return;


        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleIndices((prevIndices) => {
                    const newIndices = new Set(prevIndices);
                    entries.forEach((entry) => {
                        const index = Number(entry.target.dataset.index);
                        if (entry.isIntersecting) {
                            newIndices.add(index);
                        }
                    });
                    return newIndices;
                });
            },
            { rootMargin: "50px", threshold: 0.2 }
        );

        // Wait for videos to mount before attaching observer
        setTimeout(() => {
            Object.entries(videoRefs.current).forEach(([index, video]) => {
                if (video) {
                    observer.observe(video);
                } else {
                    console.log(`Video ${index} not found in videoRefs`);
                }
            });
        }, 500);

        return () => observer.disconnect();
    }, [files, openDrawer2]);


    return (
        <header className="sticky top-0 inset-x-0 flex flex-wrap md:justify-start md:flex-nowrap z-50 w-full text-sm">

            <nav className="mt-4 relative max-w-xl w-full bg-white border border-gray-200 rounded-[2rem] mx-2 py-2 flex items-center justify-between px-4 sm:mx-auto dark:bg-neutral-900 dark:border-neutral-700" >

                {/* USER PROFILE */}
                <div>
                    <UserInfoComponent userInfo={userInfo} status={status} />
                </div>

                <div className="flex gap-2 items-center " >

                    <Drawer open={openDrawer2} onOpenChange={setOpenDrawer2} snapPoints={snapPoints} activeSnapPoint={snap} setActiveSnapPoint={setSnap} >
                        <DrawerTrigger asChild>
                            <div className="flex text-base px-4 py-2 rounded-lg hover:bg-accent hover:text-[#4158D0] items-center gap-2 cursor-pointer duration-200 transition-all ease-in-out hover:scale-[0.9] group">
                                <VideoIcon className="size-4" /><span className="sm:flex hidden" > Videos </span>
                            </div>
                        </DrawerTrigger>
                        <DrawerContent className="p-4">
                            <div className="flex flex-col gap-4 mx-auto w-full max-w-[80%]" >
                                <DrawerHeader>
                                    <DrawerTitle >Videos</DrawerTitle>
                                    <DrawerDescription>Emergency Videos.</DrawerDescription>
                                </DrawerHeader>
                                <ScrollArea className="h-[500px] overflow-y-auto">
                                    <div className="h-full w-[80%] mx-auto flex flex-col gap-4 pb-[40vh]">
                                        {files.length > 0 ? files.map((video, index) => (
                                            <div key={index} data-index={index} className="relative w-full mb-4 rounded-lg"
                                                ref={(el) => {
                                                    if (el) {
                                                        videoRefs.current[index] = el;
                                                    }
                                                }}
                                            >
                                                <div className="flex flex-col gap-4 rounded-lg">
                                                    <div className="relative w-full h-[12rem] rounded-lg">
                                                        {visibleIndices.has(index) ? (
                                                            <video src={video.video_url} loading="lazy" className="w-full h-full object-cover rounded-lg" preload="metadata" playsInline controls ref={(el) => (videoRefs.current[index] = el)} />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                                                <p>Loading...</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="outline">View Summary {index + 1}</Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent className="!rounded-3xl overflow-y-auto w-[90%] sm:!w-auto sm:!h-auto" >
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Video {index + 1} Summary </AlertDialogTitle>
                                                                <AlertDialogDescription>

                                                                    <Tabs defaultValue="english" className="w-full">
                                                                        <TabsList className=" tab_new rounded-xl my-8">
                                                                            <TabsTrigger className="tab_new rounded-xl" value="english">English</TabsTrigger>
                                                                            <TabsTrigger className="tab_new rounded-xl" value="hindi">हिंदी</TabsTrigger>
                                                                        </TabsList>
                                                                        <TabsContent value="english" className="mt-4 space-y-4">
                                                                            {video?.description?.english || "No video summary found in English"}
                                                                        </TabsContent>
                                                                        <TabsContent value="hindi" className="mt-4 space-y-4">
                                                                            {video?.description?.hindi || "हिंदी में कोई सारांश नहीं मिला"}
                                                                        </TabsContent>
                                                                    </Tabs>

                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>

                                                </div>
                                            </div>
                                        )) : <div className="flex items-center justify-center h-full">
                                            <h1 className="text-2xl font-bold">No videos found</h1>
                                        </div>}
                                    </div>
                                </ScrollArea>
                            </div>

                        </DrawerContent>
                    </Drawer>

                    <div>
                        <AlertDialog >
                            <AlertDialogTrigger asChild>
                                <div className=" text-base hover:bg-accent px-4 py-2 rounded-lg hover:text-[#4158D0] flex items-center gap-1 cursor-pointer duration-200 transition-all ease-in-out hover:scale-[0.9] group">
                                    <FileText className="size-4" /> <span className="sm:flex hidden" >Summary </span>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent className=" !rounded-3xl !w-[90%] sm:!w-[60%] ">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Ticket Summary
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="space-y-4 flex flex-col gap-8" >

                                        <Tabs defaultValue="english" className="w-full">
                                            <TabsList className=" tab_new rounded-xl my-8">
                                                <TabsTrigger className="tab_new rounded-xl" value="english">English</TabsTrigger>
                                                <TabsTrigger className="tab_new rounded-xl" value="hindi">हिंदी</TabsTrigger>
                                            </TabsList>
                                            <TabsContent value="english" className="mt-4 space-y-4">
                                                {ticketSummary || "No overall summary found in English"}
                                            </TabsContent>
                                            <TabsContent value="hindi" className="mt-4 space-y-4">
                                                {hindiSummary || "हिंदी में कोई सारांश नहीं मिला"}
                                            </TabsContent>
                                        </Tabs>

                                        <div className="w-fit" >
                                            <div className="bg-red-400 rounded-lg text-black-2 p-4" >  <span className="font-bold" > Prority : </span> {priority} </div>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="text-foreground !text-xs" >Cancel</AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <div className=" text-base px-4 py-2 rounded-lg hover:bg-accent hover:text-[#4158D0] flex items-center gap-1 cursor-pointer duration-200 transition-all ease-in-out hover:scale-[0.9] group">
                                    <Info className="size-4" /> <span className="sm:flex hidden" > Info </span>
                                </div>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="flex items-center justify-between">
                                        <span>Ticket Details</span>
                                        <Badge variant={status === "Active" ? "default" : "secondary"}>{status}</Badge>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Here are the details for ticket ID:{" "}
                                        <span className="font-medium text-foreground">{ticketData.ticket_id}</span>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="grid gap-4 py-4 text-sm">
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <div className="font-medium">Priority:</div>
                                        <div>{ticketData.ticket_priority}</div>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <div className="font-medium">Created At:</div>
                                        <div>{new Date(ticketData.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <div className="font-medium">User ID:</div>
                                        <div>{ticketData.user_id}</div>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <div className="font-medium">Is Fake:</div>
                                        <div>{ticketData?.initial_analysis?.criticalInformation.is_fake ? "Yes" : "No"}</div>
                                    </div>
                                    <div className="grid grid-cols-2 items-center gap-2">
                                        <div className="font-medium">Location:</div>
                                        <div>{ticketData?.initial_analysis?.criticalInformation.location}</div>
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogAction>Close</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>

                    <div>
                        <MapChangeOption setMapType={setMapType} />
                    </div>

                </div>
            </nav>


        </header>
    )
}

export default NavigationDash



export const UserInfoComponent = ({ userInfo, status }) => {
    const [pfpImg, setpfpImg] = useState("");
    const [user, setUser] = useState()

    async function getProfileImage() {
        try {

            const { data } = await getUser(userInfo)
            setpfpImg(data?.photoURL);
            setUser(data)
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getProfileImage();
    }, [userInfo]);

    return (
        <div className="flex items-center relative">
            <Suspense fallback={<div className="w-12 h-12 rounded-full bg-gray-300" />}>
                {pfpImg && (
                    <div className="relative">
                        <HoverCard>
                            <HoverCardTrigger>
                                <Image src={pfpImg} alt="profile" width={30} height={30} className="rounded-full" />
                                <span
                                    className={`w-2 h-2 absolute top-0 right-[-1%] animate-ping rounded-full ${status === "Active" ? "bg-green-400" : "bg-red-500"
                                        }`}
                                />
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64 p-4">
                                <div className="flex flex-col space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm">{user.displayName}</h3>
                                        <Badge variant={status === "Active" ? "default" : "destructive"} className="text-xs">
                                            {status}
                                        </Badge>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate">{user.email}</span>
                                    </div>

                                    {/* Gender */}
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <User className="h-4 w-4" />
                                        <span className="capitalize">{user.sex}</span>
                                    </div>
                                </div>
                            </HoverCardContent>
                        </HoverCard>

                    </div>
                )}
            </Suspense>
        </div>
    );
};