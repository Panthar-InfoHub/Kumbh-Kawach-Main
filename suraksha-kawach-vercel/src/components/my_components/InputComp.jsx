'use client'
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useActionState } from 'react';
import { toast } from 'sonner';

const InputComp = () => {

    const submissionAction = async (prevData, formData) => {
        try {
            const response = await fetch('/api/mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientEmail: formData.get("email"),
                    location: formData.get("location"),
                    phone: formData.get("phone"),
                    fullName: `${formData.get("firstName")} ${formData.get("lastName")}`
                }),
            });

            if (response.ok) {
                toast.success('You will be notified soon!');
            } else {
                toast.warning('Failed to send notification. Please try again.');
            }
        } catch (error) {
            toast.warning('Failed to send notification. Please try again.');
        }
    }

    const [state, formAction, isPending] = useActionState(submissionAction, {
        message: "",
        status: "INITIAL",
    })

    return (
        <>
            <div className="text-center mb-4 sm:mb-6">
                <h1 className=" text-xl sm:text-3xl font-bold text-gray-900 mb-2">Request Beta Access</h1>
                <p className="text-base text-gray-600">
                    Join our exclusive beta program and be the first to experience our new features.
                </p>
            </div>
            <form className='flex flex-col gap-3 justify-between space-y-4 sm:space-y-6' action={formAction} >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Input
                            type="text"
                            name="firstName"
                            placeholder="FIRST NAME"
                            className="w-full py-5 px-6 bg-white border border-gray-300 rounded-full outline-none transition-all duration-200 focus:border-gray-400 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:tracking-wide"
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="text"
                            name="lastName"
                            placeholder="LAST NAME"
                            className="w-full py-5 px-6 bg-white border border-gray-300 rounded-full outline-none transition-all duration-200 focus:border-gray-400 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:tracking-wide"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Input
                            type="email"
                            name="email"
                            placeholder="EMAIL ADDRESS"
                            className="w-full py-5 px-6 bg-white border border-gray-300 rounded-full outline-none transition-all duration-200 focus:border-gray-400 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:tracking-wide"
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="PHONE"
                            className="w-full py-5 px-6 bg-white border border-gray-300 rounded-full outline-none transition-all duration-200 focus:border-gray-400 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:tracking-wide"
                        />
                    </div>
                </div>

                {/* Subject Field */}
                <div>
                    <Input
                        type="text"
                        name="location"
                        placeholder="LOCATION"
                        className="w-full py-5 px-6 bg-white border border-gray-300 rounded-full outline-none transition-all duration-200 focus:border-gray-400 placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base placeholder:font-medium placeholder:tracking-wide"
                        required
                    />
                </div>


                <button type="submit" className="btn py-3 px-4 rounded-xl transition-all duration-200 w-fit disabled:disAbleBtn text-white font-medium  flex justify-center items-center" disabled={isPending} > {isPending ? <> <Loader2 className='animate-spin text-black-2' /> </> : "Get Notified"} </button>
            </form>

        </>
    )
}

export default InputComp