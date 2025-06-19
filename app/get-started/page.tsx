"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Upload,
  FileText,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Dna,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"

interface AnalysisResults {
  prediction: string
  mutation_prob: number
  non_mutation_prob: number
  confidence: number
  processing_time: number
  sequence_length?: number | string
  filename?: string
  processed_shape?: number[]
  preprocessing_method?: string
  model_status?: string
  tensorflow_available?: boolean
  model_loaded?: boolean
}

export default function GetStartedPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<AnalysisResults>({
    prediction: "",
    mutation_prob: 0,
    non_mutation_prob: 0,
    confidence: 0,
    processing_time: 0,
  })
  const [error, setError] = useState<string | null>(null)
  const [fileType, setFileType] = useState<"raw" | "preprocessed" | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)

      // Determine file type
      const fileName = file.name.toLowerCase()
      if (fileName.endsWith(".npz")) {
        setFileType("preprocessed")
      } else {
        setFileType("raw")
      }

      // Validate file type
      const validExtensions = [".txt", ".fasta", ".fa", ".seq", ".npz"]
      const fileExtension = fileName.substring(fileName.lastIndexOf("."))

      if (!validExtensions.includes(fileExtension)) {
        setError("Please select a valid file (.txt, .fasta, .fa, .seq, .npz)")
        setSelectedFile(null)
        setFileType(null)
        return
      }

      // Validate file size (max 50MB for NPZ files, 10MB for others)
      const maxSize = fileName.endsWith(".npz") ? 50 * 1024 * 1024 : 10 * 1024 * 1024
      if (file.size > maxSize) {
        setError(`File size must be less than ${fileName.endsWith(".npz") ? "50MB" : "10MB"}`)
        setSelectedFile(null)
        setFileType(null)
        return
      }
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.")
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const response = await fetch("/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const result = await response.json()
      setResults(result)
      setShowResults(true)
    } catch (error) {
      console.error("Analysis error:", error)
      setError(error instanceof Error ? error.message : "Analysis failed. Please try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-400"
    if (confidence >= 0.6) return "text-yellow-400"
    return "text-red-400"
  }

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return "High Confidence"
    if (confidence >= 0.6) return "Medium Confidence"
    return "Low Confidence"
  }

  const getModelStatusColor = (status?: string) => {
    if (status?.includes("actual_rnn")) return "text-green-400"
    if (status?.includes("mock")) return "text-yellow-400"
    return "text-gray-400"
  }

  const getModelStatusLabel = (status?: string) => {
    if (status?.includes("actual_rnn")) return "✅ Real RNN Model"
    if (status?.includes("mock")) return "⚠️ Mock Results"
    return "❓ Unknown Status"
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #315a81 100%)",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/15 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Horizontal DNA Helix */}
      <div className="horizontal-dna-helix">
        <div className="horizontal-dna-container">
          <div className="horizontal-dna-strand strand-1"></div>
          <div className="horizontal-dna-strand strand-2"></div>
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className={`dna-base-pair base-pair-${i + 1}`} />
          ))}
          <div className="exon-label">EXON 11</div>
        </div>
      </div>

      {/* Floating Gene Mutations */}
      <div className="absolute top-20 left-8 animate-float z-10">
        <Badge variant="outline" className="bg-black/20 border-orange-400/30 text-orange-300 text-xs">
          CLOCK Gene rs1801260
        </Badge>
      </div>
      <div className="absolute top-3/5 right-1/4 animate-float delay-2000 z-10">
        <Badge variant="outline" className="bg-black/20 border-orange-400/30 text-orange-300 text-xs">
          CRY1 Exon c.1657+3A&gt;C
        </Badge>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:text-orange-400 hover:bg-white/10">
                Home
              </Button>
            </Link>
            <Link href="/get-started">
              <Button variant="ghost" className="text-white hover:text-orange-400 hover:bg-white/10">
                Get Started
              </Button>
            </Link>
            <Link href="/about-dspd">
              <Button variant="ghost" className="text-white hover:text-orange-400 hover:bg-white/10">
                About DSPD
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          {/* Left Container - Upload Form */}
          <Card className="flex-1 bg-black/20 border-white/5 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                  DSPDiagnosis
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300">RNN-Powered Genetic Analysis</h2>

                <div className="space-y-8 mt-12">
                  <div className="space-y-4">
                    <label className="block text-lg text-gray-300 font-medium">Upload Genetic Data:</label>

                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".txt,.fasta,.fa,.seq,.npz"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Upload className="mr-2 w-5 h-5" />
                        {selectedFile ? selectedFile.name : "Choose File"}
                      </Button>
                    </div>

                    {selectedFile && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center text-sm text-gray-400">
                          <FileText className="w-4 h-4 mr-2" />
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </div>

                        {fileType && (
                          <div className="flex items-center justify-center">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                fileType === "preprocessed"
                                  ? "bg-green-500/10 border-green-400/30 text-green-300"
                                  : "bg-blue-500/10 border-blue-400/30 text-blue-300"
                              }`}
                            >
                              {fileType === "preprocessed" ? (
                                <>
                                  <Database className="w-3 h-3 mr-1" />
                                  Preprocessed NPZ
                                </>
                              ) : (
                                <>
                                  <Dna className="w-3 h-3 mr-1" />
                                  Raw Sequence
                                </>
                              )}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}

                    {error && (
                      <div className="flex items-center justify-center text-sm text-red-400 mt-2">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {error}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isAnalyzing}
                    className="bg-gradient-to-r from-slate-700 to-blue-700 hover:from-slate-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {fileType === "preprocessed" ? "Processing NPZ..." : "Analyzing with RNN..."}
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 w-5 h-5" />
                        Analyze {fileType === "preprocessed" ? "Preprocessed Data" : "Sequence"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Container - Information */}
          <Card className="flex-1 bg-black/20 border-white/5 backdrop-blur-sm">
            <CardContent className="p-12">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
                  Real RNN Analysis
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300">Your Trained Model + Live Preprocessing</h2>

                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    Upload your <strong className="text-orange-300">trained .keras model file</strong> to get actual RNN
                    predictions instead of mock results.
                  </p>

                  <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                      <span className="font-semibold text-yellow-400">Model Setup Required</span>
                    </div>
                    <p className="text-sm">
                      To get real predictions, you need to upload your trained model file. Currently showing mock
                      results for UI testing.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                      <h4 className="text-blue-300 font-semibold mb-2">Raw Sequences</h4>
                      <p className="text-sm">FASTA, TXT, SEQ files</p>
                      <p className="text-xs text-gray-400 mt-1">One-hot encoding (13000 max)</p>
                    </div>
                    <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/10">
                      <h4 className="text-green-300 font-semibold mb-2">Preprocessed Data</h4>
                      <p className="text-sm">NPZ files (NumPy arrays)</p>
                      <p className="text-xs text-gray-400 mt-1">Direct model input</p>
                    </div>
                    <div className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/10">
                      <h4 className="text-orange-300 font-semibold mb-2">Model Architecture</h4>
                      <p className="text-sm">Your trained RNN</p>
                      <p className="text-xs text-gray-400 mt-1">Keras/TensorFlow format</p>
                    </div>
                    <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
                      <h4 className="text-purple-300 font-semibold mb-2">Processing</h4>
                      <p className="text-sm">Real-time analysis</p>
                      <p className="text-xs text-gray-400 mt-1">Exact preprocessing pipeline</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Enhanced Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-black/90 border-white/10 backdrop-blur-md text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent text-center">
              {results.prediction === "DSPD" ? "DSPD Detected" : "No DSPD Detected"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
            {/* Model Status */}
            {results.model_status && (
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className={`font-semibold ${getModelStatusColor(results.model_status)}`}>
                    {getModelStatusLabel(results.model_status)}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  TensorFlow: {results.tensorflow_available ? "✅ Available" : "❌ Not Available"} | Model:{" "}
                  {results.model_loaded ? "✅ Loaded" : "❌ Not Loaded"}
                </p>
              </div>
            )}

            {/* Processing Method Info */}
            {results.preprocessing_method && (
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  {results.preprocessing_method.includes("NPZ") ? (
                    <Database className="w-5 h-5 mr-2 text-green-400" />
                  ) : (
                    <Dna className="w-5 h-5 mr-2 text-blue-400" />
                  )}
                  <span className="font-semibold text-gray-300">Processing Method</span>
                </div>
                <p className="text-sm">{results.preprocessing_method}</p>
                {results.processed_shape && (
                  <p className="text-xs text-gray-400 mt-1">Shape: ({results.processed_shape.join(", ")})</p>
                )}
              </div>
            )}

            {/* Confidence and Processing Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className={`w-5 h-5 mr-2 ${getConfidenceColor(results.confidence)}`} />
                  <span className={`font-semibold ${getConfidenceColor(results.confidence)}`}>
                    {getConfidenceLabel(results.confidence)}
                  </span>
                </div>
                <p className="text-2xl font-bold">{(results.confidence * 100).toFixed(1)}%</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-5 h-5 mr-2 text-blue-400" />
                  <span className="font-semibold text-blue-400">Processing Time</span>
                </div>
                <p className="text-2xl font-bold">{results.processing_time?.toFixed(2)}s</p>
              </div>

              {results.sequence_length && (
                <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                  <div className="flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 mr-2 text-green-400" />
                    <span className="font-semibold text-green-400">Sequence Info</span>
                  </div>
                  <p className="text-2xl font-bold">
                    {typeof results.sequence_length === "number"
                      ? results.sequence_length.toLocaleString()
                      : results.sequence_length}
                  </p>
                </div>
              )}
            </div>

            {/* Probability Bars */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">DSPD Mutation Probability:</span>
                  <span className="text-orange-300 font-bold">{(results.mutation_prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-4 rounded-full transition-all duration-2000 ease-out"
                    style={{ width: `${results.mutation_prob * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Non-Mutation Probability:</span>
                  <span className="text-blue-300 font-bold">{(results.non_mutation_prob * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-2000 ease-out"
                    style={{ width: `${results.non_mutation_prob * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center pt-4 space-y-4">
              <p className="text-sm text-gray-400">
                {results.model_status?.includes("actual")
                  ? "Analysis powered by your trained RNN model"
                  : "Mock results - upload your model for real predictions"}
              </p>
              <Button
                onClick={() => setShowResults(false)}
                className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-500 hover:to-blue-500"
              >
                Close Results
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
