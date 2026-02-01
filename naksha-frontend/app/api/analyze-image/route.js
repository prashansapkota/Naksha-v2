import { connectMongoDB } from "@/lib/mongodb";
import AnalysisResult from "@/models/analysisResult";
import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";

export async function POST(req) {
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      'http://localhost:8000';

    // Get user session
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const image = formData.get('file');

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Send to Python backend
    const pythonFormData = new FormData();
    pythonFormData.append('file', image);

    const response = await fetch(`${apiBase}/predict`, {
      method: 'POST',
      body: pythonFormData,
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const result = await response.json();

    const predictedClass = result.predicted_class;
    const confidence = result.probabilities?.[predictedClass];
    const predictions = [
      {
        building: predictedClass,
        confidence: typeof confidence === 'number' ? confidence : 0
      }
    ];

    // Store result in MongoDB
    await connectMongoDB();
    
    const analysisResult = await AnalysisResult.create({
      userId: session.user.id,
      predictions,
      navigation: null,
      // You might want to store the image path if you're saving images
      imagePath: `uploads/${image.name}` 
    });

    return NextResponse.json({
      predictions,
      navigation: null,
      raw: result,
      resultId: analysisResult._id
    });

  } catch (error) {
    console.error('Error processing image:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
} 
