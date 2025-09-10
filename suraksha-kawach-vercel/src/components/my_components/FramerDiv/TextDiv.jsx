'use client'
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const TextDiv = ({ main, h1, p }) => {

    const ref = useRef();
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end "]
    })

    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1])
    const y = useTransform(scrollYProgress, [0, 1], ["100%", "0%"])

    return (
        <div ref={ref} className='text-center' >
            <div className='max-w-[50rem] w-full mx-auto flex flex-col gap-5' >
                <div className="overflow-hidden" >
                    <motion.div style={{ opacity }} className='blue_bg rounded-xl inline-flex text-sm p-2 font-medium text-white-1 overflow-hidden relative' >
                        {main || "Empower Your Saftey"}
                    </motion.div>
                    <motion.h1 style={{ y }} className="sub-heading font-bold text-black-3" > {h1 || "Because Safety Shouldn’t Be a Question"}</motion.h1>
                </div>
                <motion.p style={{ y, opacity }} className='text-small-medium !font-normal' > {p || "From emergency alerts to guardian support and predictive health insights, Suraksha Kawach is your shield for a safer future."} </motion.p>

            </div>
        </div>
    )
}

export default TextDiv
