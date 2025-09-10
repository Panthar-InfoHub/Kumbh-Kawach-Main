"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useEffect, useRef } from "react"

const ServicesCard = () => {

    const cards = [
        {
            bg_color: "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)",
            service_title: "Emergency SOS",
            service_desc: "This is a dummy description",
            service_video: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4"
        },
        {
            bg_color: "linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%)",
            service_title: "Voice Command",
            service_desc: "This is a dummy description",
            service_video: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4"
        },
        {
            bg_color: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
            service_title: "Offline Functionality",
            service_desc: "This is a dummy description",
            service_video: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4"
        },
        {
            bg_color: "linear-gradient(to top, #feada6 0%, #f5efef 100%)",
            service_title: "Emergency SOS",
            service_desc: "This is a dummy description",
            service_video: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4"
        },
        {
            bg_color: "linear-gradient(to top, #bdc2e8 0%, #bdc2e8 1%, #e6dee9 100%)",
            service_title: "Emergency SOS",
            service_desc: "This is a dummy description",
            service_video: "https://videos.pexels.com/video-files/7579667/7579667-uhd_1440_2732_25fps.mp4"
        },
    ]

    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    return (
        <section ref={containerRef} className='max-w-[70%] w-full mx-auto py-[7rem] z-[1] relative' id="features">
            {
                cards.map((card, i) => {
                    const targetScale = 1 - ((cards.length - i) * 0.05);
                    return (
                        <CardComponent key={i} card={card} i={i} progress={scrollYProgress} range={[i * 0.25, 1]} targetScale={targetScale} />
                    )
                })
            }
        </section>
    )
}

export default ServicesCard

const CardComponent = ({ card, i, progress, range, targetScale }) => {

    const container = useRef(null)
    const { scrollYProgress } = useScroll({
        target: container,
        offset: ['start end', 'start start']
    })

    const vidScale = useTransform(scrollYProgress, [0, 1], [2, 1])
    const scale = useTransform(progress, range, [1, targetScale])

    return (
        <div className="flex justify-center items-center h-screen sticky top-0 rounded-2xl " ref={container} >
            <motion.div style={{ scale, background: card.bg_color, top: `calc(-10% + ${i * 20}px)` }} className="w-full h-[65%] rounded-3xl relative " >
                <div className="p-8 flex flex-col gap-8" >
                    <div className="text-center text-3xl font-semibold" > <h3> {card.service_title} </h3> </div>

                    <div className={` flex justify-between items-start gap-6 ${i % 2 === 0 ? "flex-row-reverse" : "flex-row"}`} >
                        <div> <em> {card.service_desc} </em> </div>
                        <div className="flex-[0.7] aspect-video h-[70%] w-full rounded-2xl relative overflow-hidden" >

                            <motion.div style={{ scale: vidScale }} className="h-full w-full"  >
                                <video src={card.service_video}
                                    autoPlay muted
                                    controls={false} playsInline
                                    loading="lazy" loop={true}
                                    className="rounded-2xl h-full w-full object-cover" />
                            </motion.div>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
