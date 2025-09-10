"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, CreditCard, Camera } from "lucide-react"

interface FormData {
  name: string
  mobile: string
  gender: string
  aadharNumber: string
  photo: string | null
}

interface DataPreviewProps {
  data: FormData | null
}

export function DataPreview({ data }: DataPreviewProps) {
  if (!data) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No registration data available yet.</p>
        <p className="text-sm text-muted-foreground mt-2">Complete the registration form to see your data here.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Personal Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{data.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <Badge variant="secondary" className="capitalize">
                  {data.gender}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Contact Information</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{data.mobile}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Identity Verification</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Aadhar Card Number</p>
                <p className="font-medium font-mono">
                  {data.aadharNumber.replace(/(\d{4})(\d{4})(\d{4})/, "$1 $2 $3")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Photo</h3>
            </div>
            {data.photo ? (
              <div className="flex justify-center">
                <img
                  src={data.photo || "/placeholder.svg"}
                  alt="User photo"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No photo captured</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Registration Summary</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Personal information completed</p>
            <p>• Contact details verified</p>
            <p>• Identity document provided</p>
            <p>• {data.photo ? "Photo captured successfully" : "Photo pending"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
