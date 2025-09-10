import Link from "next/link"

export default function Footer() {
    return (
        <footer className="relative">
            {/* Glassmorphism footer */}
            <div className="bg-white/20 backdrop-blur-md border-t border-white/30">
                <div className="container mx-auto px-4 py-8">
                    {/* Main footer content */}
                    <div className="flex justify-between items-start sm:flex-row flex-col gap-12">
                        {/* Logo and company info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <img src="/logo_xl.png" alt="Company Logo" className=" h-16 sm:h-20 w-auto" />
                            </div>
                            <p className="text-slate-700 text-base leading-relaxed max-w-sm">
                                Empowering your saftey one tap away.
                            </p>
                        </div>

                        {/* Navigation links */}
                        <div className="lg:col-span-1">
                            <nav className="grid grid-cols-2 gap-x-8 gap-y-4">
                                <div className="space-y-3">
                                    <Link href="/about" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        About Us
                                   </Link>
                                    <Link href="/#features" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        Features
                                   </Link>
                                    <Link href="/pricing" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        Plans
                                   </Link>
                                </div>
                                <div className="space-y-3">
                                    <Link href="/tnc" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        Terms & Condition
                                   </Link>
                                    <Link href="/privacy" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        Privacy Policy 
                                   </Link>
                                    <Link href="/cookie-privacy" className="block text-slate-700 hover:text-blue-600 transition-colors font-medium">
                                        Cookie Policy
                                   </Link>
                                </div>
                            </nav>
                        </div>

                     
                    </div>

                    {/* Bottom section */}
                    <div className="mt-12 pt-8 border-t border-white/30">

                        {/* Copyright */}
                        <div className=" text-center">
                            <p className="text-slate-600 text-sm font-bold">©2025 Panthar InfoHub. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
