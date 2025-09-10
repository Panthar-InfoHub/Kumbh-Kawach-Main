import { Boxes, ChartNoAxesCombined, Command, MapPinned, Palette, ShieldPlus, Siren, Sparkles, TriangleAlert, Tv } from "lucide-react"

export const navItem = [
    {
        name: "Features",
        link: "/#features"
    },
    {
        name: "Plans",
        link: "/pricing"
    },
    {
        name: "Testimonials",
        link: "/#testimonials"
    },
    {
        name: "About Us",
        link: "/about"
    },
]

export const accor_data = [
    {
        value: 0,
        first: "Real - Time",
        color_word: "SOS",
        span_gradient: "service_span_1",
        rest_word: "Alert",
        img: "/real_time_mock.png",
        description: "Provides instant alerts during emergencies, complete with live location tracking and multimedia sharing. This ensures responders have critical information in real time, enabling faster and more accurate assistance.",
        icon: <TriangleAlert />
    },

    {
        value: 2,
        first: "Voice",
        color_word: "Command",
        rest_word: "Activation",
        img: "/voice_mock.png",
        span_gradient: "service_span_3",
        description: "Offers hands-free SOS activation through voice commands, making it easier to seek help in situations where physical interaction with the device may not be possible.",
        icon: <Command />
    },
    {
        value: 1,
        first: "AI ",
        color_word: "Case",
        rest_word: "Summarization",
        span_gradient: "service_span_2",
        img: "/summary.png",
        description: "Even in the absence of internet connectivity, users can trigger SOS alerts via SMS. This ensures that help is always accessible, no matter the situation or location.",
        icon: <Boxes />
    },
    {
        value: 3,
        first: "SOS",
        color_word: "Widget",
        rest_word: " Support",
        img: "/mock3.png",
        span_gradient: "service_span_3",
        description: "Offers hands-free SOS activation through voice commands, making it easier to seek help in situations where physical interaction with the device may not be possible.",
        icon: <Command />
    },
]

export const accor_data_second = [
    {
        value: 0,
        heading: "Enhanced Saftey",
        description: "Always stay aware of potential risks in your surroundings always maintain awareness of your surroundings and stay informed about potential risks to ensure your safety and preparedness in any situation.",
        icon: <ShieldPlus />
    },
    {
        value: 6,
        heading: "Cost Effective Solution",
        description: "Affordable and reliable solutions tailored to meet the needs of both individuals and businesses.",
        icon: <Sparkles />
    },
    {
        value: 2,
        heading: "User Friendly Interface",
        description: "Specifically designed to be easy to use for everyone, ensuring accessibility and simplicity regardless of an individual’s technical skill level or expertise.",
        icon: <Palette />
    },
]

export const benefit_data = [
    {
        icon: <MapPinned />,
        title: "Real-Time Saftey Monitoring",
        desc: "Stay informed with real-time traffic and security data, allowing you to mitigate risks and navigate more strategically and efficiently"
    },
    {
        icon: <ChartNoAxesCombined />,
        title: "Device Specific Data Insights",
        desc: "Gain insight into where and how your users or family members access critical services across various devices, including iOS, Windows, Android, and macOS"
    },
    {
        icon: <Sparkles />,
        title: "Prevent",
        desc: "Leverage our machine learning model to anticipate potential hazards in your vicinity and prepare accordingly"
    },
    {
        icon: <TriangleAlert />,
        title: "Community Based Alerts",
        desc: "Receive timely notifications about safety concerns reported by nearby users to ensure the protection of your loved ones"
    },
]

export const reviews = [
    {
        review: "Actually it is Good and ensures safety especially for women",
        author: {
            name: "Shruti Kaitwas",
            designation: "Student",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "I never imagined safety insights could be this convenient and precise. A must-have for every household",
        author: {
            name: "Avinash Kumar",
            designation: "IAS",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "Suraksha Kawach has completely transformed how we approach safety. The real-time alerts are lifesaving!",
        author: {
            name: "Ravi Sharma",
            designation: "Business Owner",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "I feel like it's useful and good to launch but in case of the damage to the the smartwatch it might not work I feel like arranging some sensor to detect the danger at the time of emergency!",
        author: {
            name: "Akriti Nigam",
            designation: "Student",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "I appreciate your idea and I love this concept that can be considered very beneficial for our safety purpose!",
        author: {
            name: "Hema Pandey",
            designation: "Business Owner",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "I am very surprised to see that Indian youngsters have been doing so good in this field i appreciate your team for that!",
        author: {
            name: "Ashish Kumar",
            designation: "SI",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "It has the potential to revolutionize personal it health management by integrating technology into daily life for real-time health monitoring and emergency assistance!",
        author: {
            name: "Ankit Arya",
            designation: "Business Owner",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: "I love the your concept, Even iam student i do travel from my home to tution and else , i think this mai help me to notify my parents where i am even in emergency or not",
        author: {
            name: "Shlok Pal",
            designation: "Student",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: `I would like this app to be adopted by RAILWAY`,
        author: {
            name: "Ashok Kumar",
            designation: "Railway Employee",
            image: "/user/ankit.jpeg"
        },
    },
    {
        review: `Wow, your idea for the "comprehensive health monitoring and emergency alert app" is truly innovative and thoughtful! The way you're integrating smartwatches and mobile devices to ensure user safety is impressive. Your attention to detail, especially with the fallback mechanisms for offline scenarios, shows how much you care about the app's effectiveness. Keep up the amazing work`,
        author: {
            name: "Jatin Gupta",
            designation: "Student",
            image: "/user/ankit.jpeg"
        },
    },

];