import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

export default function AboutPage() {
    return (
        <div className="min-h-screen z-[2] section_v2_container">

            {/* Hero Section */}
            <section className=" py-20 sm:py-16 flex justify-center items-center min-h-[70vh]">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium text-gray-900 mb-6 leading-tight">
                            Our goal is to  <span className="service_span_2">transform safety</span> to one step away.
                        </h1>
                        <p className="text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto py-8">
                            Suraksha Kawach empowers individuals with smart, secure, and professional safety solutions—delivering instant alerts,
                            live updates, and trusted support when it matters most.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 w-full bg-[#020617] text-white relative rounded-[2.75rem] h-[720px] sm:h-auto sm:overflow-visible  overflow-hidden ">

                <div
                    className="absolute inset-0 z-0 rounded-[2.75rem]"
                    style={{
                        background: "#000000",
                        backgroundImage: `
                            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
                            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
                            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
                        `,
                        backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                        backgroundPosition: "0 0, 10px 10px, 15px 5px",
                    }}
                />



                <div className="container mx-auto px-4 sm:px-6 lg:px-8  ">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8 z-10">
                            <Badge className="mb-4 bg-pink-500 text-white hover:bg-pink-500">Aapki Suraksha, Aapka Kawach</Badge>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6">Empowering Your Saftey</h2>
                            <p className="text-xl text-gray-300 leading-relaxed">
                                One Tap Away
                            </p>

                        </div>

                        <div className="absolute right-12 bottom-0">
                            <img
                                src="/mock_full.png"
                                alt="Suraksha Kawach Mock"
                                className=" w-[20rem] h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder's Section */}
            <section className="my-24 py-24 ">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8">
                            <div>
                                <Badge className="mb-4 blue_bg hover:bg-emerald-100">Founder's Desk</Badge>
                                <blockquote className="text-3xl md:text-[3.5rem] font-medium text-gray-900 !leading-tight">
                                    "Witnessing the need of saftey in real life, I knew there had to be a better way"
                                </blockquote>
                            </div>
                            <div className="space-y-4">
                                <p className=" text-xl sm:text-3xl text-gray-600 leading-relaxed">
                                    Suraksha Kawach is my answer to today’s safety challenges—a smart shield that enables instant SOS alerts, live multimedia sharing,
                                    and timely help. My vision is to make safety accessible, reliable, and a right for everyone
                                </p>
                                <div className="flex items-center space-x-4 pt-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">Abhay Namdev</p>
                                        <p className="text-gray-600">Founder & CEO Of Panthar Infohub</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden">
                                <img
                                    src="/abhay.jpeg"
                                    alt="Sahgal Yadav, Founder & CEO"
                                    className="w-full h-auto rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* CTA Section */}
            <section className=" my-14 w-full bg-[#020617] text-white relative rounded-[2.75rem] h-[920px] sm:h-auto sm:overflow-visible  overflow-hidden">

                <div
                    className="absolute inset-0 z-0 rounded-[2.75rem]"
                    style={{
                        background: "#000000",
                        backgroundImage: `
                            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),                                                                                                                                                                                                                                                                                         
                            radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
                            radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
                        `,
                        backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                        backgroundPosition: "0 0, 10px 10px, 15px 5px",
                    }}
                />
                <div className="container mx-auto px-4 sm:px-12 py-12 rounded-[2.75rem]">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8 z-10">
                            <div className="" >
                                <Badge className="mb-4 bg-pink-500 text-white hover:bg-pink-500">Be Among the First!</Badge>
                                <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Suraksha Kawach Today</h2>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    Your Early Access to Protection & Perks Starts Here!
                                </p>
                            </div>

                        </div>

                        <div className="">
                            <img
                                src="/mock_full.png"
                                alt="Suraksha Kawach Mock"
                                className=" w-[350px] h-[450px] sm:w-[350px] absolute right-[30px] sm:h-[400px] bottom-0"
                            />
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}
