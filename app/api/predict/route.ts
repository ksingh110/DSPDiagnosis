import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate realistic mock prediction for UI demo
    const dspd_prob = 0.2 + Math.random() * 0.6 // 20-80%
    const non_dspd_prob = 1.0 - dspd_prob
    const confidence = Math.max(dspd_prob, non_dspd_prob)

    const mockResult = {
      prediction: dspd_prob > 0.5 ? "DSPD Detected" : "No DSPD Detected",
      mutation_probability: Number.parseFloat(dspd_prob.toFixed(4)),
      non_mutation_probability: Number.parseFloat(non_dspd_prob.toFixed(4)),
      confidence: Number.parseFloat(confidence.toFixed(4)),
      processing_time: Number.parseFloat((1.5 + Math.random() * 2).toFixed(2)),
      sequence_length: Math.floor(Math.random() * 5000) + 8000, // 8000-13000
      filename: file.name,
      processed_shape: [1, Math.floor(Math.random() * 20000) + 40000], // Realistic shape
      preprocessing_method: "One-hot encoding (simulated)",
      model_status: "UI Demo Mode",
      backend_type: "mock_ui_only",
      timestamp: new Date().toISOString(),
    }

    return NextResponse.json(mockResult)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "DSPD Prediction API (UI Demo)",
    mode: "frontend_only",
    python_backend: false,
    ml_model: false,
    purpose: "UI demonstration and testing",
    timestamp: new Date().toISOString(),
  })
}
