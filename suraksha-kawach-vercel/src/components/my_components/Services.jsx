'use client'
import { motion } from "framer-motion"
import { CircleCheck } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

const Services = () => {

    const OPTIONS = { dragFree: false, loop: false }

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


    const plans = [
        {
            price: 80,
            name: "SDK",
            description: "Easily integrate our saftey features into your own apps with plug-and-play SDKs.",
            features: ["Android SDK", "Web SDK", "IoT SDK", "Built in voie trigger modules", "Offline mode rady component"]
        },
        {
            price: 80,
            name: "API",
            description: "Secure,scalable and developer friendly APIs to power your saftey features",
            features: ["Restful API access of Core features", "AI ticket analysis & status", "Real time location & status monitoring", "Authentication & User management APIs"]
        },
        {
            price: 80,
            name: "Custom Integration",
            description: "Tailored solutions to meet your business specific workflows and branding",
            features: ["White labeled emergency interface module", "Custom alert flow and escalation paths", "Workflow automation for ticket resolution", "Third Party system compatibility"]
        },
    ]

    return (
        <section className='section_container py-[7rem] z-[1] relative' id="services" >
            <div className='text-center mb-8' >
                <div className='max-w-[60rem] w-full mx-auto flex flex-col gap-10' >
                    <div className='overflow-hidden' >
                        <motion.h1 variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" className="heading text-black-3" >
                            Services
                        </motion.h1>
                    </div>

                    <div className='overflow-hidden' >
                        <motion.p variants={variants} style={{ transformOrigin: "bottom center" }} initial="initial" whileInView="animate" className='text-small-medium' >
                            Discover the real-world benefits of enhanced visitor experience, data-driven insights, and increased conversion rates through their experiences.
                        </motion.p>
                    </div>

                    <div className="flex gap-5 mt-4 flex-col sm:flex-row" >
                        {plans.map((plan, i) => (
                            <div key={i} className="serviceHover group flex flex-col gap-5 justify-start items-start font-medium" >
                                <h1 className="font-bold text-2xl group-hover:text-white-1" > {plan.name} </h1>
                                <p className="text-left text-base text-black-3 group-hover:text-white-1 " > {plan.description} </p>

                                <ul className="flex flex-col gap-4 group-hover:text-white-1 text-black-3" >
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-base" >
                                            <CircleCheck className="size-4 font-semibold" />
                                            <p className="text-left" >
                                                {feature}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <Link href="tel:8930588836" className="w-full mt-auto" >
                                    <Button className='w-full blue_bg flex p-4 rounded-xl text-white mt-6' >
                                        Call to Quote
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </section>
    )
}

export default Services
