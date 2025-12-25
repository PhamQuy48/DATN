'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Kiểm tra số lượng ảnh
    if (images.length + files.length > maxImages) {
      toast.error(`Chỉ được tải lên tối đa ${maxImages} ảnh!`)
      return
    }

    setIsUploading(true)

    try {
      // Validate files trước
      const validFiles: File[] = []
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Kiểm tra kích thước file (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`File ${file.name} quá lớn. Tối đa 5MB!`)
          continue
        }

        // Kiểm tra định dạng file
        if (!file.type.startsWith('image/')) {
          toast.error(`File ${file.name} không phải là ảnh!`)
          continue
        }

        validFiles.push(file)
      }

      if (validFiles.length === 0) {
        toast.error('Không có file hợp lệ để tải lên!')
        return
      }

      // Upload lên server
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      // Cập nhật danh sách ảnh với URLs từ server
      onImagesChange([...images, ...data.urls])
      toast.success(`Đã tải lên ${data.count} ảnh!`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Có lỗi xảy ra khi tải ảnh!')
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
    toast.success('Đã xóa ảnh!')
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const files = e.dataTransfer.files
    if (!files || files.length === 0) return

    // Tạo event giả để sử dụng handleFileSelect
    const input = fileInputRef.current
    if (input) {
      const dataTransfer = new DataTransfer()
      for (let i = 0; i < files.length; i++) {
        dataTransfer.items.add(files[i])
      }
      input.files = dataTransfer.files

      // Trigger change event
      const event = new Event('change', { bubbles: true })
      input.dispatchEvent(event)
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Hình ảnh sản phẩm
        <span className="text-gray-500 ml-2">(Tối đa {maxImages} ảnh)</span>
      </label>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-500 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading || images.length >= maxImages}
        />

        <div className="flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="text-sm text-gray-600">Đang tải ảnh lên...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Kéo thả ảnh vào đây hoặc nhấn để chọn
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, WEBP (tối đa 5MB mỗi ảnh)
                </p>
              </div>
              {images.length >= maxImages && (
                <p className="text-xs text-red-600">
                  Đã đạt giới hạn số lượng ảnh
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
            >
              <Image
                src={image}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage(index)
                  }}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  title="Xóa ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
                  Ảnh chính
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Helper text */}
      <p className="text-xs text-gray-500">
        💡 Ảnh đầu tiên sẽ là ảnh chính của sản phẩm. Kéo thả để sắp xếp lại.
      </p>
    </div>
  )
}
