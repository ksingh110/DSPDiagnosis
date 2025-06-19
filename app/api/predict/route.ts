import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Create FormData for Python API
    const pythonFormData = new FormData()
    pythonFormData.append("file", file)

    // Try local Flask server first (for real predictions), then fall back to Vercel Python
    const endpoints = [
      "http://localhost:5000/predict", // Local Flask server with your actual model
      `${request.nextUrl.origin}/api/python-predict`, // Vercel Python (mock)
    ]

    let result = null
    let usedEndpoint = ""

    for (const endpoint of endpoints) {
      try {
        const pythonResponse = await fetch(endpoint, {
          method: "POST",
          body: pythonFormData,
        })

        if (pythonResponse.ok) {
          const contentType = pythonResponse.headers.get("content-type")
          if (contentType?.includes("application/json")) {
            result = await pythonResponse.json()
            usedEndpoint = endpoint
            break
          }
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} not available:`, error)
        continue
      }
    }

    // If no endpoint worked, return mock data
    if (!result) {
      const fallback = mockResult(file.name)
      return NextResponse.json({
        ...fallback,
        _warning:
          "No backend available - serving mock data. Run 'python scripts/local_rnn_backend.py' for real predictions.",
        _endpoints_tried: endpoints,
      })
    }

    return NextResponse.json({
      prediction: result.prediction,
      mutation_prob: result.mutation_probability,
      non_mutation_prob: result.non_mutation_probability,
      confidence: result.confidence,
      processing_time: result.processing_time,
      sequence_length: result.sequence_length,
      filename: result.filename,
      processed_shape: result.processed_shape,
      preprocessing_method: result.preprocessing_method,
      backend_type: result.backend_type,
      model_status: result.model_status,
      raw_prediction: result.raw_prediction,
      _used_endpoint: usedEndpoint,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process genetic sequence" }, { status: 500 })
  }
}

function mockResult(filename: string) {
  const dspd_prob = 0.3 + Math.random() * 0.4
  const non_dspd_prob = 1.0 - dspd_prob

  return {
    prediction: dspd_prob > 0.5 ? "DSPD" : "No DSPD",
    mutation_prob: dspd_prob,
    non_mutation_prob: non_dspd_prob,
    confidence: Math.max(dspd_prob, non_dspd_prob),
    processing_time: Math.random() * 2 + 1,
    sequence_length: 13000,
    filename: filename,
    processed_shape: [1, 52000],
    preprocessing_method: "Mock one-hot encoding",
    backend_type: "mock",
    model_status: "mock_prediction (no_backend_available)",
  }
}
