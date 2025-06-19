"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Moon, Sun, Clock, Dna, ArrowLeft, BarChart3, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function AboutDSPDPage() {
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
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400/15 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse delay-2000" />
      </div>

      {/* Floating Gene Mutations */}
      <div className="absolute top-20 left-8 animate-float z-10">
        <Badge variant="outline" className="bg-black/20 border-orange-400/30 text-orange-300 text-xs font-mono">
          CRY1 Exon 11
        </Badge>
      </div>
      <div className="absolute bottom-32 left-12 animate-float delay-1000 z-10">
        <Badge variant="outline" className="bg-black/20 border-blue-400/30 text-blue-300 text-xs font-mono">
          CRY2 Variant
        </Badge>
      </div>
      <div className="absolute top-3/4 right-1/4 animate-float delay-2000 z-10">
        <Badge variant="outline" className="bg-black/20 border-purple-400/30 text-purple-300 text-xs font-mono">
          CLOCK Gene
        </Badge>
      </div>

      {/* Circadian Clock Elements */}
      <div className="absolute top-16 left-16 animate-pulse opacity-30 z-10">
        <Clock className="w-12 h-12 text-orange-400" />
      </div>
      <div className="absolute bottom-16 right-32 animate-pulse delay-1000 opacity-30 z-10">
        <Clock className="w-10 h-10 text-blue-400" />
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
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-16">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="flex items-center justify-center mb-6">
              <Moon className="w-12 h-12 text-blue-400 mr-4" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                What is DSPD?
              </h1>
              <Sun className="w-12 h-12 text-orange-400 ml-4" />
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Understanding Delayed Sleep Phase Disorder and its genetic foundations
            </p>
          </div>
        </div>

        {/* Main Information Card */}
        <Card className="bg-black/20 border-white/5 backdrop-blur-sm max-w-5xl mx-auto mb-16">
          <CardContent className="p-12">
            <div className="space-y-8 text-gray-300 leading-relaxed">
              <p className="text-xl">
                <strong className="text-white">Delayed Sleep Phase Disorder (DSPD)</strong> is one of the most common
                genetically-caused sleep disorders where individuals inherit a late sleep/wake cycle, sleeping at least
                1-2 hours later than recommended.
              </p>

              <div className="grid md:grid-cols-2 gap-8 my-12">
                <div className="bg-orange-500/5 p-8 rounded-lg border border-orange-500/10">
                  <div className="flex items-center mb-4">
                    <Users className="w-8 h-8 text-orange-300 mr-3" />
                    <h4 className="text-orange-300 font-semibold text-xl">Prevalence</h4>
                  </div>
                  <p className="text-lg">
                    Present in <strong className="text-white">15%</strong> of adolescents and adults worldwide
                  </p>
                </div>
                <div className="bg-blue-500/5 p-8 rounded-lg border border-blue-500/10">
                  <div className="flex items-center mb-4">
                    <Dna className="w-8 h-8 text-blue-300 mr-3" />
                    <h4 className="text-blue-300 font-semibold text-xl">Genetic Component</h4>
                  </div>
                  <p className="text-lg">
                    Genetic factors cause <strong className="text-white">40-50%</strong> of all cases
                  </p>
                </div>
              </div>

              <div className="bg-purple-500/5 p-8 rounded-lg border border-purple-500/10">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-8 h-8 text-purple-300 mr-3" />
                  <h4 className="text-purple-300 font-semibold text-xl">Current Diagnostic Limitations</h4>
                </div>
                <p className="text-lg">
                  Traditional diagnostic methods, such as DLMO's (Dim Light Melatonin Onset) and PSG's
                  (Polysomnography), fail to acknowledge the genetic aspect, restricting personalized diagnosis and
                  treatment approaches.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Genes Section */}
        <Card className="bg-black/20 border-white/5 backdrop-blur-sm max-w-5xl mx-auto mb-16">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
              Key Circadian Genes
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-orange-500/10 p-6 rounded-lg border border-orange-500/20">
                <h4 className="text-orange-300 font-bold text-lg mb-2">CRY1</h4>
                <p className="text-gray-300 text-sm">Cryptochrome 1 - Key regulator of circadian rhythm</p>
              </div>
              <div className="bg-blue-500/10 p-6 rounded-lg border border-blue-500/20">
                <h4 className="text-blue-300 font-bold text-lg mb-2">CRY2</h4>
                <p className="text-gray-300 text-sm">Cryptochrome 2 - Works with CRY1 in clock regulation</p>
              </div>
              <div className="bg-purple-500/10 p-6 rounded-lg border border-purple-500/20">
                <h4 className="text-purple-300 font-bold text-lg mb-2">CLOCK</h4>
                <p className="text-gray-300 text-sm">Core circadian clock transcription factor</p>
              </div>
              <div className="bg-green-500/10 p-6 rounded-lg border border-green-500/20">
                <h4 className="text-green-300 font-bold text-lg mb-2">PER3</h4>
                <p className="text-gray-300 text-sm">Period 3 - Influences sleep timing preferences</p>
              </div>
              <div className="bg-pink-500/10 p-6 rounded-lg border border-pink-500/20">
                <h4 className="text-pink-300 font-bold text-lg mb-2">BMAL1</h4>
                <p className="text-gray-300 text-sm">Brain and muscle ARNT-like 1 - Master clock gene</p>
              </div>
              <div className="bg-yellow-500/10 p-6 rounded-lg border border-yellow-500/20">
                <h4 className="text-yellow-300 font-bold text-lg mb-2">PER1/2</h4>
                <p className="text-gray-300 text-sm">Period genes - Core components of molecular clock</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solution Section */}
        <Card className="bg-black/20 border-white/5 backdrop-blur-sm max-w-5xl mx-auto">
          <CardContent className="p-12 text-center">
            <div className="flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-orange-400 mr-3" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-orange-200 bg-clip-text text-transparent">
                The DSPDiagnosis Solution
              </h2>
            </div>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              <strong className="text-orange-300">DSPDiagnosis</strong>, powered by the novel LSTM model CrIMR
              (Circadian Rhythm Integrated Mutation Recognition), is the world's first solution addressing the genetic
              basis of sleep phase disorders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/get-started">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 font-semibold"
                >
                  Try It Today
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 py-3">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
