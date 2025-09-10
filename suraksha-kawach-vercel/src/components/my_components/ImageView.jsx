import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

export const VideoView = ({ files }) => {


    const scrollRef = useRef(null);
    const [loadedVideos, setLoadedVideos] = useState({}); // Track loaded videos individually
    const videoRefs = useRef([]); // Store refs for each video
    const [isLoading, setIsLoading] = useState({}); // Track if each video is still loading
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollPosition;
        }
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = entry.target.dataset.index;
                        setLoadedVideos((prev) => ({
                            ...prev,
                            [index]: true, // Mark only this video as loaded
                        }));
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: "100px", threshold: 0.1 }
        );

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => observer.disconnect();
    }, [files, scrollPosition]);

    if (!files || files.length === 0) {
        return <h3 className="font-semibold">No Videos yet!</h3>;
    }

    const handleScroll = () => {
        if (scrollRef.current) {
            setScrollPosition(scrollRef.current.scrollTop);
        }
    };

    return (
        <div className="p-6 pt-4 flex flex-col rounded-xl bg-[#d9d9d9] w-[50vh]">
            <h3 className="font-semibold text-xl mb-4">Videos</h3>

            <ScrollArea
                ref={scrollRef}
                className={`max-h-[400px] overflow-y-auto`}
                onScroll={handleScroll}
            >
                <div className="h-full w-full flex flex-col gap-4">
                    {files.map((video, index) => (
                        <div
                            key={index}
                            ref={(el) => (videoRefs.current[index] = el)}
                            data-index={index}
                            className="relative w-full  mb-4"
                        >
                            {loadedVideos[index] ? (
                                <div className="flex flex-col gap-4" >
                                    <div className="relative w-full h-32">
                                        {/* Loading Indicator */}
                                        {!isLoading[index] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black-3/80 animate-pulse">
                                                <p className="text-white">Loading...</p>
                                            </div>
                                        )}

                                        {/* Video Player */}
                                        <video
                                            src={video.url}
                                            controls
                                            preload="metadata"
                                            className="w-full h-full object-cover rounded-lg"
                                            onLoadedData={() =>
                                                setIsLoading((prev) => ({ ...prev, [index]: true }))
                                            }
                                        />

                                    </div>

                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline">View Summary {index + 1}</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="!top-[25%] !left-[25%] !rounded-3xl !w-1/2" >
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Video {index + 1} Summary </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {video?.transcript}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ) : (
                                <div className="w-full h-full bg-black-3/80 animate-pulse" />
                            )}
                        </div>
                    ))}
                </div>
            </ScrollArea>

        </div >
    );
};