import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Since we're on Netlify without Python/TensorFlow,
    // we'll use mock data or call external ML service
    const mlApiUrl = process.env.ML_API_URL

    if (mlApiUrl) {
      try {
        const mlFormData = new FormData()
        mlFormData.append("file", file)

        const response = await fetch(`${mlApiUrl}/predict`, {
          method: "POST",
          body: mlFormData,
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            ...result,
            backend_type: "external_ml_service",
            deployment_platform: "netlify_frontend",
          })
        }
      } catch (error) {
        console.log("External ML service unavailable:", error)
      }
    }

    // Generate realistic mock prediction for demo
    const mockResult = {
      prediction: Math.random() > 0.4 ? "DSPD Detected" : "No DSPD Detected",
      mutation_probability: Number.parseFloat((0.2 + Math.random() * 0.6).toFixed(4)),
      non_mutation_probability: Number.parseFloat((0.2 + Math.random() * 0.6).toFixed(4)),
      confidence: Number.parseFloat((0.7 + Math.random() * 0.3).toFixed(4)),
      processing_time: Number.parseFloat((0.5 + Math.random() * 2).toFixed(2)),
      sequence_length: 13000,
      filename: file.name,
      processed_shape: [1, 52000],
      preprocessing_method: "Mock one-hot encoding",
      model_status: "demo_mode",
      backend_type: "netlify_mock",
      deployment_platform: "netlify",
      note: "Configure ML_API_URL for real predictions",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DSPD Prediction API",
    platform: "netlify",
    node_version: process.version,
    ml_backend: process.env.ML_API_URL ? "external" : "mock",
    python_available: false,
    tensorflow_available: false,
    timestamp: new Date().toISOString(),
  })
}
