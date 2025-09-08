import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Color = { name: string; value: string }

type Props = {
  title?: string
  colors: Color[]
  selectedColor: string
  onSelect: (value: string) => void
}

export function ProductColorPicker({ title = "Product Color", colors, selectedColor, onSelect }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.value}
              className={`w-12 h-12 rounded-full border-4 transition-all ${
                selectedColor === color.value ? "border-primary scale-110" : "border-border hover:border-primary/50"
              }`}
              style={{ backgroundColor: color.value }}
              onClick={() => onSelect(color.value)}
              title={color.name}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
