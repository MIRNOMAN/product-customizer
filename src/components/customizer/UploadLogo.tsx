import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import type React from "react"

type Props = {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export function UploadLogo({ fileInputRef, onChange }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Upload Logo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Choose Image
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Tip: Click and drag logos on the canvas to reposition them
        </p>
      </CardContent>
    </Card>
  )
}
