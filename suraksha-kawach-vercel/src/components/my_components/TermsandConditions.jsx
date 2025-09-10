import {Separator} from "@/components/ui/separator"
import {Card, CardContent} from "@/components/ui/card"
import {motion} from "framer-motion";

export default function TermsAndConditions() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
            <div className="section_container py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center my-12">
                        <div className='blue_bg rounded-xl inline-flex text-[2rem] p-2 font-medium text-white-1'>
                            Terms and Conditions
                        </div>
                    </div>

                    {/* Main Content */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-8">
                            <div className="space-y-8">
                                {/* Section 1 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">1. Acceptance of Terms</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        By downloading, installing, or using the Suraksha Kawach mobile application
                                        ("App"), you agree to be bound by these Terms and Conditions ("Terms"). If you
                                        do not agree to these Terms, please do not use our App.
                                    </p>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        These Terms constitute a legally binding agreement between you and Panthar
                                        Infohub Pvt. Ltd. ("Company", "we", "us", or "our").
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 2 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">2. Description of Service</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        Suraksha Kawach is a safety and emergency response mobile application that
                                        provides:
                                    </p>
                                    <ul className="list-disc list-inside text-small-medium text-gray-700 space-y-2 ml-4">
                                        <li>Real-time SOS alerts and safety features</li>
                                        <li>Emergency contact notification system</li>
                                        <li>Location sharing during emergencies</li>
                                        <li>Audio and multimedia recording during SOS situations</li>
                                        <li>Integration with local authorities and safety agencies</li>
                                    </ul>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 3 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">3. User Eligibility and
                                        Registration</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        You must be at least 13 years old to use this App. Users under 18 must have
                                        parental or guardian consent.
                                    </p>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        You agree to provide accurate, current, and complete information during
                                        registration and to update such information to keep it accurate, current, and
                                        complete.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 4 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">4. User Responsibilities</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">You agree
                                        to:</p>
                                    <ul className="list-disc list-inside text-small-medium text-gray-700 space-y-2 ml-4 mb-4">
                                        <li>Use the App only for legitimate safety and emergency purposes</li>
                                        <li>Provide accurate emergency contact information</li>
                                        <li>Not misuse the SOS feature for non-emergency situations</li>
                                        <li>Respect the privacy and safety of others</li>
                                        <li>Comply with all applicable laws and regulations</li>
                                        <li>Keep your login credentials secure and confidential</li>
                                    </ul>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 5 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">5. Prohibited Uses</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">You may not use
                                        the App to:</p>
                                    <ul className="list-disc list-inside text-small-medium text-gray-700 space-y-2 ml-4">
                                        <li>Submit false emergency alerts or abuse the SOS system</li>
                                        <li>Harass, threaten, or harm others</li>
                                        <li>Violate any laws or regulations</li>
                                        <li>Interfere with the App's functionality or security</li>
                                        <li>Use the App for commercial purposes without authorization</li>
                                        <li>Share inappropriate or offensive content</li>
                                    </ul>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 6 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">6. Privacy Policy</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        Your privacy is important to us. Our Privacy Policy explains how we collect,
                                        use, and protect your information when you use our App. By using the App, you
                                        also agree to our Privacy Policy.
                                    </p>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        Key privacy highlights include secure data handling, limited data retention (30
                                        days for SOS data), and no sale of personal information to third parties.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 7 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">7. Limitation of Liability</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        While we strive to provide reliable emergency services, the App is provided "as
                                        is" without warranties of any kind. We cannot guarantee:
                                    </p>
                                    <ul className="list-disc list-inside text-small-medium text-gray-700 space-y-2 ml-4 mb-4">
                                        <li>Uninterrupted or error-free service</li>
                                        <li>Immediate response from emergency services</li>
                                        <li>Accuracy of location services in all situations</li>
                                        <li>Prevention of harm or emergency situations</li>
                                    </ul>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        Our liability is limited to the maximum extent permitted by law. The App is a
                                        tool to assist in emergencies but should not replace direct contact with
                                        emergency services when possible.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 8 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">8. Termination</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        We may terminate or suspend your access to the App immediately, without prior
                                        notice, for conduct that we believe violates these Terms or is harmful to other
                                        users, us, or third parties.
                                    </p>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        You may terminate your account at any time by contacting us at
                                        support@pantharinfohub.com.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 9 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">9. Changes to Terms</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed mb-4">
                                        We reserve the right to modify these Terms at any time. We will notify users of
                                        significant changes through in-app notifications or email.
                                    </p>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        Continued use of the App after changes constitutes acceptance of the new Terms.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Section 10 */}
                                <section>
                                    <h2 className="textColor_Blue mb-4 font-bold text-3xl">10. Governing Law</h2>
                                    <p className="text-small-medium text-gray-700 leading-relaxed">
                                        These Terms are governed by the laws of India. Any disputes arising from these
                                        Terms or the use of the App will be subject to the jurisdiction of Indian
                                        courts.
                                    </p>
                                </section>

                                <Separator className="bg-gradient-to-r from-transparent via-blue-200 to-transparent"/>

                                {/* Contact Section */}
                                <section className="blue_bg p-6 rounded-lg text-white">
                                    <h2 className="sub-heading text-white mb-4">11. Contact Information</h2>
                                    <p className="text-small-medium text-white/90 leading-relaxed mb-4">
                                        If you have any questions about these Terms and Conditions, please contact us:
                                    </p>
                                    <div className="space-y-2 text-small-medium text-white/90">
                                        <p><strong className="text-white">Company:</strong> Panthar Infohub Pvt. Ltd.
                                        </p>
                                        <p><strong className="text-white">Email:</strong> connect@pantharinfohub.com</p>
                                        <p><strong
                                            className="text-white">Website:</strong> https://surakshakawach.co.in
                                        </p>
                                    </div>
                                </section>

                                {/* Footer */}
                                <div className="text-center pt-8">
                                    <p className="text-small-medium text-gray-500">
                                        By using Suraksha Kawach, you acknowledge that you have read, understood, and
                                        agree to be bound by these Terms and Conditions.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
