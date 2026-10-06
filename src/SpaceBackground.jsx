import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

class SpaceScene extends Phaser.Scene {
  create() {
    const { width: W, height: H } = this.scale
    // generated textures (no external assets)
    const g = this.make.graphics({ add: false })
    g.fillStyle(0xffffff, 1).fillCircle(2, 2, 2); g.generateTexture('star', 4, 4); g.clear()
    g.fillStyle(0x00e5ff, 1).fillCircle(4, 4, 4); g.generateTexture('node', 8, 8); g.destroy()

    // Vector satellites drift through the starfield with visible solar arrays.
    const shipArt = this.make.graphics({ add: false })
    // Solar panels
    shipArt.fillStyle(0x516b91, 1).fillRect(7, 20, 12, 2)
    shipArt.fillStyle(0x3d8bd0, 0.95).fillRect(0, 8, 15, 26)
    shipArt.fillStyle(0x8fcfff, 0.8).lineStyle(1, 0x9fe4ff, 0.65)
    shipArt.strokeRect(0.5, 8.5, 14, 25)
    shipArt.lineBetween(5, 9, 5, 33); shipArt.lineBetween(10, 9, 10, 33)
    shipArt.lineBetween(1, 16, 14, 16); shipArt.lineBetween(1, 25, 14, 25)
    shipArt.fillStyle(0x516b91, 1).fillRect(37, 20, 12, 2)
    shipArt.fillStyle(0x3d8bd0, 0.95).fillRect(41, 8, 15, 26)
    shipArt.lineStyle(1, 0x9fe4ff, 0.65).strokeRect(41.5, 8.5, 14, 25)
    shipArt.lineBetween(46, 9, 46, 33); shipArt.lineBetween(51, 9, 51, 33)
    shipArt.lineBetween(42, 16, 55, 16); shipArt.lineBetween(42, 25, 55, 25)
    // Gold instrument bus with a small antenna dish
    shipArt.fillStyle(0xc49a51, 1).fillRect(20, 15, 16, 12)
    shipArt.fillStyle(0xffd987, 1).fillRect(22, 17, 12, 8)
    shipArt.fillStyle(0xeff7ff, 1).fillCircle(28, 21, 2)
    shipArt.lineStyle(1, 0xdcecff, 0.9).lineBetween(28, 15, 28, 7)
    shipArt.lineBetween(28, 7, 24, 4)
    shipArt.fillStyle(0xdcecff, 0.9).fillCircle(23, 4, 2)
    shipArt.generateTexture('satellite', 56, 40)
    shipArt.destroy()

    this.layers = [0.15, 0.4, 0.9].map((speed, i) => {
      const stars = []
      for (let n = 0; n < 50 + i * 20; n++) {
        const s = this.add.image(Phaser.Math.Between(0, W), Phaser.Math.Between(0, H), 'star')
          .setScale(0.3 + i * 0.35).setAlpha(0.25 + i * 0.25)
        s.speed = speed; stars.push(s)
        this.tweens.add({ targets: s, alpha: s.alpha * 0.3, duration: Phaser.Math.Between(1500, 4000), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 2000) })
      }
      return stars
    }).flat()

    this.ships = [
      { x: -80, y: H * 0.19, scale: 0.62, alpha: 0.58, duration: 34000 },
      { x: W * 0.72, y: H * 0.77, scale: 0.42, alpha: 0.4, duration: 47000 },
      { x: W * 0.34, y: H * 0.31, scale: 0.3, alpha: 0.28, duration: 56000 },
    ].map(ship => {
      const image = this.add.image(ship.x, ship.y, 'satellite').setScale(ship.scale).setAlpha(ship.alpha)
        .setRotation(Phaser.Math.DegToRad(Phaser.Math.Between(-12, 12)))
      this.tweens.add({
        targets: image, x: W + 90, duration: ship.duration,
        ease: 'Linear', repeat: -1,
        onRepeat: () => { image.y = Phaser.Math.Between(H * 0.12, H * 0.88) },
      })
      return image
    })

    // mission-control grid + orbit rings
    this.fx = this.add.graphics()
    this.cx = W / 2; this.cy = H * 0.46
    this.sats = [
      { r: 0.30, color: 0x00e5ff, a: 0, v: 0.0006 },
      { r: 0.42, color: 0x39ff9c, a: 2, v: -0.0004 },
      { r: 0.55, color: 0x00e5ff, a: 4, v: 0.0003 },
    ].map(s => ({ ...s, img: this.add.image(0, 0, 'node').setTint(s.color) }))
    this.scale.on('resize', (sz) => { this.cx = sz.width / 2; this.cy = sz.height * 0.46 })
  }
  update(_, dt) {
    const { width: W, height: H } = this.scale
    this.layers.forEach(s => { s.x -= s.speed * dt * 0.01; if (s.x < -4) s.x = W + 4 })
    const g = this.fx; g.clear()
    g.lineStyle(1, 0x00e5ff, 0.05)
    for (let x = 0; x < W; x += 80) g.lineBetween(x, 0, x, H)
    for (let y = 0; y < H; y += 80) g.lineBetween(0, y, W, y)
    const base = Math.min(W, H)
    this.sats.forEach(s => {
      const R = base * s.r * 1.1
      g.lineStyle(1, s.color, 0.18).strokeEllipse(this.cx, this.cy, R * 2.2, R * 0.9)
      s.a += s.v * dt
      s.img.setPosition(this.cx + Math.cos(s.a) * R * 1.1, this.cy + Math.sin(s.a) * R * 0.45)
    })
  }
}

export default function SpaceBackground() {
  const ref = useRef(null)
  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO, parent: ref.current, transparent: true,
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%' },
      scene: SpaceScene, banner: false,
    })
    return () => game.destroy(true)
  }, [])
  return <div className="phaser-bg" ref={ref} aria-hidden="true" />
}
