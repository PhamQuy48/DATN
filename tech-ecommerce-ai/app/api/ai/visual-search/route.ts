import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/db/prisma'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    const imageBuffer = await image.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    const imageUrl = 'data:image/jpeg;base64,' + base64Image

    const products = await prisma.product.findMany({
      include: { category: true },
      take: 50,
    })

    const productsInfo = products.map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category.name,
      price: p.salePrice || p.price,
    }))

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyze this image and identify what product the user is looking for.'
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            },
            {
              type: 'text',
              text: 'From this product list, find the 5 most similar products: ' + JSON.stringify(productsInfo)
            }
          ],
        },
      ],
      max_tokens: 500,
    })

    const aiResponse = completion.choices[0].message.content
    
    return NextResponse.json({
      analysis: aiResponse,
      products: products.slice(0, 5),
    })
  } catch (error) {
    console.error('Visual search error:', error)
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    )
  }
}
