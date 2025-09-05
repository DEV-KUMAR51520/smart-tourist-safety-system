"use client"
import { useEffect, useRef, Suspense, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Shield,
  Link2,
  Satellite,
  Cpu,
  AlertTriangle,
  Monitor,
  Smartphone,
  Database,
  Globe,
  ExternalLink,
  Zap,
  Users,
  MapPin,
  Menu,
} from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Sphere, OrbitControls } from "@react-three/drei"
import * as THREE from "three"
function Earth() {
  const meshRef = useRef(null)
  const earthTexture = useMemo(() => {
    const canvas = document.createElement("canvas")
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext("2d")
    ctx.fillStyle = "#1e40af"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = "#22c55e"
    ctx.beginPath()
    ctx.ellipse(150, 150, 80, 60, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(200, 300, 40, 80, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(450, 200, 60, 100, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(650, 150, 120, 70, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(750, 350, 50, 30, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = "#16a34a"
    for (let i = 0; i < 50; i++) {
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 10 + 2, 0, Math.PI * 2)
      ctx.fill()
    }
    return new THREE.CanvasTexture(canvas)
  }, [])
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2
    }
  })
  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.7}
        metalness={0.1}
        emissive="#0a0a0a"
        emissiveIntensity={0.1}
      />
      <Sphere args={[1.01, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#ffffff"
          roughness={1.0}
          metalness={0.0}
          transparent
          opacity={0.15}
          alphaMap={earthTexture}
        />
      </Sphere>
    </Sphere>
  )
}
function EarthScene() {
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
      <ambientLight intensity={0.3} color="#4a90e2" />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#1e40af" />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}
export default function SmartTouristSafetyPage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up")
        }
      })
    }, observerOptions)
    const featureCards = document.querySelectorAll(".feature-card")
    featureCards.forEach((card) => observer.observe(card))
    const steps = document.querySelectorAll(".step-card")
    steps.forEach((step) => observer.observe(step))
    return () => observer.disconnect()
  }, [])
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">TrailShield</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={scrollToFeatures}
                className="hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Features
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="hover:cursor-pointer text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                How It Works
              </button>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Pricing
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors font-medium">
                Support
              </a>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="hover:cursor-pointer text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
              <Button size="sm" className="hover:cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground">
                <ExternalLink className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="hover:cursor-pointer md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </nav>
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_24px,rgba(8,145,178,0.15)_25px,rgba(8,145,178,0.15)_26px,transparent_27px),linear-gradient(rgba(8,145,178,0.15)_24px,transparent_25px,transparent_26px,rgba(8,145,178,0.15)_27px)] bg-[size:50px_50px] animate-pulse"></div>
            <div className="absolute top-1/4 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent animate-pulse"></div>
            <div className="absolute top-2/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent animate-pulse animation-delay-1000"></div>
            <div className="absolute left-1/4 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse animation-delay-500"></div>
            <div className="absolute right-1/3 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-accent/30 to-transparent animate-pulse animation-delay-1500"></div>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent transform rotate-12 animate-pulse animation-delay-2000"></div>
              <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent transform -rotate-12 animate-pulse animation-delay-3000"></div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] opacity-20">
              <EarthScene />
            </div>
          </div>
          <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary/60 rounded-full animate-ping"></div>
          <div className="absolute top-3/4 right-1/4 w-2 h-2 bg-accent/80 rounded-full animate-ping animation-delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-primary/40 rounded-full animate-ping animation-delay-2000"></div>
          <div className="absolute top-1/3 left-1/2 w-1.5 h-1.5 bg-primary/70 rounded-full animate-ping animation-delay-3000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent/60 rounded-full animate-ping animation-delay-4000"></div>
          <div className="absolute top-2/3 left-2/3 w-1.5 h-1.5 bg-primary/50 rounded-full animate-ping animation-delay-2500"></div>
          <div className="absolute top-1/5 right-1/5 w-1 h-1 bg-accent animate-pulse animation-delay-1500"></div>
          <div className="absolute bottom-1/3 right-2/3 w-2 h-2 bg-primary/30 rounded-full animate-ping animation-delay-3500"></div>
          <div className="absolute top-4/5 left-1/5 w-1.5 h-1.5 bg-accent/40 rounded-full animate-ping animation-delay-4500"></div>
          <div className="absolute top-1/6 left-1/6 opacity-20">
            <Shield className="w-6 h-6 text-primary animate-pulse animation-delay-1000" />
          </div>
          <div className="absolute bottom-1/6 right-1/6 opacity-20">
            <Satellite className="w-5 h-5 text-accent animate-pulse animation-delay-2000" />
          </div>
          <div className="absolute top-1/3 right-1/5 opacity-15">
            <Cpu className="w-4 h-4 text-primary animate-pulse animation-delay-3000" />
          </div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <div className="mb-2 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-primary/30 mt-8">
              <Zap className="w-4 h-4" />
              Next-Generation Safety Technology
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-balance leading-tight">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TrailShield</span>
            <br />
            <span className="text-foreground">Smart Tourist Safety & Monitoring</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty max-w-3xl mx-auto">
            Your safety, amplified by AI, secured by Blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12 animate-fade-in-up animation-delay-600">
            <Button
              size="lg"
              className="hover:cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground w-72 py-7 text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg border-0"
            >
              <ExternalLink className="w-6 h-6 mr-3" />
              Access Dashboard
            </Button>
            <Button
              onClick={scrollToFeatures}
              variant="outline"
              size="lg"
              className="hover:cursor-pointer border-2 border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground w-72 py-7 text-xl font-bold rounded-xl transition-all duration-300 hover:scale-105 bg-background/50 backdrop-blur-sm hover:shadow-xl"
            >
              <Globe className="w-6 h-6 mr-3" />
              Explore Features
            </Button>
          </div>
          <div className="animate-fade-in-up animation-delay-800 mb-8">
            <button
              onClick={scrollToFeatures}
              className="flex flex-col items-center gap-2 mx-auto text-muted-foreground hover:text-primary transition-colors group"
            >
              <span className="text-sm md:text-base font-medium">Discover More</span>
              <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center">
                <div className="w-1 h-3 bg-current rounded-full mt-2 animate-bounce"></div>
              </div>
            </button>
          </div>
        </div>
      </section>
      <section ref={featuresRef} className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Zap className="w-4 h-4" />
              Advanced Technology
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">Revolutionary Safety Features</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Cutting-edge technology designed to keep tourists safe and connected worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "AI-Powered Anomaly Detection",
                description:
                  "Advanced machine learning algorithms continuously monitor patterns and detect potential safety threats in real-time.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: <Link2 className="w-8 h-8" />,
                title: "Blockchain Digital ID",
                description:
                  "Secure, immutable digital identity verification ensuring your personal data remains protected and accessible.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: <Satellite className="w-8 h-8" />,
                title: "Real-time Geo-fencing",
                description:
                  "Smart location boundaries that automatically alert emergency contacts when you enter or leave designated safe zones.",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: <Monitor className="w-8 h-8" />,
                title: "IoT Device Integration",
                description:
                  "Seamlessly connects with wearable devices and smart sensors for comprehensive safety monitoring.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: <AlertTriangle className="w-8 h-8" />,
                title: "Emergency Response System",
                description:
                  "Instant alert system that connects you with local emergency services and trusted contacts within seconds.",
                gradient: "from-red-500 to-pink-500",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Multi-platform Dashboard",
                description:
                  "Unified control center accessible across all devices, providing real-time insights and safety analytics.",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Community Safety Network",
                description:
                  "Connect with fellow travelers and local safety ambassadors for enhanced protection and local insights.",
                gradient: "from-teal-500 to-blue-500",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Predictive Risk Assessment",
                description:
                  "AI analyzes historical data and current conditions to predict and prevent potential safety risks.",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Incident Reporting",
                description:
                  "One-tap incident reporting with automatic location sharing and emergency service coordination.",
                gradient: "from-cyan-500 to-teal-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="feature-card opacity-0 translate-y-8 transition-all duration-700 hover:shadow-xl hover:scale-105 border-border/50 bg-card/80 backdrop-blur-sm group relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} text-white rounded-xl mb-4 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-balance">{feature.title}</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section ref={howItWorksRef} className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-balance">How It Works</h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              A seamless three-layer architecture ensuring comprehensive safety coverage
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2"></div>
            <div className="hidden md:block absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary to-accent transform -translate-y-1/2"></div>
            {[
              {
                icon: <Smartphone className="w-12 h-12" />,
                title: "Tourist Interface",
                subtitle: "Mobile App & IoT Devices",
                description:
                  "User-friendly mobile application integrated with wearable IoT devices for seamless safety monitoring and emergency communication.",
              },
              {
                icon: <Database className="w-12 h-12" />,
                title: "Data Backbone",
                subtitle: "Backend API & AI Service",
                description:
                  "Robust cloud infrastructure powered by AI algorithms that process real-time data and provide intelligent safety insights.",
              },
              {
                icon: <Shield className="w-12 h-12" />,
                title: "Response & Records",
                subtitle: "Web Dashboard & Blockchain Layer",
                description:
                  "Comprehensive dashboard for emergency responders with immutable blockchain records ensuring data integrity and transparency.",
              },
            ].map((step, index) => (
              <Card
                key={index}
                className="step-card opacity-0 translate-y-8 transition-all duration-700 text-center relative z-10 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full mb-6">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-balance">{step.title}</h3>
                  <p className="text-accent font-semibold mb-4">{step.subtitle}</p>
                  <p className="text-muted-foreground text-pretty">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-background to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">Ready to Transform Tourist Safety?</h2>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Join the future of intelligent travel safety monitoring and incident response.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="hover:cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Access Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="hover:cursor-pointer border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg font-semibold bg-transparent"
            >
              Learn More
            </Button>
          </div>
          <div className="border-t border-border/20 pt-12">
            <h3 className="text-2xl font-bold mb-4 text-balance">Download Our Mobile App</h3>
            <p className="text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Get instant access to TrailShield's safety features on your mobile device. Available for iOS and Android.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <Button
                variant="secondary"
                size="default"
                className="hover:cursor-pointer bg-black hover:bg-black/90 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3 min-w-[180px]"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.81.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300">Download from</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Button>
              <Button
                variant="secondary"
                size="default"
                className="hover:cursor-pointer bg-black hover:bg-black/90 text-white py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3 min-w-[180px]"
              >
                <svg className="w-7 h-7 fill-current text-green-400" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0001.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1333 1.0989L4.8442 5.4467a.4161.4161 0 00-.5972-.1518.416.416 0 00-.1518.5972L6.0927 9.321C3.7385 10.7446 2.25 13.0469 2.25 15.6426h19.5c0-2.5957-1.4885-4.898-3.8428-6.3216z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-300">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-300 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">TrailShield</h3>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionary AI-powered tourist safety platform secured by blockchain technology. Keeping travelers
                safe worldwide with intelligent monitoring and instant response systems.
              </p>
              <div className="flex items-center gap-3 bg-gray-800 rounded-full px-4 py-2 w-fit">
                <img src="/matic.png" className="w-6 h-6 bg-white rounded-full" alt="Polygon" />
                <span className="text-sm font-semibold">Powered by Polygon</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Mobile App
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    IoT Integration
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Emergency Contacts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Safety Guidelines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              <p className="text-gray-400 text-sm">© 2024 TrailShield. All rights reserved.</p>
              <div className="flex gap-4 text-sm">
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
