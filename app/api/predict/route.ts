import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Read file content
    const fileContent = await file.text()

    // Option 1: Call Python backend with your RNN model
    const pythonResponse = await fetch("http://localhost:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sequence: fileContent,
        filename: file.name,
      }),
    })

    if (!pythonResponse.ok) {
      throw new Error("Python backend error")
    }

    const result = await pythonResponse.json()

    return NextResponse.json({
      prediction: result.prediction,
      mutation_prob: result.mutation_probability,
      non_mutation_prob: result.non_mutation_probability,
      confidence: result.confidence,
      processing_time: result.processing_time,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process genetic sequence" }, { status: 500 })
  }
}
