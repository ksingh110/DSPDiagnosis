import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // For production deployment, call external ML service
    const mlApiUrl = process.env.ML_API_URL

    if (mlApiUrl) {
      try {
        const mlFormData = new FormData()
        mlFormData.append("file", file)

        const response = await fetch(`${mlApiUrl}/predict`, {
          method: "POST",
          body: mlFormData,
          headers: {
            // Don't set Content-Type, let browser set it for FormData
          },
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            ...result,
            backend_type: "external_ml_service",
            service_url: mlApiUrl,
          })
        }
      } catch (error) {
        console.log("External ML service failed:", error)
      }
    }

    // Fallback to realistic mock data for demo
    const mockResult = generateMockPrediction(file.name)
    return NextResponse.json({
      ...mockResult,
      _note: "Using mock data - configure ML_API_URL environment variable for real predictions",
      backend_type: "mock_for_demo",
    })
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

function generateMockPrediction(filename: string) {
  // Generate realistic-looking mock data
  const dspd_prob = 0.2 + Math.random() * 0.6 // 20-80%
  const non_dspd_prob = 1.0 - dspd_prob
  const confidence = Math.max(dspd_prob, non_dspd_prob)

  return {
    prediction: dspd_prob > 0.5 ? "DSPD Detected" : "No DSPD Detected",
    mutation_probability: Number.parseFloat(dspd_prob.toFixed(4)),
    non_mutation_probability: Number.parseFloat(non_dspd_prob.toFixed(4)),
    confidence: Number.parseFloat(confidence.toFixed(4)),
    processing_time: Number.parseFloat((0.5 + Math.random() * 2).toFixed(2)),
    sequence_length: 13000,
    filename: filename,
    processed_shape: [1, 52000],
    preprocessing_method: "One-hot encoding simulation",
    model_status: "mock_model_v1.0",
    timestamp: new Date().toISOString(),
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DSPD Prediction API",
    version: "1.0.0",
    backend_type: process.env.ML_API_URL ? "external_service" : "mock_demo",
    ml_service_configured: !!process.env.ML_API_URL,
    timestamp: new Date().toISOString(),
  })
}
