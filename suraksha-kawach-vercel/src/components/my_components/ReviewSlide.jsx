import { reviews } from '@/src/lib/data'
import useEmblaCarousel from 'embla-carousel-react'
import { User } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaCarouselArrowButtons'

const TWEEN_FACTOR_BASE = 0.2

const ReviewSlide = (props) => {
    const { options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const tweenFactor = useRef(0)
    const tweenNodes = useRef([])

    const { prevBtnDisabled, nextBtnDisabled, onPrevButtonClick, onNextButtonClick } = usePrevNextButtons(emblaApi)

    const setTweenNodes = useCallback((emblaApi) => {
        tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
            return slideNode.querySelector('.embla__parallax__layer')
        })
    }, [])

    const setTweenFactor = useCallback((emblaApi) => {
        tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
    }, [])

    const tweenParallax = useCallback((emblaApi, eventName) => {
        const engine = emblaApi.internalEngine()
        const scrollProgress = emblaApi.scrollProgress()
        const slidesInView = emblaApi.slidesInView()
        const isScrollEvent = eventName === 'scroll'

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
            let diffToTarget = scrollSnap - scrollProgress
            const slidesInSnap = engine.slideRegistry[snapIndex]

            slidesInSnap.forEach((slideIndex) => {
                if (isScrollEvent && !slidesInView.includes(slideIndex)) return

                const translate = diffToTarget * (-1 * tweenFactor.current) * 100
                const tweenNode = tweenNodes.current[slideIndex]
                tweenNode.style.transform = `translateX(${translate}%)`
            })
        })
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        setTweenNodes(emblaApi)
        setTweenFactor(emblaApi)
        tweenParallax(emblaApi)

        emblaApi
            .on('reInit', setTweenNodes)
            .on('reInit', setTweenFactor)
            .on('reInit', tweenParallax)
            .on('scroll', tweenParallax)
            .on('slideFocus', tweenParallax)
    }, [emblaApi, tweenParallax])

    return (
        <div className="embla mt-16">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4 touch-pan-y touch-pinch-zoom ml-[calc(var(--slide-spacing) * -1)]  ">
                    {reviews.map((review, index) => (
                        <div key={index} className=' !px-12 bg-white-glass rounded-2xl border border-[#d9e2ec] embla__slide' >
                            <div className="rounded-3xl h-full overflow-hidden ">
                                <div className=" embla__parallax__layer relative w-full h-full flex justify-evenly flex-col">
                                    <div>
                                        " {review.review} "
                                    </div>
                                    <div className='flex mt-5 w-full justify-between items-center' >
                                        <div>
                                            <h3 className='font-medium' > {review.author.name} </h3>
                                        </div>
                                        <div className='icon_bg text-black-3 !bg-grey-2 font-bold'  >
                                            <User />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div >

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </div >
    )
}

export default ReviewSlide
