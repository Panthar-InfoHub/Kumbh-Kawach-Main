import { Check, Info, X } from "lucide-react"


const features = [
    {
        name: "Family Membership",
        hasTooltip: true,
        free: "0 Member",
        silver: "0 Member",
        gold: "5 Member",
    },
    {
        name: "SOS Alert",
        hasTooltip: true,
        free: true,
        silver: true,
        gold: true,
    },
    {
        name: "Realtime Multimedia",
        hasTooltip: true,
        free: true,
        silver: true,
        gold: true,
    },
    {
        name: "Offline Functionality",
        hasTooltip: true,
        free: false,
        silver: true,
        gold: true,
    },
    {
        name: "Voice Command Activation",
        hasTooltip: true,
        free: true,
        silver: true,
        gold: true,
    },
    {
        name: "Widget Control",
        free: true,
        silver: true,
        gold: true,
    },
    {
        name: "AI Case Summarization",
        hasTooltip: true,
        free: false,
        silver: true,
        gold: true,
    },
]

function FeatureCell({ value }) {
    if (typeof value === "boolean") {
        return value ? (
            <Check className="text-blue-600 bg-blue-100 p-1.5 rounded-full size-8 mx-auto" />
        ) : (
            <X className="text-gray-700 bg-gray-200 rounded-full size-8 p-1.5 mx-auto" />
        )
    }
    return <span className="text-lg font-normal text-gray-900">{value}</span>
}

export function PricingTable() {
    return (
        <div className="mx-auto p-6 my-36">
            <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                    Compare  <span className="service_span_2">Suraksha Kawach </span> Plans
                </h1>
            </div>

            <div className=" overflow-hidden">
                <div className="overflow-x-auto py-16">
                    <table className="w-full">
                        {/* Table Header */}
                        <thead>
                            <tr className="border-b-2 border-black text-3xl font-bold py-6">
                                <th className="text-left py-6 px-6 font-semibold text-gray-900 ">Feature</th>
                                <th className="text-center py-6 px-6 font-semibold text-gray-900 ">Free</th>
                                <th className="text-center py-6 px-6 font-semibold text-gray-900 ">Silver</th>
                                <th className="text-center py-6 px-6 font-semibold text-gray-900 ">Gold</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {features.map((feature, index) => (
                                <tr
                                    key={feature.name}
                                    className={`border-b-2 border-black hover:/50 transition-colors text-lg`}
                                >
                                    <td className="py-6 px-6">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{feature.name}</span>
                                            {feature.hasTooltip && <Info className="size-5 text-black" />}
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <FeatureCell value={feature.free} />
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <FeatureCell value={feature.silver} />
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        <FeatureCell value={feature.gold} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    )
}
