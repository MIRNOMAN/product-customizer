/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Move } from "lucide-react"
import type { DesignElement } from "./types"

type Props = {
  element: DesignElement
  elementId: string
  onUpdate: (id: string, updates: Partial<DesignElement>) => void
  onDelete: (id: string) => void
  fontOptions: { name: string; value: string }[]
}

export function EditElementPanel({ element, elementId, onUpdate, onDelete, fontOptions }: Props) {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Move className="h-4 w-4" />
          Edit Selected Element
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>X Position</Label>
            <Slider value={[element.x]} onValueChange={([value] : any) => onUpdate(elementId, { x: value })} max={300} step={1} />
          </div>
          <div>
            <Label>Y Position</Label>
            <Slider value={[element.y]} onValueChange={([value] : any) => onUpdate(elementId, { y: value })} max={400} step={1} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Width</Label>
            <Slider
              value={[element.width]}
              onValueChange={([value] : any) => onUpdate(elementId, { width: value })}
              min={20}
              max={200}
              step={1}
            />
          </div>
          <div>
            <Label>Height</Label>
            <Slider
              value={[element.height]}
              onValueChange={([value] : any) => onUpdate(elementId, { height: value })}
              min={20}
              max={200}
              step={1}
            />
          </div>
        </div>

        <div>
          <Label>Rotation</Label>
          <Slider
            value={[element.rotation]}
            onValueChange={([value] : any) => onUpdate(elementId, { rotation: value })}
            min={-180}
            max={180}
            step={1}
          />
        </div>

        {element.type === "text" && (
          <>
            <div>
              <Label>Font Family</Label>
              <Select
                value={element.fontFamily || "Arial, sans-serif"}
                onValueChange={(value : any)  => onUpdate(elementId, { fontFamily: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fontOptions.map((font) => (
                    <SelectItem key={font.value} value={font.value}>
                      <span style={{ fontFamily: font.value }}>{font.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Font Size</Label>
              <Slider
                value={[element.fontSize || 16]}
                onValueChange={([value] : any) => onUpdate(elementId, { fontSize: value })}
                min={8}
                max={48}
                step={1}
              />
            </div>
            <div>
              <Label htmlFor="text-color">Text Color</Label>
              <Input
                id="text-color"
                type="color"
                value={element.color || "#000000"}
                onChange={(e) => onUpdate(elementId, { color: e.target.value })}
              />
            </div>
          </>
        )}

        <Button onClick={() => onDelete(elementId)} variant="destructive" className="w-full">
          Delete Element
        </Button>
      </CardContent>
    </Card>
  )
}
