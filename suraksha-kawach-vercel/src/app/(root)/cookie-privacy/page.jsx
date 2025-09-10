
export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-background z-10 py-28">
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">Cookie Policy</h1>
                    <p className="text-muted-foreground text-lg">Effective Date: 29/08/2025</p>
                </div>

                <div className="prose prose-gray max-w-none dark:prose-invert">
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">1. What Are Cookies?</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            Cookies are small files stored on your device when you visit our site. They help us improve website
                            functionality and provide a better user experience.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">2. Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Essential Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">Required for basic website functionality.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Analytics Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">To measure website traffic and usage.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Preference Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">To remember user settings and preferences.</p>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-foreground mb-2">Advertising Cookies</h3>
                                <p className="text-muted-foreground leading-relaxed">To provide relevant promotions (if applicable).</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">3. Managing Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                            You can accept or reject cookies via our cookie banner or adjust browser settings to block cookies.
                        </p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-foreground mb-4">Terms of Service</h2>
                        <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">Defines acceptable use of Suraksha Kawach.</p>
                            <p className="text-muted-foreground leading-relaxed">
                                Prohibits misuse (false SOS triggers, hacking, etc.).
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                States liability limits (Suraksha Kawach provides assistance but cannot guarantee prevention of all
                                incidents).
                            </p>
                            <p className="text-muted-foreground leading-relaxed">Covers subscription model (if B2C).</p>
                        </div>
                    </section>

                    <div className="bg-muted/30 p-6 rounded-lg border space-y-2 ">

                        <div className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">
                                Suraksha Kawach is a safety enhancement tool, not a guaranteed prevention mechanism.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                We do not take responsibility for network issues, device malfunction, or delays in law enforcement
                                response.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
