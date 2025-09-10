import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import InputComp from './InputComp'
import { Button } from "@/components/ui/button"

const GetApp = () => {
    return (
        <Dialog>
            <DialogTrigger asChild >
                <Button className='btn flex p-4 rounded-xl text-white' >
                    Get App
                </Button>
            </DialogTrigger>
            <DialogContent className=" rounded-2xl  p-6">
                <InputComp />

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">By submitting, you will receive updates about our beta program.</p>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default GetApp