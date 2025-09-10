"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { registerStation, signInStation } from '@/src/lib/actions'
import { stationLoginSchema, stationRegisterSchema } from '@/src/lib/validation'
import { Home, KeySquare, LoaderIcon, Mail, MapPinned, Phone, User } from 'lucide-react'
import { useActionState, useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const PoliceStationLogin = () => {
    const [errors, setErrors] = useState({})

    const handleLogin = async (prevState, formData) => {
        try {
            const formValues = {
                station_password: formData.get("station_password"),
                station_id: formData.get("station_id"),
            }

            await stationLoginSchema.parseAsync(formValues);
            const res = await signInStation(formData)
            if (res.status === "SUCCESS") {
                toast.success("Login Successfully !!")
            }
            
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors);
                toast.error("Please check your input and try again !!")

                return { ...prevState, error: "Validation Failed", status: "Error" }
            }
            toast.error("An unexpected error occured")
            return {
                ...prevState,
                error: "An unexpected Error Occured",
                status: "Error"
            }
        }
    }
    const [state, formAction, isPending] = useActionState(handleLogin, { error: "", status: "INITIAL" })

    return (
        <div className="flex flex-col gap-8" >
            <div className='grid gap-2 text-center ' >
                <h1 className='text-5xl font-medium text-center flex flex-col items-center justify-center text-neutral-800' >
                    <div> Admin Dashboard Login </div>
                </h1>

                <p className='text-balance text-muted-foreground' > Please Enter station ID and Password to login. </p>
            </div>

            <form action={formAction} className='grid gap-4 text-neutral-800 text-xs max-w-2xl mx-auto' >
                <div className='flex items-center gap-1' >
                    <span> <KeySquare className='size-4' /> </span>
                    <div>
                        <Input id="station_id" name="station_id" type="text" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station ID" />
                        {errors.station_id && <p className='text-red-400'> {errors.station_id} </p>}
                    </div>
                    <div>
                        <Input id="station_password" name="station_password" type="password" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Password" />
                        {errors.station_password && <p className='text-red-400'> {errors.station_password} </p>}
                    </div>
                </div>

                <Button disabled={isPending} type="submit"> {isPending ? <> <LoaderIcon className='size-4 animate-spin' /> </> : "Submit"} </Button>
            </form>
        </div>
    )
}

export const PoliceStationRegister = () => {
    const [errors, setErrors] = useState({})

    const handleRegister = async (prevState, formData) => {
        try {
            const formValues = {
                station_name: formData.get("station_name"),
                station_latitude: Number(formData.get("station_latitude")),
                station_longitude: Number(formData.get("station_longitude")),
                station_address: formData.get("station_address"),
                station_phone: formData.get("station_phone"),
                station_email: formData.get("station_email"),
                station_password: formData.get("station_password"),
            }

            await stationRegisterSchema.parseAsync(formValues);
            const res = await registerStation(formData)

            if (res.status === 'SUCCESS') {
                toast.success("Station Registered Successfully !!")
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                const fieldErrors = error.flatten().fieldErrors;
                setErrors(fieldErrors);
                toast.error("Please check your input and try again !!")

                return { ...prevState, error: "Validation Failed", status: "Error" }
            }

            toast.error("An unexpected error occured")
            return {
                ...prevState,
                error: "An unexpected Error Occured",
                status: "Error"
            }
        }
    }
    const [state, formAction, isPending] = useActionState(handleRegister, { error: "", status: "INITIAL" })
    return (
        <div className="flex flex-col gap-8" >
            <div className='grid gap-2 text-center ' >
                <h1 className='text-5xl font-medium text-center flex flex-col items-center justify-center text-neutral-800' >
                    <div> Police Station Registration </div>
                </h1>

                <p className='text-balance text-muted-foreground' > Please provide police station details to register. </p>
            </div>

            <form action={formAction} className='grid gap-8 text-neutral-800 text-base max-w-2xl mx-auto' >

                <div>
                    <div className='flex items-center gap-1' >
                        <span> <User className='size-4' /> </span>
                        <Input id="station_name" name="station_name" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Name" />
                    </div>
                    {errors.station_name && <p className='text-red-400'> {errors.station_name} </p>}
                </div>


                <div className='flex justify-between items-center gap-8 flex-wrap' >
                    <div>
                        <div className='flex items-center gap-1' >
                            <span> <MapPinned className='size-4' /> </span>
                            <Input id="station_latitude" name="station_latitude" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Latitude" />
                            {errors.station_latitude && <p className='text-red-400'> {errors.station_latitude} </p>}
                        </div>
                    </div>

                    <div>
                        <div className='flex items-center gap-1' >
                            <span> <MapPinned className='size-4' /> </span>
                            <Input id="station_longitude" name="station_longitude" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Logitude" />
                            {errors.station_longitude && <p className='text-red-400'> {errors.station_longitude} </p>}
                        </div>
                    </div>
                </div>

                <div>
                    <div className='flex items-center gap-1' >
                        <span> <Home className='size-4' /> </span>
                        <Input id="station_address" name="station_address" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Address" />
                        {errors.station_address && <p className='text-red-400'> {errors.station_address} </p>}
                    </div>
                </div>


                <div>
                    <div className='flex items-center gap-1' >
                        <span> <Phone className='size-4' /> </span>
                        <Input id="station_phone" name="station_phone" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Phone" />
                        {errors.station_phone && <p className='text-red-400'> {errors.station_phone} </p>}
                    </div>
                </div>


                <div>
                    <div className='flex items-center gap-1' >
                        <span> <Mail className='size-4' /> </span>
                        <Input id="station_email" name="station_email" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Email" />
                        {errors.station_email && <p className='text-red-400'> {errors.station_email} </p>}
                    </div>
                </div>


                <div>
                    <div className='flex items-center gap-1' >
                        <span> <KeySquare className='size-4' /> </span>
                        <Input id="station_password" name="station_password" type="password" required className=" !rounded-none text-xs !border-b  border-b-input bg-transparent placeholder:text-neutral-800  placeholder:text-xs" placeholder="Enter Station Password" />
                        {errors.station_password && <p className='text-red-400'> {errors.station_password} </p>}
                    </div>
                </div>

                <Button type="submit" disabled={isPending}> {isPending ? <> <LoaderIcon className='size-4 animate-spin' /> </> : "Submit"} </Button>

            </form>
        </div>
    )
}
