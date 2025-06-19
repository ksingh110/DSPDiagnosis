"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Activity, Brain, Dna, Sparkles, Zap, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-900 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 25%, #16213e 50%, #0f3460 75%, #315a81 100%)",
      }}
    >
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500/8 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Small Floating Genetic Elements */}
      <div className="absolute top-20 left-8 animate-float z-10">
        <Badge variant="outline" className="bg-black/20 border-orange-400/30 text-orange-300 text-xs font-mono">
          CRY1
        </Badge>
      </div>
      <div className="absolute bottom-32 left-12 animate-float delay-1000 z-10">
        <Badge variant="outline" className="bg-black/20 border-blue-400/30 text-blue-300 text-xs font-mono">
          CRY2
        </Badge>
      </div>
      <div className="absolute top-3/4 right-1/4 animate-float delay-2000 z-10">
        <Badge variant="outline" className="bg-black/20 border-purple-400/30 text-purple-300 text-xs font-mono">
          CLOCK
        </Badge>
      </div>
      <div className="absolute top-1/3 right-8 animate-float delay-3000 z-10">
        <Badge variant="outline" className="bg-black/20 border-green-400/30 text-green-300 text-xs font-mono">
          PER3
        </Badge>
      </div>
      <div className="absolute bottom-1/4 left-1/3 animate-float delay-4000 z-10">
        <Badge variant="outline" className="bg-black/20 border-pink-400/30 text-pink-300 text-xs font-mono">
          BMAL1
        </Badge>
      </div>

      {/* Small DNA Icons */}
      <div className="absolute top-16 left-16 animate-pulse opacity-20 z-10">
        <Dna className="w-8 h-8 text-orange-400" />
      </div>
      <div className="absolute bottom-16 right-32 animate-pulse delay-1000 opacity-20 z-10">
        <Dna className="w-6 h-6 text-blue-400" />
      </div>
      <div className="absolute top-1/2 right-16 animate-pulse delay-2000 opacity-15 z-10">
        <Dna className="w-7 h-7 text-purple-400" />
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
      <main className="container mx-auto px-4 relative z-10">
        {/* Hero Section */}
        <div className="min-h-screen flex flex-col justify-center items-center text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent leading-tight">
              DSPDiagnosis
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionizing Delayed Sleep Phase Disorder detection through advanced genetic-based solutions
            </p>

            {/* Key Stats/Highlights */}
            <div className="flex flex-wrap justify-center gap-6 mb-12">
              <div className="bg-black/20 backdrop-blur-sm border border-orange-400/20 rounded-lg px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-300 font-semibold">ML-Powered</span>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-blue-400/20 rounded-lg px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Dna className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-300 font-semibold">Genetic Analysis</span>
                </div>
              </div>
              <div className="bg-black/20 backdrop-blur-sm border border-purple-400/20 rounded-lg px-6 py-3">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Real-time Results</span>
                </div>
              </div>
            </div>

            <Link href="/get-started">
              <Button
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 group hover:scale-105 transform"
              >
                Get Started
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Introduction Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Future of Sleep Disorder Diagnosis</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Traditional diagnostic methods fail to acknowledge the genetic component of DSPD. DSPDiagnosis bridges
                this gap with cutting-edge machine learning technology.
              </p>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-black/10 p-6 rounded-lg border border-white/5">
                  <h4 className="text-orange-300 font-semibold mb-3">Current Problem</h4>
                  <p className="text-gray-300 text-sm">
                    DLMO and PSG tests ignore genetic factors, limiting personalized treatment approaches for the 15%
                    affected by DSPD.
                  </p>
                </div>
                <div className="bg-black/10 p-6 rounded-lg border border-white/5">
                  <h4 className="text-blue-300 font-semibold mb-3">Our Solution</h4>
                  <p className="text-gray-300 text-sm">
                    First genetic-based DSPD detection using advanced LSTM neural networks and circadian gene analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy Comparison Section */}
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
                  <h2 className="text-3xl md:text-4xl font-bold text-white">Superior Accuracy</h2>
                </div>
                <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                  DSPDiagnosis outperforms traditional diagnostic methods by{" "}
                  <strong className="text-green-400">6-34%</strong> across all major testing approaches
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">vs DLMO</div>
                    <div className="text-3xl font-bold text-green-400 mb-2">+34%</div>
                    <p className="text-sm text-gray-400">More accurate than Dim Light Melatonin Onset testing</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">vs Sleep Actigraphy</div>
                    <div className="text-3xl font-bold text-green-400 mb-2">+28%</div>
                    <p className="text-sm text-gray-400">Superior to traditional sleep pattern monitoring</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">vs Bright Light</div>
                    <div className="text-3xl font-bold text-green-400 mb-2">+22%</div>
                    <p className="text-sm text-gray-400">More precise than bright light therapy assessment</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-bold text-red-400 mb-2">vs Melatonin</div>
                    <div className="text-3xl font-bold text-green-400 mb-2">+16%</div>
                    <p className="text-sm text-gray-400">Enhanced accuracy over melatonin timing tests</p>
                  </CardContent>
                </Card>
              </div>

              <div className="text-center mt-12">
                <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20 max-w-3xl mx-auto">
                  <h4 className="text-green-300 font-semibold text-xl mb-3">Proven Performance</h4>
                  <p className="text-gray-300">
                    Our genetic-based approach consistently outperforms traditional methods by analyzing the root cause
                    - your circadian gene mutations - rather than just symptoms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-32 relative z-10">
          {/* Horizontal DNA Helix for Features Section */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <div className="absolute top-1/2 left-10% w-80% h-32 transform -translate-y-1/2">
              <div className="relative w-full h-full">
                <div className="absolute w-full h-2 top-1/3 bg-gradient-to-r from-transparent via-orange-400/40 to-transparent rounded-full animate-pulse"></div>
                <div className="absolute w-full h-2 top-2/3 bg-gradient-to-r from-transparent via-orange-400/40 to-transparent rounded-full animate-pulse delay-1000"></div>
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute w-0.5 h-8 bg-gradient-to-b from-orange-400/30 via-orange-400/60 to-orange-400/30 top-1/2 transform -translate-y-1/2 animate-pulse"
                    style={{
                      left: `${8 + i * 7}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Advanced Genetic Analysis</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Cutting-edge technology meets personalized medicine for precise DSPD detection
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 text-orange-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-4">ML-Powered Analysis</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Advanced LSTM model CrIMR for precise genetic analysis and personalized insights
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <Dna className="w-16 h-16 text-blue-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-4">Genetic Focus</h3>
                  <p className="text-gray-300 leading-relaxed">
                    First solution to address the genetic basis of sleep phase disorders
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <Activity className="w-16 h-16 text-purple-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-semibold text-white mb-4">Personalized Treatment</h3>
                  <p className="text-gray-300 leading-relaxed">
                    Tailored diagnosis and treatment recommendations based on your genetics
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
