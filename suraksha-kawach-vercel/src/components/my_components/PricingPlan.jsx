import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, X, Info, Package, ArrowRight } from "lucide-react"
import { Button } from "../ui/button"
import { cn } from "@/src/lib/utils"
import { Badge } from "@/components/ui/badge"

const PricingPlan = () => {

    const pricingPlans = [
        {
            name: "Freemium",
            buttonText: "Get Started",
            buttonVariant: "outline",
            features: [
                { name: "Voice Command", value: false },
                { name: "AI Case Prioritization", value: true },
                { name: "Widget Control", value: true },
                { name: "Offline Mode", value: true },
                { name: "AI Summarization", value: true },
            ],
        },
        {
            name: "Silver",
            price: "$7.99",
            period: "month",
            popular: false,
            buttonText: "Choose Silver",
            features: [
                { name: "Voice Command", value: false },
                { name: "AI Case Prioritization", value: true },
                { name: "Widget Control", value: true },
                { name: "Offline Mode", value: true },
                { name: "AI Summarization", value: true },
            ],
        },
        {
            name: "Gold",
            price: "$15.99",
            period: "month",
            buttonText: "Choose Gold",
            features: [
                { name: "Family Subscription", value: "5 Members" },
                { name: "Voice Command", value: false },
                { name: "AI Case Prioritization", value: true },
                { name: "Widget Control", value: true },
                { name: "Offline Mode", value: true },
                { name: "AI Summarization", value: true },
            ],
        },
    ]

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 w-full mx-auto">
                {pricingPlans.map((plan, index) => (
                    <PricingCard key={index} plan={plan} index={index} />
                ))}
            </div>
        </div>
    )
}

export default PricingPlan

function PricingCard({ plan, className, index }) {
    return (
        <Card
            className={cn(
                "relative px-4 transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1 rounded-3xl group hover:bg-[#6cbdff]",
                plan.popular && "shadow-md scale-105",
                className,
                index === 1 && "bg-[#6cbdff] text-white"
            )}
        >
            {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 blue_bg">
                    Most Popular
                </Badge>
            )}

            <CardHeader className="text-center py-10  space-y-4">
                <div className="flex items-center gap-4" >
                    <div className={`p-2 rounded-xl ${index === 1 ? "bg-white" : "bg-blue-300"} `} >
                        <Package className={`${index === 1 ? 'text-blue-500' : 'text-white'} size-6 sm:size-8`} />
                    </div>
                    <h3 className={` break-words truncate text-xl sm:text-2xl md:text-4xl font-bold text-card-foreground group-hover:text-white-1 ${index === 1 && 'text-white'} `}>{plan.name}</h3>
                </div>
            </CardHeader>

            <CardContent className=" space-y-6 lg:space-y-4">
                {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className=" text-xs md:text-xl lg:text-sm font-medium group-hover:text-white-1">{feature.name}</span>
                            {feature.tooltip && <Info className="h-4 w-4 text-muted-foreground" />}
                        </div>
                        <div className="flex items-center">
                            {typeof feature.value === "boolean" ? (
                                feature.value ? (
                                    <div className="bg-blue-100 rounded-full p-1">
                                        <Check className=" w-3 h-3 sm:w-4 aspect-square text-blue-600" />
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 rounded-full p-1">
                                        <X className=" w-3 h-3 sm:w-4 aspect-square text-gray-400" />
                                    </div>
                                )
                            ) : (
                                <span className={` ${index === 1 && 'text-white'} text-xs md:text-base lg:text-sm font-semibold text-card-foreground group-hover:text-white-1`}>{feature.value}</span>
                            )}
                        </div>
                    </div>
                ))}
            </CardContent>

            <CardFooter>
                <Button className={`w-full rounded-3xl py-6 sm:py-8 ${index === 1 ? 'bg-white text-[#6cbdff] ' : 'bg-[#6cbdff]'}  group-hover:bg-white group-hover:text-[#6cbdff]`} size="lg">
                    {plan.buttonText} <ArrowRight />
                </Button>
            </CardFooter>
        </Card>
    )
}