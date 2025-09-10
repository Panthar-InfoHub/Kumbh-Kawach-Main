import { Building, Mail } from "lucide-react"

export const metadata = {
    title: "Privacy Policy - Suraksha Kawach",
    description: "Privacy Policy for Suraksha Kawach safety and SOS services",
}

export default function Page() {
    return (
        <div className="min-h-screen bg-background z-10 pt-28">
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="prose prose-gray max-w-none dark:prose-invert">
                    <h1 className="text-4xl font-bold text-foreground mb-8 text-balance">Privacy Policy</h1>

                    <div className="space-y-8 text-muted-foreground leading-relaxed">
                        <div className="bg-muted/30 p-6 rounded-lg border">
                            <p className="text-sm text-muted-foreground mb-2">
                                <strong>Effective Date:</strong> 29/08/2025
                                <br />
                                <strong>Last Updated:</strong> 29/08/2025
                            </p>
                        </div>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
                            <p className="mb-4">
                                Suraksha Kawach ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy
                                explains how we collect, use, and safeguard your information when you use our website and mobile
                                application.
                            </p>
                            <p>By accessing our services, you agree to the terms described in this policy.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
                            <p className="mb-4">We may collect the following types of data:</p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>
                                    <strong>Personal Information:</strong> Name, email address, phone number, emergency contacts, etc.
                                </li>
                                <li>
                                    <strong>Location Data:</strong> Real-time GPS location when SOS is triggered.
                                </li>
                                <li>
                                    <strong>Device Information:</strong> Device ID, operating system, IP address, browser details.
                                </li>
                                <li>
                                    <strong>Multimedia Data:</strong> Images, audio, and video captured during SOS events.
                                </li>
                                <li>
                                    <strong>Usage Data:</strong> How you interact with our website, cookies, analytics data.
                                </li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To provide and improve our SOS and safety services.</li>
                                <li>To notify emergency contacts and law enforcement during an SOS.</li>
                                <li>To analyze multimedia and generate AI-based safety insights.</li>
                                <li>To send updates, alerts, and promotional messages (with consent).</li>
                                <li>To comply with legal obligations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Sharing & Disclosure</h2>
                            <p className="mb-4">We may share data with:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>
                                    <strong>Law Enforcement Authorities:</strong> During emergencies.
                                </li>
                                <li>
                                    <strong>Emergency Contacts:</strong> As per user settings.
                                </li>
                                <li>
                                    <strong>Service Providers:</strong> For hosting, analytics, cloud storage.
                                </li>
                                <li>
                                    <strong>Legal Compliance:</strong> When required by law.
                                </li>
                            </ul>
                            <p className="font-medium text-foreground">We do not sell or rent user data to third parties.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Storage & Security</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Data is stored securely on encrypted servers.</li>
                                <li>SOS multimedia is only shared with authorized parties.</li>
                                <li>We use strong encryption (TLS/SSL) to protect data in transit.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies & Tracking</h2>
                            <p className="mb-4">We use cookies and tracking technologies to:</p>
                            <ul className="list-disc pl-6 space-y-2 mb-4">
                                <li>Improve user experience.</li>
                                <li>Analyze website performance.</li>
                                <li>Remember user preferences.</li>
                            </ul>
                            <p>Users can disable cookies in browser settings.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">7. User Rights</h2>
                            <p className="mb-4">
                                Depending on your jurisdiction (GDPR, Indian IT Act, etc.), you may have rights to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access, update, or delete your data.</li>
                                <li>Withdraw consent at any time.</li>
                                <li>Request a copy of your stored data.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
                            <p>Our services are not intended for children under 13 without parental consent.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Contact Us</h2>
                            <p className="mb-4">If you have questions about this Privacy Policy, contact us:</p>
                            <div className="bg-muted/30 p-6 rounded-lg border space-y-2">
                                <p className="flex items-center gap-2" >
                                    <Mail /> <strong>Email :</strong> connect@pantharinfohub.com
                                </p>
                                <p className="flex items-center gap-2" >
                                    <Building /> <strong>Address :</strong> RISE Incubation, Nagar Nigam Premises, Elite Square, Civil Lines, Jhansi (UP) - 284001
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
