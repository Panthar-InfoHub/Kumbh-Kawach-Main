'use client'
import { accor_data } from "@/src/lib/data"
import { motion } from "framer-motion"
import Image from 'next/image'
import TextDiv from "./FramerDiv/TextDiv"

const Features = () => {
    const variants = {
        initial: {
            opacity: "0",
            y: "100%",
        },
        animate: (i) => ({
            opacity: "1",
            y: 0,
            transition: {
                delay: i * 0.025,
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1],
            }
        }),
    }
    return (
        <section className='section_v2_container py-[7rem] z-[1] relative' id="features" >
            <div className="w-full flex flex-col min-h-screen" >

                <TextDiv main="Fetaures of Suraskha Kawach" h1="India's first AI Powered saftey Application" p="Epowering your saftey" />

                <div className="flex flex-col gap-36 pt-28" >

                    {accor_data.map((data, i) => {
                        return (
                            <div className={`min-h-[20rem] w-full flex items-center flex-col-reverse justify-center ${i % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'}`} key={i}>
                                <div className=" w-full sm:w-1/2 relative h-full min-h-[300px] sm:min-h-[700px]" >
                                    <Image src={data.img} alt="mock_img" fill className=" object-contain z-10" />
                                </div>
                                <div className=" w-full sm:w-1/2 px-6 overflow-hidden" >
                                    <motion.div variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" className="text-black heading capitalize font-medium leading-tight "  >
                                        {data.first} <span className={i === 0 ? "service_span_1" : i === 1 ? "service_span_2" : "service_span_3"} > {data.color_word} </span> {data.rest_word}
                                    </motion.div>
                                    <div className="my-4 text-base sm:text-xl font-normal overflow-hidden text-black/60" >
                                        <motion.p variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" > {data.description} </motion.p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

            </div>
        </section>
    )
}

export default Features