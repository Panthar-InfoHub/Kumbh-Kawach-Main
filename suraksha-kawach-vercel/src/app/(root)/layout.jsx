import { Toaster } from "@/components/ui/sonner";
import Footer from "@/src/components/my_components/Footer";
import LenisDiv from "@/src/components/my_components/LenisDiv";
import Navbar from "@/src/components/my_components/Navbar";

export default function RootLayout({ children }) {
    return (
        <LenisDiv>
            <div className="min-h-screen w-full relative">

                <main className="pt-2 min-h-screen w-full relative flex flex-col" >
                    <div
                        className="fixed inset-0 z-0"
                        style={{
                            background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, rgba(70, 130, 180) 100%)",
                        }}
                    />
                    <Navbar />
                    {children}
                    <Footer />
                </main>
            </div>
        </LenisDiv>
    )
}
