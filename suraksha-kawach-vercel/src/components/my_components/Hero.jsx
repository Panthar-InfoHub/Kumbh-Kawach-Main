'use client'
import { Button } from '@/components/ui/button'
import HeroImage from '@/public/mock1.png'
import { motion } from "framer-motion"
import Image from 'next/image'
import GetApp from './GetApp'

const Hero = () => {

    const variants = {
        initial: {
            y: 100,
            opacity: 0
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.85, 0, 0.15, 1],
            }
        }
    }
    const smallVariants = {
        initial: {
            opacity: 0,
            y: 80,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                delay: 0.3,
                ease: [0.85, 0, 0.15, 1],
            }
        }
    }
    const boxVariant = {
        initial: {
            opacity: 0,
        },
        animate: {
            opacity: 1,
            transition: {
                delay: 0.5,
                ease: [0.85, 0, 0.15, 1],
            }
        }
    }
    const imgVariant = {
        initial: {
            y: 300,
            opacity: 0,
        },
        animate: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 1,
                delay: 0.6,
                ease: [0.85, 0, 0.15, 1],
            }
        }
    }

    return (
        <section className='pt-[9rem] pb-20 z-[1] relative' >
            <div className='section_container flex flex-col ' >
                {/* <div className='section_bg' /> */}
                <div>
                    <div className='text-center' >
                        <div className='max-w-[62rem] w-full mx-auto flex flex-col gap-5' >
                            <div className="overflow-hidden" >
                                <motion.div variants={boxVariant} initial="initial" animate="animate" className='blue_bg rounded-xl inline-flex text-sm p-2 font-medium text-white-1' >
                                    The Ultimate Saftey Application
                                </motion.div>
                                <motion.h1 variants={variants} initial="initial" animate="animate" className="heading text-black-3 overflow-hidden mt-6" >
                                    "Aapki Suraksha, Aapka Kawach"
                                    <br />
                                    <motion.span className='blue_bg text-grey-4 ' > Empowering Your Saftey
                                        <br />
                                        One Tap Away </motion.span>
                                </motion.h1>
                            </div>
                            <motion.div variants={smallVariants} initial="initial" animate="animate">
                                <p variants={smallVariants} initial="inital" animate="animate" className='text-small-medium relative' >
                                    Empowering you with live analytics and actionable insights for ultimate safety and security.
                                </p>
                            </motion.div>

                            <motion.div variants={smallVariants} initial="initial" animate="animate" className='flex flex-wrap gap-4 justify-center text-base' >
                                <GetApp />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* SECOND DIV FOR MOCKUPS */}
                <div className='mt-10' >
                    <motion.div variants={imgVariant} initial="initial" animate="animate" className='mx-auto  w-[300px] h-[400px] sm:w-[650px] lg:w-[820px] sm:h-[720px] relative p-4 rounded-2xl' >
                        <Image src={HeroImage} placeholder="blur" fill alt='hero' quality={100} className='object-contain' />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default Hero