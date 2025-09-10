
import BenefitDiv from './FramerDiv/BenefitDiv'
import TextDiv from './FramerDiv/TextDiv'
import PricingPlan from './PricingPlan'

const Benefit = () => {
    return (
        <section className=' max-w-[90%] sm:max-w-[70%] w-full mx-auto py-[7rem] z-[1] relative flex flex-col gap-[8rem] ' >
            <TextDiv />
            <PricingPlan />
            {/* <Benefit_Tab data={accor_data} />
            <Benefit_Tab isFirst={false} data={accor_data_second} /> */}
            {/* <Services /> */}
            <BenefitDiv />
        </section>
    )
}

export default Benefit
