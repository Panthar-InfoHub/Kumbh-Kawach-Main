"use client"

import { Badge } from "@/components/ui/badge";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from 'embla-carousel-react';
import { Download } from "lucide-react";
import { useCallback, useEffect, useRef } from 'react';

const TWEEN_FACTOR_BASE = 0.84

const numberWithinRange = (number, min, max) =>
    Math.min(Math.max(number, min), max)


const Reviews = () => {


    const options = { loop: true }
    const slides = [
        {
            "author": "Sahgal Yadav (Founder, LessPay)",
            "review": "As an entrepreneur, I value solutions that solve real problems. Suraksha Kawach is not just an app, it is a shield of safety. The simplicity of use and the reliability during emergencies make it a revolutionary step towards protecting lives.",
            "rating": 5
        },
        {
            "author": "Rachit Agarwal (CA)",
            "review": "In today’s busy life, safety often takes a backseat. Suraksha Kawach gives peace of mind — knowing that with just one click, help is on the way. It’s an innovation every household must adopt.",
            "rating": 5
        },
        {
            "author": "Rishi Sugandh (CA)",
            "review": "Being in the financial world, I know the importance of security. Suraksha Kawach brings that same sense of assurance to personal safety. It’s a must-have in every phone, especially for our loved ones.",
            "rating": 5
        },
        {
            "author": "Laxmi Aggarwal (VIP)",
            "review": "As someone who has always stood for women’s safety, I see Suraksha Kawach as a powerful step forward. It empowers women to feel secure and gives families hope that their loved ones are never truly alone.",
            "rating": 5
        },
        {
            "author": "Ravi Sharma (MLA)",
            "review": "Safety of citizens is our foremost duty, and Suraksha Kawach is a shining example of how technology can support this mission. It reflects a vision of a safer and stronger community.",
            "rating": 5
        },
        {
            "author": "Tripti Sharma",
            "review": "Being a working woman, I often travel late. Suraksha Kawach is my constant companion — a simple tap and I know my family is informed. It’s not just an app, it’s a lifeline.",
            "rating": 5
        },
        {
            "author": "Parantap Sharma",
            "review": "I truly appreciate the thought and effort behind Suraksha Kawach. It’s rare to find technology that genuinely cares. This app brings confidence and security to every user.",
            "rating": 5
        }
    ]



    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 1500 })
    ])
    const tweenFactor = useRef(0)



    const setTweenFactor = useCallback((emblaApi) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, [])

    const tweenOpacity = useCallback((emblaApi, eventName) => {
        const engine = emblaApi.internalEngine()
        const scrollProgress = emblaApi.scrollProgress()
        const slidesInView = emblaApi.slidesInView()
        const isScrollEvent = eventName === 'scroll'

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress
            const slidesInSnap = engine.slideRegistry[snapIndex]

            slidesInSnap.forEach((slideIndex) => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return

                if (engine.options.loop) {
                    engine.slideLooper.loopPoints.forEach((loopItem) => {
                        const target = loopItem.target()

                        if (slideIndex === loopItem.index && target !== 0) {
                            const sign = Math.sign(target)

                            if (sign === -1) {
                                diffToTarget = scrollSnap - (1 + scrollProgress)
                            }
                            if (sign === 1) {
                                diffToTarget = scrollSnap + (1 - scrollProgress)
                            }
                        }
                    })
                }

                const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
                const opacity = numberWithinRange(tweenValue, 0, 1).toString()
                emblaApi.slideNodes()[slideIndex].style.opacity = opacity
            })
        })
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        setTweenFactor(emblaApi)
        tweenOpacity(emblaApi)
        emblaApi
            .on('reInit', setTweenFactor)
            .on('reInit', tweenOpacity)
            .on('scroll', tweenOpacity)
            .on('slideFocus', tweenOpacity)
    }, [emblaApi, tweenOpacity])



    return (
        <div id="testimonials" className=" py-[20px] sm:py-[180px] relative ">
            <div className=" w-[90%] mx-auto ">

                <div className="flex flex-col text-center gap-6 w-full">
                    <h1 className="  text-3xl md:text-6xl font-bold" > What Our Clients Are Saying </h1>

                    <span> Discover the experience of those we've had the pleasure to work with. Our client's success stories are a testament to the deication and passion we put into every project </span>
                </div>


                <div className="embla">
                    <div className="embla__viewport" ref={emblaRef}>
                        <div className="embla__container">
                            {slides.map((review, index) => (

                                <div className="embla__slide_cover" key={index} >
                                    <div className="embla__slide" key={index}>
                                        <div>
                                            <span className=" text-base sm:text-xl" > " {review.review} " </span>
                                        </div>
                                        <div className="flex pt-8 pb-4 items-center text-2xl gap-6 ">
                                            <span className="font-medium" > {review.author} </span>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>



            </div>
        </div>
    )
}
                    
export default Reviews