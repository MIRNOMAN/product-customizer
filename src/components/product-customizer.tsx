"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

import type { DesignElement, ProductType } from "./customizer/types"
import { FONT_OPTIONS, PRODUCT_TEMPLATES, PRODUCT_COLORS } from "./customizer/constants"
import { ProductPreview } from "./customizer/ProductPreview"
import { ProductTypeSelect } from "./customizer/ProductTypeSelect"
import { ProductColorPicker } from "./customizer/ProductColorPicker"
import { UploadLogo } from "./customizer/UploadLogo"
import { AddText } from "./customizer/AddText"
import { EditElementPanel } from "./customizer/EditElementPanel"

export default function ProductCustomizer() {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>("bottle")
  const [selectedColor, setSelectedColor] = useState(PRODUCT_COLORS.bottle[0].value)
  const [designElements, setDesignElements] = useState<DesignElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [resizeCorner, setResizeCorner] = useState<null | "nw" | "ne" | "sw" | "se">(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentTemplate = PRODUCT_TEMPLATES[selectedProduct]
  const currentImage = currentTemplate.images[selectedColor] || Object.values(currentTemplate.images)[0]

  const addTextElement = useCallback(() => {
    if (!textInput.trim()) return

    const newElement: DesignElement = {
      id: Date.now().toString(),
      type: "text",
      content: textInput,
      x: currentTemplate.designArea.x + currentTemplate.designArea.width / 2 - 50,
      y: currentTemplate.designArea.y + currentTemplate.designArea.height / 2,
      width: 100,
      height: 30,
      rotation: 0,
      fontSize: 16,
      color: "#000000",
      fontFamily: "Arial, sans-serif", // Added default font family
    }

    setDesignElements((prev) => [...prev, newElement])
    setTextInput("")
    setSelectedElement(newElement.id)
  }, [textInput, currentTemplate])

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const newElement: DesignElement = {
          id: Date.now().toString(),
          type: "logo",
          content: e.target?.result as string,
          x: currentTemplate.designArea.x + currentTemplate.designArea.width / 2 - 40,
          y: currentTemplate.designArea.y + currentTemplate.designArea.height / 2 - 40,
          width: 80,
          height: 80,
          rotation: 0,
        }

        setDesignElements((prev) => [...prev, newElement])
        setSelectedElement(newElement.id)
      }
      reader.readAsDataURL(file)
    },
    [currentTemplate],
  )

  const updateElement = useCallback((id: string, updates: Partial<DesignElement>) => {
    setDesignElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
  }, [])

  const deleteElement = useCallback((id: string) => {
    setDesignElements((prev) => prev.filter((el) => el.id !== id))
    setSelectedElement(null)
  }, [])

  const downloadDesign = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `custom-${selectedProduct}-design.png`
    link.href = canvas.toDataURL()
    link.click()
  }, [selectedProduct])

  const resetDesign = useCallback(() => {
    setDesignElements([])
    setSelectedElement(null)
  }, [])

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Helper: detect if a point is inside a corner handle of the selected element
      const HANDLE_SIZE = 10
      const hitHandle = (el: DesignElement | undefined) => {
        if (!el) return null as null | "nw" | "ne" | "sw" | "se"
        const corners = {
          nw: { cx: el.x, cy: el.y },
          ne: { cx: el.x + el.width, cy: el.y },
          sw: { cx: el.x, cy: el.y + el.height },
          se: { cx: el.x + el.width, cy: el.y + el.height },
        }
        for (const key of Object.keys(corners) as Array<"nw" | "ne" | "sw" | "se">) {
          const { cx, cy } = corners[key]
          if (x >= cx - HANDLE_SIZE && x <= cx + HANDLE_SIZE && y >= cy - HANDLE_SIZE && y <= cy + HANDLE_SIZE) {
            return key
          }
        }
        return null
      }

      const currentSelected = designElements.find((el) => el.id === selectedElement)
      const handle = hitHandle(currentSelected)
      if (currentSelected && handle) {
        // Begin resizing on handle drag
        setResizeCorner(handle)
        setIsResizing(true)
        return
      }

      // Otherwise, check if click is on any element to start dragging
      const clickedElement = designElements.find(
        (el) => x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height,
      )

      if (clickedElement) {
        setSelectedElement(clickedElement.id)
        setIsDragging(true)
        setDragOffset({
          x: x - clickedElement.x,
          y: y - clickedElement.y,
        })
      } else {
        setSelectedElement(null)
      }
    },
    [designElements, selectedElement],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!selectedElement) return

      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      if (isResizing && resizeCorner) {
        const el = designElements.find((d) => d.id === selectedElement)
        if (!el) return
        let newX = el.x
        let newY = el.y
        let newW = el.width
        let newH = el.height

        const minSize = 20

        if (resizeCorner === "nw") {
          newW = Math.max(minSize, el.width + (el.x - x))
          newH = Math.max(minSize, el.height + (el.y - y))
          newX = el.x + (el.width - newW)
          newY = el.y + (el.height - newH)
        } else if (resizeCorner === "ne") {
          newW = Math.max(minSize, x - el.x)
          newH = Math.max(minSize, el.height + (el.y - y))
          newY = el.y + (el.height - newH)
        } else if (resizeCorner === "sw") {
          newW = Math.max(minSize, el.width + (el.x - x))
          newH = Math.max(minSize, y - el.y)
          newX = el.x + (el.width - newW)
        } else if (resizeCorner === "se") {
          newW = Math.max(minSize, x - el.x)
          newH = Math.max(minSize, y - el.y)
        }

        const updates: Partial<DesignElement> = { x: newX, y: newY, width: newW, height: newH }
        // For text, also scale font size roughly based on height
        if (el.type === "text") {
          const baseH = el.height || 30
          const baseFont = el.fontSize || 16
          const scale = newH / baseH
          updates.fontSize = Math.max(8, Math.round(baseFont * scale))
        }
        updateElement(selectedElement, updates)
        return
      }

      if (isDragging) {
        updateElement(selectedElement, {
          x: x - dragOffset.x,
          y: y - dragOffset.y,
        })
      }
    },
    [isDragging, isResizing, resizeCorner, selectedElement, dragOffset, updateElement, designElements],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
    setResizeCorner(null)
  }, [])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw product background
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw design elements
      designElements.forEach((element) => {
        ctx.save()
        ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
        ctx.rotate((element.rotation * Math.PI) / 180)

        if (element.type === "text") {
          ctx.font = `${element.fontSize || 16}px ${element.fontFamily || "Arial, sans-serif"}`
          ctx.fillStyle = element.color || "#000000"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(element.content, 0, 0)

          // Draw selection border for text elements
          if (selectedElement === element.id) {
            ctx.strokeStyle = "#0891b2"
            ctx.lineWidth = 2
            ctx.setLineDash([5, 5])
            ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)
            // Draw resize handles at corners (axis-aligned)
            ctx.setLineDash([])
            const hs = 6
            const corners = [
              { x: -element.width / 2, y: -element.height / 2 },
              { x: element.width / 2, y: -element.height / 2 },
              { x: -element.width / 2, y: element.height / 2 },
              { x: element.width / 2, y: element.height / 2 },
            ]
            ctx.fillStyle = "#0891b2"
            corners.forEach((c) => ctx.fillRect(c.x - hs / 2, c.y - hs / 2, hs, hs))
          }
        } else if (element.type === "logo") {
          const logoImg = new Image()
          logoImg.crossOrigin = "anonymous"
          logoImg.src = element.content

          // Draw logo immediately if already loaded, otherwise wait for load
          if (logoImg.complete) {
            ctx.drawImage(logoImg, -element.width / 2, -element.height / 2, element.width, element.height)

            // Draw selection border for logo elements
            if (selectedElement === element.id) {
              ctx.strokeStyle = "#0891b2"
              ctx.lineWidth = 2
              ctx.setLineDash([5, 5])
              ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)
              // Draw resize handles
              ctx.setLineDash([])
              const hs = 6
              const corners = [
                { x: -element.width / 2, y: -element.height / 2 },
                { x: element.width / 2, y: -element.height / 2 },
                { x: -element.width / 2, y: element.height / 2 },
                { x: element.width / 2, y: element.height / 2 },
              ]
              ctx.fillStyle = "#0891b2"
              corners.forEach((c) => ctx.fillRect(c.x - hs / 2, c.y - hs / 2, hs, hs))
            }
          } else {
            logoImg.onload = () => {
              // Redraw the entire canvas when logo loads
              ctx.save()
              ctx.translate(element.x + element.width / 2, element.y + element.height / 2)
              ctx.rotate((element.rotation * Math.PI) / 180)
              ctx.drawImage(logoImg, -element.width / 2, -element.height / 2, element.width, element.height)

              // Draw selection border for logo elements
              if (selectedElement === element.id) {
                ctx.strokeStyle = "#0891b2"
                ctx.lineWidth = 2
                ctx.setLineDash([5, 5])
                ctx.strokeRect(-element.width / 2, -element.height / 2, element.width, element.height)
              }
              ctx.restore()
            }
          }
        }

        ctx.restore()
      })
    }
    img.src = currentImage
  }, [designElements, selectedElement, currentImage])

  const selectedElementData = designElements.find((el) => el.id === selectedElement)

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">{"Customize Your Branded Products"}</h1>
        <p className="text-muted-foreground text-lg">{"Create personalized merchandise with your logo and text"}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Product Preview */}
        <div className="lg:col-span-2">
          <ProductPreview
            canvasRef={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDownload={downloadDesign}
          />

          {selectedElementData && selectedElement && (
            <EditElementPanel
              element={selectedElementData}
              elementId={selectedElement}
              onUpdate={updateElement}
              onDelete={deleteElement}
              fontOptions={FONT_OPTIONS}
            />
          )}
        </div>

        {/* Customization Panel */}
        <div className="space-y-6">
          <ProductTypeSelect
            selectedProduct={selectedProduct}
            onChange={(value: ProductType) => {
              setSelectedProduct(value)
              const availableColors = PRODUCT_COLORS[value]
              const firstWithImage = availableColors.find((c) => Boolean(PRODUCT_TEMPLATES[value].images[c.value]))
              setSelectedColor(firstWithImage ? firstWithImage.value : availableColors[0].value)
            }}
            productKeys={Object.keys(PRODUCT_TEMPLATES)}
          />

          <ProductColorPicker
            colors={PRODUCT_COLORS[selectedProduct]}
            selectedColor={selectedColor}
            onSelect={setSelectedColor}
          />

          <UploadLogo fileInputRef={fileInputRef} onChange={handleFileUpload} />

          <AddText textInput={textInput} onTextChange={setTextInput} onAddText={addTextElement} />

          <Button onClick={resetDesign} variant="outline" className="w-full bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Design
          </Button>
        </div>
      </div>
    </div>
  )
}
