import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Palette } from "lucide-react"
import type React from "react"

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  onMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void
  onMouseUp: () => void
  onMouseLeave: () => void
  onDownload: () => void
}

export function ProductPreview({ canvasRef, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onDownload }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Product Preview
        </CardTitle>
        <Button onClick={onDownload} className="bg-primary hover:bg-primary/90">
          <Download className="h-4 w-4 mr-2" />
          Download Design
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative bg-card rounded-lg p-8 flex justify-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={400}
            className="border border-border rounded-lg shadow-lg cursor-crosshair"
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          />
        </div>
      </CardContent>
    </Card>
  )
}
