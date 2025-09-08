import type { ProductTemplate, ProductType } from "./types"

export const FONT_OPTIONS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier New", value: "Courier New, monospace" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Impact", value: "Impact, sans-serif" },
  { name: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  { name: "Trebuchet MS", value: "Trebuchet MS, sans-serif" },
  { name: "Palatino", value: "Palatino, serif" },
]

export const PRODUCT_TEMPLATES: Record<ProductType, ProductTemplate> = {
  bottle: {
    designArea: { x: 100, y: 150, width: 100, height: 200 },
    images: {
      "#C22B34": "/red-water-bottle-mockup.png",
      "#FFFFFF": "/white-water-bottle-mockup.png",
      "#0A402F": "/green-water-bottle-mockup.png",
      "#C5A337": "/yellow-water-bottle-mockup.png",
      "#6F6F6F": "/gray-water-bottle-mockup.png",
    },
  },
  tshirt: {
    designArea: { x: 80, y: 120, width: 140, height: 160 },
    images: {
      "#C22B34": "/red-t-shirt-mockup.png",
      "#FFFFFF": "/white-t-shirt-mockup.png",
      "#0A402F": "/green-t-shirt-mockup.png",
      "#C5A337": "/yellow-t-shirt-mockup.png",
      "#6F6F6F": "/gray-t-shirt-mockup.png",
    },
  },
}

export const PRODUCT_COLORS: Record<ProductType, { name: string; value: string }[]> = {
  bottle: [
    { name: "Red", value: "#C22B34" },
    { name: "White", value: "#FFFFFF" },
    { name: "Green", value: "#0A402F" },
    { name: "Yellow", value: "#C5A337" },
    { name: "Gray", value: "#6F6F6F" },
  ],
  tshirt: [
    { name: "Red", value: "#C22B34" },
    { name: "White", value: "#FFFFFF" },
    { name: "Green", value: "#0A402F" },
    { name: "Yellow", value: "#C5A337" },
    { name: "Gray", value: "#6F6F6F" },
  ],
}
