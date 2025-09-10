import PricingPlan from "@/src/components/my_components/PricingPlan";
import { PricingTable } from "@/src/components/my_components/PricingTable";

export default function Page() {
    return (
        <div className="min-h-screen z-[2] section_v2_container">

            {/* Hero Section */}
            <section className="py-16 flex justify-center items-center min-h-[60vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Suraksha Kawach  <span className="service_span_2">Pricing </span> and Plans
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto py-4 text-center">
                            Whichever plan you choose, rest easy knowing that your
                            features will cover each family member
                        </p>
                    </div>
                </div>
            </section>

            <PricingPlan />

            <PricingTable />

        </div>
    )
}
