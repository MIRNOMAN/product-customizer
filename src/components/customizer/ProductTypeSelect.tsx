import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ProductType } from "./types"

type Props = {
  selectedProduct: ProductType
  onChange: (value: ProductType) => void
  productKeys: string[]
}

export function ProductTypeSelect({ selectedProduct, onChange, productKeys }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedProduct} onValueChange={(value: ProductType) => onChange(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {productKeys.map((key) => (
              <SelectItem key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
