import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

// Helper function to upload with retry logic
async function uploadWithRetry(
  buffer: Buffer,
  fileName: string,
  retries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 [Upload] Attempt ${attempt}/${retries} for ${fileName}`)

      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'shopqm/products',
            resource_type: 'auto',
            timeout: 120000, // 2 minutes timeout
            transformation: [
              { width: 1200, height: 1200, crop: 'limit' },
              { quality: 'auto:good' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error(`❌ [Upload] Cloudinary error for ${fileName}:`, error)
              reject(error)
            } else {
              resolve(result)
            }
          }
        )

        uploadStream.end(buffer)
      })

      console.log(`✅ [Upload] Success on attempt ${attempt}: ${fileName}`)
      return result
    } catch (error: any) {
      console.error(`❌ [Upload] Attempt ${attempt} failed for ${fileName}:`, error?.message || error)

      // Check if error is retryable (ECONNRESET, ETIMEDOUT, etc)
      const isRetryable =
        error?.code === 'ECONNRESET' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ENOTFOUND' ||
        error?.code === 'EPIPE' ||
        error?.message?.includes('socket hang up') ||
        error?.message?.includes('timeout')

      if (!isRetryable || attempt === retries) {
        throw error
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`⏳ [Upload] Retrying in ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📥 [Upload API] Request received')

    const formData = await request.formData()
    const files = formData.getAll('files') as File[]

    if (!files || files.length === 0) {
      console.log('❌ [Upload API] No files provided')
      return NextResponse.json(
        { error: 'Không có file nào được gửi lên' },
        { status: 400 }
      )
    }

    console.log(`📤 [Upload API] Uploading ${files.length} files to Cloudinary...`)

    const uploadedUrls: string[] = []
    const errors: string[] = []

    for (const file of files) {
      console.log(`📸 [Upload API] Processing: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`)

      // Validate file type
      if (!file.type.startsWith('image/')) {
        const msg = `File ${file.name} không phải là ảnh`
        console.log(`⚠️  [Upload API] ${msg}`)
        errors.push(msg)
        continue
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        const msg = `File ${file.name} quá lớn (${(file.size / 1024 / 1024).toFixed(2)}MB > 10MB)`
        console.log(`⚠️  [Upload API] ${msg}`)
        errors.push(msg)
        continue
      }

      try {
        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary with retry
        const result = await uploadWithRetry(buffer, file.name)

        // Get optimized Cloudinary URL
        uploadedUrls.push(result.secure_url)
        console.log(`✅ [Upload API] Uploaded: ${file.name} → ${result.secure_url}`)
      } catch (uploadError: any) {
        const errorMsg = uploadError?.message || 'Unknown error'
        const msg = `Không thể upload ${file.name}: ${errorMsg}`
        console.error(`❌ [Upload API] ${msg}`, uploadError)
        errors.push(msg)
        continue
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'No valid images uploaded' },
        { status: 400 }
      )
    }

    console.log(`🎉 Successfully uploaded ${uploadedUrls.length} images to Cloudinary`)

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      count: uploadedUrls.length,
      errors: errors.length > 0 ? errors : undefined  // Include errors if any
    })
  } catch (error) {
    console.error('❌ Upload error:', error)
    return NextResponse.json(
      {
        error: 'Failed to upload images',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
