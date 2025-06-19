"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Upload, FileText, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function GetStartedPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState({
    prediction: "",
    mutation_prob: 0,
    non_mutation_prob: 0,
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.")
      return
    }

    setIsAnalyzing(true)

    // Simulate API call with mock data
    setTimeout(() => {
      const mockResults = {
        prediction: Math.random() > 0.5 ? "DSPD" : "No DSPD",
        mutation_prob: Math.random() * 0.4 + 0.3, // 30-70%
        non_mutation_prob: Math.random() * 0.4 + 0.3, // 30-70%
      }

      setResults(mockResults)
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
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
                <h2 className="text-xl md:text-2xl text-gray-300">CrIMR Genetic Analysis System</h2>

                <div className="space-y-8 mt-12">
                  <div className="space-y-4">
                    <label className="block text-lg text-gray-300 font-medium">Upload Genetic Sequence File:</label>

                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".txt,.fasta,.fa,.seq"
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
                      <div className="flex items-center justify-center text-sm text-gray-400 mt-2">
                        <FileText className="w-4 h-4 mr-2" />
                        {(selectedFile.size / 1024).toFixed(1)} KB
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="mr-2 w-5 h-5" />
                        Analyze Sequence
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
                  Advanced Genetic Detection
                </h1>
                <h2 className="text-xl md:text-2xl text-gray-300">Precision Medicine for Sleep Disorders</h2>

                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    Our <strong className="text-orange-300">CrIMR</strong> (Circadian Rhythm Integrated Mutation
                    Recognition) system uses cutting-edge LSTM neural networks to analyze genetic sequences for DSPD
                    markers.
                  </p>

                  <p>
                    Upload your genetic data file to receive a comprehensive analysis of circadian rhythm gene variants
                    and their potential impact on sleep phase timing.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                    <div className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/10">
                      <h4 className="text-orange-300 font-semibold mb-2">Supported Formats</h4>
                      <p className="text-sm">FASTA, TXT, SEQ files</p>
                    </div>
                    <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/10">
                      <h4 className="text-blue-300 font-semibold mb-2">Analysis Time</h4>
                      <p className="text-sm">~2-3 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="bg-black/90 border-white/10 backdrop-blur-md text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent text-center">
              {results.prediction === "DSPD" ? "DSPD Detected" : "No DSPD Detected"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 mt-6">
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

            <div className="text-center pt-4">
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
