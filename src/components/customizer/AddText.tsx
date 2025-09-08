import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Type } from "lucide-react"

type Props = {
  textInput: string
  onTextChange: (value: string) => void
  onAddText: () => void
}

export function AddText({ textInput, onTextChange, onAddText }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Type className="h-4 w-4" />
          Add Text
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="text-input">Text Content</Label>
          <Input
            id="text-input"
            value={textInput}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Enter your text..."
          />
        </div>
        <Button onClick={onAddText} className="w-full">
          Add Text
        </Button>
      </CardContent>
    </Card>
  )
}
