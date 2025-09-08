export interface DesignElement {
  id: string
  type: "logo" | "text"
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  fontSize?: number
  color?: string
  fontFamily?: string
}

export type ProductType = "bottle" | "tshirt"

export type ProductTemplate = {
  designArea: { x: number; y: number; width: number; height: number }
  images: Record<string, string>
}
