"use client";

import { VideoIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MobileNav = ({ files }) => {
    const snapPoints = [0.4, "355px", 1];
    const [snap, setSnap] = useState(snapPoints[0]);
    const [openDrawer2, setOpenDrawer2] = useState(false);
    const videoRefs = useRef({});
    const [visibleIndices, setVisibleIndices] = useState(new Set());

    useEffect(() => {
        if (!files || files.length === 0) return;


        const observer = new IntersectionObserver(
            (entries) => {
                setVisibleIndices((prevIndices) => {
                    const newIndices = new Set(prevIndices);
                    entries.forEach((entry) => {
                        const index = Number(entry.target.dataset.index);
                        if (entry.isIntersecting) {
                            newIndices.add(index);
                        } else {
                            newIndices.delete(index);
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

    if (!files || files.length === 0) {
        return <h3 className="font-semibold">No Videos yet!</h3>;
    }

    return (
        <div className="flex flex-col gap-4">
            <Drawer
                open={openDrawer2}
                onOpenChange={setOpenDrawer2}
                snapPoints={snapPoints}
                activeSnapPoint={snap}
                setActiveSnapPoint={setSnap}
            >
                <DrawerTrigger asChild>
                    <div className="bg-[#d9d9d9] p-4 rounded-full cursor-pointer duration-200 transition-all ease-in-out hover:scale-[0.9] group">
                        <VideoIcon />
                    </div>
                </DrawerTrigger>
                <DrawerContent className="p-4 sm:hidden flex flex-col gap-4">
                    <h3 className="font-semibold text-xl mb-4">Videos</h3>
                    <ScrollArea className="h-[500px] overflow-y-auto">
                        <div className="h-full w-full flex flex-col gap-4">
                            {files.map((video, index) => (
                                <div
                                    key={index}
                                    ref={(el) => {
                                        if (el) {
                                            videoRefs.current[index] = el;
                                        }
                                    }}
                                    data-index={index}
                                    className="relative w-full mb-4"
                                >
                                    <div className="flex flex-col gap-4">
                                        <div className="relative w-full h-32">
                                            {visibleIndices.has(index) ? (
                                                <video
                                                    src={video.url}
                                                    className="w-full h-full object-cover rounded-lg"
                                                    preload="metadata"
                                                    playsInline
                                                    controls
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                                                    <p>Loading...</p>
                                                </div>
                                            )}
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline">
                                                    View Summary {index + 1}
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="!top-[25%] !left-[5%] !rounded-3xl !w-[90%] ">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        {video?.title || `Video ${index + 1} Summary`}
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {video?.transcript || "No transcript available."}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default MobileNav;
