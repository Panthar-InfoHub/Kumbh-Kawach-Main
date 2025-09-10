'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import { useState } from "react"

const Benefit_Tab = ({ isFirst = true, data }) => {

    const [view, setView] = useState(0);
    return (
        <div className="flex gap-12 items-center" id={isFirst ? "features" : "benefits"} >
            <Tabs className={`w-full rounded-2xl flex items-center gap-16 justify-between flex-col ${isFirst ? "sm:flex-row" : "sm:flex-row-reverse"} `} defaultValue={view} onValueChange={(val) => setView(Number(val))} >
                <TabsList className="tab rounded-2xl h-full flex-1" >
                    {data.map((data) => (
                        <TabsTrigger key={data.value} className="rounded-xl p-6 tab_trigger opacity-50 hover:opacity-85 transition-all duration-200" value={data.value} >
                            <div className="flex gap-2 items-center" >
                                <span className="bg-[] p-2 rounded-lg " > {data.icon} </span>
                                <h3 className=" text-lg font-bold" > {data.heading} </h3>
                            </div>
                            {(view === data.value) && <p className="whitespace-normal break-words pl-8 text-left" >
                                {data.description}
                            </p>}
                        </TabsTrigger>
                    ))}
                </TabsList>


                <TabsContent value={0} className="w-full sm:w-[40%] justify-center" >
                    <div className={`w-full rounded-2xl px-10 flex bg-gradient-to-b from-[#f6f3ff] to-[#a8edea] h-[20rem] sm:h-[30rem] overflow-hidden`} >
                        <div className=" w-[65%] sm:w-[50%] relative self-center h-full translate-y-[5rem] mx-auto " >
                            <Image src="/bg/home.png" alt="background" fill quality={100} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value={1} className="w-full sm:w-[40%] justify-center" >
                    <div className={`w-full rounded-2xl px-10 flex bg-gradient-to-r from-[#e6e9f0] to-[#eef1f5] h-[20rem] sm:h-[30rem] overflow-hidden`} >
                        <div className=" w-[65%] sm:w-[50%] relative self-center h-full translate-y-[5rem] mx-auto " >
                            <Image src="/bg/offline.png" alt="background" fill />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value={2} className="w-full sm:w-[40%] justify-center" >
                    <div className={`w-full rounded-2xl px-10 flex bg-gradient-to-b from-[#accbee] to-[#e7f0fd] h-[20rem] sm:h-[30rem] overflow-hidden`} >
                        <div className=" w-[65%] sm:w-[50%] relative self-center h-full translate-y-[5rem] mx-auto " >
                            <Image src="/bg/voice.png" alt="background" fill quality={100} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value={3} className="w-full sm:w-[40%] justify-center" >
                    <div className={`w-full rounded-2xl px-10 flex bg-gradient-to-b from-[#fdfcfb] to-[#e2d1c3] h-[20rem] sm:h-[30rem] overflow-hidden`} >
                        <div className=" w-[65%] sm:w-[90%] relative self-center h-[80%] mx-auto " >
                            <Image src="/bg/multi.png" alt="background" fill quality={100} />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value={6} className="w-full sm:w-[40%] justify-center" >
                    <div className={`w-full rounded-2xl px-10 flex bg-gradient-to-b from-[#fdfcfb] to-[#e2d1c3] h-[20rem] sm:h-[30rem] overflow-hidden`} >
                        <div className=" w-[65%] sm:w-[50%] relative self-center h-full translate-y-[5rem] mx-auto " >
                            <Image src="/bg/dash.png" alt="background" fill quality={100} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Benefit_Tab