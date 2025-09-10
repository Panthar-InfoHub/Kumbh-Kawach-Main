'use client'
import { benefit_data } from '@/src/lib/data'
import { motion, useInView } from "framer-motion"
import Image from 'next/image'
import { useRef } from "react"

const BenefitDiv = () => {

    const ref = useRef();
    const IsinView = useInView(ref)
    const variants = {
        initial: {
            opacity: "0",
            y: "100%",
        },
        animate: (i) => ({
            opacity: "1",
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.5,
                ease: [0.65, 0, 0.35, 1],
            }
        }),
    }

    return (
        <div className='flex justify-between mt-16 items-center flex-col-reverse lg:flex-row overflow-hidden' ref={ref} >

            {/* IMAGE */}
            <motion.div animate={{ y: IsinView ? "0%" : "100%" }} transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }} className={`rounded-2xl px-10 flex h-[750px] mt-10 lg:mt-0 flex-[0.5] relative`} >
                <Image src="/bg/dash.png" alt="background" fill className='w-full h-full object-contain' />
            </motion.div>

            <div className='flex-[0.55]' >
                <div>
                    <div className='btn text-white-1 rounded-xl inline-flex text-sm p-2 font-medium' >
                        Insight Tailored To You
                    </div>

                    <div className='overflow-hidden' >
                        <motion.h3 variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" className='sub-heading text-black-3 font-bold my-2' > Your Saftey. Your Insights. Your Empowerment. </motion.h3>
                    </div>
                    <div className='overflow-hidden' >
                        <motion.em variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" className='text-black-3 text-base' >
                            Suraksha Kawach exceeds traditional safety tools by offering customized analytics that empower individuals, families, and businesses to make informed decisions.
                        </motion.em>
                    </div>
                </div>

                <div className='card_grid_small mt-3' >
                    {benefit_data.map((data, index) => (
                        <div key={index} className='' >
                            <div className='overflow-hidden' >
                                <motion.div variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" custom={index} className='icon_bg text-blue-300 font-bold' >
                                    {data.icon}
                                </motion.div>
                            </div>
                            <div className='flex flex-col gap-2 mt-4 overflow-hidden' >
                                <div className='relative overflow-hidden' >
                                    <motion.h3 variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" custom={index} className='text-lg font-medium' > {data.title} </motion.h3>
                                </div>
                                <motion.p variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" custom={index} > {data.desc} </motion.p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default BenefitDiv
