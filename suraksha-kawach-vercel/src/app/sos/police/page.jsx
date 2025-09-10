import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PoliceStationLogin, PoliceStationRegister } from '@/src/components/dashboard_comp/PoliceStationLogin'

const page = () => {
    return (
        <div className='min-h-screen flex items-center justify-center' >
            <Tabs defaultValue="login" className="grid rounded-lg p-6 gap-4">

                <TabsContent value="login"  >
                    <PoliceStationLogin />
                </TabsContent>

                <TabsContent value="signUp" >
                    <PoliceStationRegister />
                </TabsContent>

                <TabsList className="flex flex-col gap-2 !h-fit max-w-2xl mx-auto text-xs" >
                    <TabsTrigger value="login" className=" !p-2 rounded-lg hover:bg-accent hover:text-[#4158D0] transition-all duration-200 ease-in-out"> Login </TabsTrigger>
                    <div className='bg-black h-[0.1rem] w-full rounded-lg' />
                    <TabsTrigger value="signUp" className=" !p-2 rounded-lg hover:bg-accent hover:text-[#4158D0] transition-all duration-200 ease-in-out text-blue-700"> Don't have a Password? <span className='text-xs underline' > Register</span> </TabsTrigger>
                </TabsList>

            </Tabs>
        </div>
    )
}

export default page