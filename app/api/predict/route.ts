import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // Get the uploaded file
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // For Netlify deployment, we'll use external API or mock data
    // since TensorFlow can't run in Netlify Functions easily

    // Try to call external ML service (like Google Cloud Run)
    const externalApiUrl = process.env.ML_API_URL || "http://localhost:5000"

    try {
      const mlFormData = new FormData()
      mlFormData.append("file", file)

      const response = await fetch(`${externalApiUrl}/predict`, {
        method: "POST",
        body: mlFormData,
      })

      if (!response.ok) {
        throw new Error("External ML API failed")
      }

      const result = await response.json()
      return NextResponse.json(result)
    } catch (mlError) {
      console.log("ML API not available, using mock data:", mlError)

      // Fallback to mock prediction for demo purposes
      const mockResult = {
        prediction: Math.random() > 0.5 ? "DSPD" : "No DSPD",
        mutation_probability: 0.3 + Math.random() * 0.4,
        non_mutation_probability: 0.3 + Math.random() * 0.4,
        confidence: 0.7 + Math.random() * 0.3,
        processing_time: 0.5 + Math.random() * 2,
        sequence_length: "Unknown",
        filename: file.name,
        processed_shape: [1, 52000],
        preprocessing_method: "Mock processing for demo",
        backend_type: "netlify_mock",
        model_status: "mock_prediction (ML service unavailable)",
        tensorflow_available: false,
        model_loaded: false,
      }

      return NextResponse.json(mockResult)
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    message: "DSPD Prediction API is running",
    backend_type: "netlify_nextjs",
    ml_service_url: process.env.ML_API_URL || "not_configured",
  })
}
