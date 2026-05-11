import { useEffect, useRef, useState } from "react"

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 }
    this.vel = { x: 0, y: 0 }
    this.acc = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }
    this.closeEnoughTarget = 100
    this.maxSpeed = 1.0
    this.maxForce = 0.1
    this.particleSize = 10
    this.isKilled = false
    this.startColor = { r: 0, g: 0, b: 0 }
    this.targetColor = { r: 0, g: 0, b: 0 }
    this.colorWeight = 0
    this.colorBlendRate = 0.01
  }

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) +
      Math.pow(this.pos.y - this.target.y, 2)
    )

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y)
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx, drawAsPoints) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    }

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2)
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2
      const mag = (width + height) / 2
      const centerX = width / 2
      const centerY = height / 2
      const exitX = centerX + Math.cos(angle) * mag
      const exitY = centerY + Math.sin(angle) * mag

      this.target.x = exitX
      this.target.y = exitY

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.isKilled = true
    }
  }
}

export default function ParticleTextEffect() {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const frameCountRef = useRef(0)
  const wordIndexRef = useRef(0)
  const animationCompleteRef = useRef(false)
  const loopDelayCounterRef = useRef(0)
  const isWaitingForLoopRef = useRef(false)

  const words = [
    "SALES & CONSULTAT",
    "DIGITAL MARKETING",
    "E-COMMERCE",
    "WEB ENTWICKLUNG",
    "UI UX DESIGN",
    "AI & AUTOMATION"
  ]

  const pixelSteps = 6
  const drawAsPoints = true

  const nextWord = (word, canvas, isFirstWord = false) => {
    try {
      const offscreenCanvas = document.createElement("canvas")
      offscreenCanvas.width = canvas.width
      offscreenCanvas.height = canvas.height
      const offscreenCtx = offscreenCanvas.getContext("2d")

      if (!offscreenCtx) return

      offscreenCtx.fillStyle = "white"
      offscreenCtx.font = "bold 120px Space Grotesk, Arial, sans-serif"
      offscreenCtx.textAlign = "center"
      offscreenCtx.textBaseline = "middle"
      offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2.5)

      const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data

      const newColor = { r: 220, g: 38, b: 38 }
      const particles = particlesRef.current
      const targetCoords = []

      for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
        const alpha = pixels[i + 3]
        if (alpha > 0) {
          const x = (i / 4) % canvas.width
          const y = Math.floor(i / 4 / canvas.width)
          targetCoords.push({ x, y })
        }
      }

      for (let i = targetCoords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = targetCoords[i]
        targetCoords[i] = targetCoords[j]
        targetCoords[j] = temp
      }

      const neededParticles = targetCoords.length

      if (isFirstWord) {
        particles.length = 0
        for (let i = 0; i < neededParticles; i++) {
          const particle = new Particle()
          const targetX = targetCoords[i].x
          const targetY = targetCoords[i].y
          const angleToTarget = Math.atan2(targetY - canvas.height / 2.5, targetX - canvas.width / 2)
          const startDistance = (canvas.width + canvas.height) / 2
          particle.pos.x = targetX - Math.cos(angleToTarget) * startDistance
          particle.pos.y = targetY - Math.sin(angleToTarget) * startDistance
          particle.maxSpeed = Math.random() * 12 + 10
          particle.maxForce = particle.maxSpeed * 0.08
          particle.particleSize = Math.random() * 6 + 6
          particle.colorBlendRate = Math.random() * 0.04 + 0.01
          particle.startColor = { r: 0, g: 0, b: 0 }
          particle.targetColor = newColor
          particle.colorWeight = 0
          particle.target.x = targetX
          particle.target.y = targetY
          particles.push(particle)
        }
      } else {
        for (let i = 0; i < Math.max(particles.length, neededParticles); i++) {
          if (i < neededParticles) {
            let particle
            if (i < particles.length) {
              particle = particles[i]
              particle.isKilled = false
            } else {
              particle = new Particle()
              const sourceParticle = particles[Math.floor(Math.random() * particles.length)]
              particle.pos.x = sourceParticle?.pos.x || canvas.width / 2
              particle.pos.y = sourceParticle?.pos.y || canvas.height / 3
              particle.maxSpeed = Math.random() * 6 + 4
              particle.maxForce = particle.maxSpeed * 0.05
              particle.particleSize = Math.random() * 6 + 6
              particle.colorBlendRate = Math.random() * 0.0275 + 0.0025
              particles.push(particle)
            }

            particle.startColor = {
              r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
              g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
              b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
            }
            particle.targetColor = newColor
            particle.colorWeight = 0
            particle.target.x = targetCoords[i].x
            particle.target.y = targetCoords[i].y
          } else if (i < particles.length) {
            const particle = particles[i]
            const randomTarget = targetCoords[Math.floor(Math.random() * targetCoords.length)]
            particle.target.x = randomTarget.x + (Math.random() - 0.5) * 20
            particle.target.y = randomTarget.y + (Math.random() - 0.5) * 20
            particle.isKilled = false
            particle.startColor = {
              r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
              g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
              b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
            }
            particle.targetColor = newColor
            particle.colorWeight = 0
          }
        }
      }
    } catch (error) {
      console.error("Error in nextWord:", error)
    }
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles = particlesRef.current

    ctx.fillStyle = "rgba(0, 0, 0, 0.15)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      particle.move()
      particle.draw(ctx, drawAsPoints)

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1)
        }
      }
    }

    frameCountRef.current++

    if (isWaitingForLoopRef.current) {
      loopDelayCounterRef.current++
      if (loopDelayCounterRef.current >= 120 && particles.length === 0) {
        isWaitingForLoopRef.current = false
        animationCompleteRef.current = false
        loopDelayCounterRef.current = 0
        frameCountRef.current = 0
        wordIndexRef.current = 0
        nextWord(words[0], canvas, true)
      }
    } else if (!animationCompleteRef.current && frameCountRef.current % 360 === 0 && frameCountRef.current > 0) {
      const nextIndex = wordIndexRef.current + 1

      if (nextIndex < words.length) {
        wordIndexRef.current = nextIndex
        nextWord(words[wordIndexRef.current], canvas, false)
      } else if (nextIndex === words.length) {
        particles.forEach(particle => {
          try {
            particle.kill(canvas.width, canvas.height)
          } catch (e) {}
        })
        isWaitingForLoopRef.current = true
        loopDelayCounterRef.current = 0
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      try {
        const container = canvas.parentElement
        if (container) {
          canvas.width = Math.max(container.clientWidth, 800)
          canvas.height = Math.max(container.clientHeight, 200)
        }
      } catch (e) {
        console.error("Error resizing canvas:", e)
      }
    }

    resizeCanvas()

    // Delay initial word generation
    const initTimer = setTimeout(() => {
      try {
        nextWord(words[0], canvas, true)
        animate()
      } catch (e) {
        console.error("Error initializing particles:", e)
      }
    }, 100)

    const handleResize = () => {
      resizeCanvas()
      try {
        nextWord(words[wordIndexRef.current], canvas)
      } catch (e) {
        console.error("Error on resize:", e)
      }
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (initTimer) {
        clearTimeout(initTimer)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="w-full h-full absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "transparent" }}
      />
    </div>
  )
}
