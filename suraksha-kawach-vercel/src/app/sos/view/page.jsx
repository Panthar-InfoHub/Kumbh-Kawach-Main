"use client";

import NavigationDash from "@/src/components/dashboard_comp/NavigationDash";
import { getSumamry, getTicketDetails, getUser } from "@/src/lib/actions";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import MapComponent from "./map";
import { getSpecificErrorMessage } from "@/src/lib/utils";
// Mark page as dynamic
export const dynamic = "force-dynamic";


const server_url = process.env.NEXT_PUBLIC_BACKEND_URI;

export default function ViewSOS() {
    // Wrap useSearchParams in Suspense to handle its runtime hydration needs
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ViewSOSContent />
        </Suspense>
    );
}

function ViewSOSContent() {
    const params = useSearchParams();
    const ticketId = params.get("ticketId");
    const firebaseUID = params.get("firebaseUID");

    const [userData, setUserData] = useState(undefined); // For map component
    const [ticketData, setTicketData] = useState(undefined);
    const [mapType, setMapType] = useState("terrain");
    const [locationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priority, setPriority] = useState(0);
    const [ticketSummary, setTicketSummary] = useState("");
    const [hindiSummary, setHindiSummary] = useState("");

    //Initial Fetching
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const [ticketRes, summaryRes, userRes] = await Promise.allSettled([
                    getTicketDetails(firebaseUID, ticketId),
                    getSumamry(firebaseUID, ticketId),
                    getUser(firebaseUID)
                ]);
                console.log("Ticket Res ==> ", ticketRes)
                console.log("Summary Res ==> ", summaryRes)
                console.log("user Res ==> ", userRes)
                const errors = [];
                const context = { ticketId, firebaseUID };

                // Collect all errors instead of throwing immediately
                const ticketError = getSpecificErrorMessage('ticket', ticketRes, context);
                console.debug("Ticket error res ==> ", ticketError)
                if (ticketError) errors.push(ticketError);

                const summaryError = getSpecificErrorMessage('summary', summaryRes, context);
                console.debug("Summary error res ==> ", summaryError)
                if (summaryError) errors.push(summaryError);

                const userError = getSpecificErrorMessage('user', userRes, context);
                console.debug("User error res ==> ", userError)
                if (userError) errors.push(userError);

                // Throw combined error if any failures occurred
                if (errors.length > 0) {
                    console.log("Errors array ==> ", errors)
                    const errorMessage = errors.length === 1
                        ? errors[0]
                        : `Multiple services failed:\n${errors.map((err, index) => `${index + 1}. ${err}`).join('\n')}`;

                    throw new Error(errorMessage);
                }

                // Set data only if all APIs succeeded
                setUserData(userRes.value.data);
                setTicketData(ticketRes.value.data);
                setLocationData(ticketRes.value.location || []);
                setPriority(summaryRes.value?.priority || 0);
                setTicketSummary(summaryRes.value?.data?.english?.text || "");
                setHindiSummary(summaryRes.value?.data?.hindi?.text || "");

            } catch (error) {
                console.error("Multiple API errors:", error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        let intervalId
        if (ticketData?.status !== "Closed" || process.env.NEXT_PUBLIC_MODE === "Development") {
            intervalId = setInterval(async () => {
                try {
                    const res = await axios.get(`${server_url}/v2/user/${firebaseUID}/ticket/${ticketId}`)
                    const newTicketData = res.data.data;

                    console.log("New data ==> ", newTicketData)

                    setTicketData(prevTicketData => {
                        if (!prevTicketData) return newTicketData;

                        console.log("Prev  data ==> ", prevTicketData)

                        const videosMap = new Map(prevTicketData?.video?.map(video => [video.video_id, video]));
                        console.log("Videos map ==> ", videosMap)
                        let hasNewVideo = false;

                        newTicketData?.video?.forEach(video => {
                            if (!videosMap.has(video.video_id)) {
                                videosMap.set(video.video_id, video);
                                hasNewVideo = true;
                            }
                        });
                        if (!hasNewVideo) return { ...prevTicketData, status: newTicketData?.status };
                        console.log("I am in timeout and there are new videos ")

                        const updatedVideos = Array.from(videosMap.values());
                        return {
                            ...newTicketData,
                            video: updatedVideos,
                        };
                    });
                } catch (e) {
                    console.error("Error updating ticket details:", e);
                }
            }, 5000); // 5 sec
        }

        return () => clearInterval(intervalId);
    }, [ticketId, firebaseUID, ticketData?.status]);

    const fetchLatestLocation = async () => {
        try {
            const { data: resData } = await axios.get(`${server_url}/v2/user/${firebaseUID}/ticket/${ticketId}/location`)
            const data = resData?.data;
            console.log("Location data ==> ", locationData)
            setLocationData(prev => {
                if (prev.length > 0 && prev[prev.length - 1]?.latitude === data?.latitude && prev[prev.length - 1]?.longitude === data?.longitude) {
                    return prev;
                }
                return [...prev, data]
            });
            return data;
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) {
        return (
            <section id="loading">
                <div className="flex w-full h-screen items-center justify-center">
                    <h1 className="text-2xl flex items-center gap-1">
                        Loading <span> <LoaderCircle className="animate-spin" /> </span>
                    </h1>
                </div>
            </section>
        );
    }

    return (
        <section id="welcome">
            <div className="relative">
                <div className="h-screen w-screen relative overflow-hidden">
                    <div className="fixed top-0 inset-x-0 z-10" >
                        <NavigationDash priority={priority} hindiSummary={hindiSummary} setMapType={setMapType} userInfo={firebaseUID} status={ticketData?.status} files={ticketData?.video || []} ticketSummary={ticketSummary} ticketData={ticketData} />
                    </div>
                    <div className="w-full h-full overflow-hidden relative">
                        <MapComponent mapType={mapType} location={locationData?.slice(-1)[0]} locationHistory={locationData} status={ticketData?.status} updateFunction={fetchLatestLocation} />
                    </div>

                </div>
            </div>
        </section>
    );
}
