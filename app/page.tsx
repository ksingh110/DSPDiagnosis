"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Activity, Brain, Dna } from "lucide-react"
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
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-orange-200 to-orange-400 bg-clip-text text-transparent">
              DSPDiagnosis
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Revolutionary genetic-based solution for detecting Delayed Sleep Phase Disorder
            </p>

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

        {/* Features Grid */}
        <div className="py-20">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-black/20 border-white/5 backdrop-blur-sm hover:bg-black/30 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <Brain className="w-16 h-16 text-orange-400 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold text-white mb-4">AI-Powered Analysis</h3>
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
      </main>
    </div>
  )
}
