import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, MapPin, MapPinned } from "lucide-react"

const mapType = [
    {
        mapType: "roadmap",
    },
    {
        mapType: "satellite",
    },
    {
        mapType: "hybrid",
    },
    {
        mapType: "terrain",
    },
]

const MapChangeOption = ({ setMapType }) => {
    return (
        <DropdownMenu >
            <DropdownMenuTrigger asChild className="z-10 cursor-pointer"  >
                <div className=" text-base px-4 py-2 rounded-lg hover:bg-accent hover:text-[#4158D0] text-black flex items-center gap-1  duration-200 transition-all ease-in-out hover:scale-[0.9]" >
                    <MapPin className="size-4" />
                    <span className="hidden sm:flex items-center" >
                        Map Styles
                        <ChevronDown className="size-3.5" />
                    </span>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 p-4 bg-background text-foreground">
                <DropdownMenuLabel>Select Map Type</DropdownMenuLabel>
                <DropdownMenuSeparator className="!h-[1px] my-2" />
                <DropdownMenuGroup className="flex flex-col gap-4" >
                    {mapType.map((map, i) => (
                        <DropdownMenuItem key={i} onClick={() => setMapType(map.mapType)} >
                            <span className="capitalize !text-xs flex gap-1 items-center px-4 py-2 rounded-lg hover:bg-accent hover:text-[#4158D0]  transition-all duration-200 ease-in-out hover:scale-[0.95]" > <MapPinned className="size-3.5" /> {map.mapType} </span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default MapChangeOption