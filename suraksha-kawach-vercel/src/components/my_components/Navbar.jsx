'use client'
import { motion, useMotionValueEvent, useScroll } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { navItem } from "../../lib/data"
import GetApp from "./GetApp"
import MobileNavigation from "./MobileNavigation"

const Navbar = () => {
    const [isHidden, setIsHidden] = useState(false)
    const lastYRef = useRef(0);
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, "change", (y) => {
        const diff = y - lastYRef.current;
        if (Math.abs(diff) > 50) {
            setIsHidden(diff > 0);
            lastYRef.current = y;
        }
    })

    const variants = {
        initial: {
            y: "-100%",
        },
        hide: {
            y: "-80%",
        },
        animate: {
            y: 0,
            transition: {
                delay: 0.5,
                duration: 0.4,
                ease: [0.85, 0, 0.15, 1],
            }
        }
    }

    return (
        <motion.header variants={variants} initial="initial" whileHover={{ y: 0, cursor: "pointer" }} animate={isHidden ? "hide" : "animate"} className="header fixed top-0 left-0 right-0 bg-white-glass backdrop-blur-xl z-50" >
            <nav className="flex justify-between items-center" >
                <Link href="/" className="flex items-center" >
                    <Image src="/logo.png" alt="Logo" width={60} height={60} quality={100}  />
                    <Image src="/logo_text.png" alt="Logo" width={100} height={80} quality={100}  />
                </Link>

                <div className="hidden lg:flex items-center justify-between text-black-2 flex-[0.5]">
                    {navItem.map((item, index) => (

                        <motion.div key={index} >
                            <Link href={item.link || "#workSection"}  >
                                {item.name}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                <div className="hidden lg:inline-block" >
                    <GetApp />
                </div>


                {/* MOBILE NAVBAR */}
                <MobileNavigation />
            </nav>
        </motion.header >
    )
}

export default Navbar
