import * as THREE from 'three'
import RAPIER from '@dimforge/rapier3d'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GAME_RULES, getWinReason, randomInteger } from '../game/rules'
import type {
  BallShape,
  GameEvent,
  GameSnapshot,
  SavedBall,
  SaveGameV1,
  SelectionState,
} from '../game/types'

const SAVE_KEY = 'ball-moving-3d-save-v1'
const BALL_GROUP = 0x0001
const WALL_GROUP = 0x0002
const BALL_COLLISION_GROUPS = (BALL_GROUP << 16) | WALL_GROUP
const WALL_COLLISION_GROUPS = (WALL_GROUP << 16) | BALL_GROUP
const ARENA_HALF_WIDTH = 7.5
const ARENA_HALF_DEPTH = 5
const FIXED_TIMESTEP = 1 / 60

interface BallEntity {
  id: number
  value: number
  shape: BallShape
  size: number
  selection: SelectionState
  body: RAPIER.RigidBody
  collider: RAPIER.Collider
  root: THREE.Group
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>
  label: THREE.Sprite
  ring: THREE.Mesh<THREE.TorusGeometry, THREE.MeshBasicMaterial>
  light: THREE.PointLight
  trail: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>
  trailPositions: Float32Array
}

interface Burst {
  points: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial>
  velocities: THREE.Vector3[]
  life: number
}

export class GameEngine {
  private readonly canvas: HTMLCanvasElement
  private readonly onSnapshot: (snapshot: GameSnapshot) => void
  private readonly onEvent: (event: GameEvent) => void
  private readonly scene = new THREE.Scene()
  private readonly camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
  private readonly renderer: THREE.WebGLRenderer
  private readonly composer: EffectComposer
  private readonly bloom: UnrealBloomPass
  private readonly world = new RAPIER.World({ x: 0, y: 0, z: 0 })
  private readonly raycaster = new THREE.Raycaster()
  private readonly pointer = new THREE.Vector2()
  private readonly timer = new THREE.Timer()
  private readonly balls = new Map<number, BallEntity>()
  private readonly clickableMeshes: THREE.Object3D[] = []
  private readonly bursts: Burst[] = []
  private spaceTexture: THREE.Texture | null = null
  private readonly resizeObserver: ResizeObserver
  private animationFrame = 0
  private accumulator = 0
  private snapshotAccumulator = 0
  private nextBallId = 1
  private playerName = 'PLAYER'
  private score = 0
  private elapsedSeconds = 0
  private paused = false
  private started = false
  private status: GameSnapshot['status'] = 'idle'
  private speed = 1
  private ready = false
  private destroyed = false

  constructor(
    canvas: HTMLCanvasElement,
    onSnapshot: (snapshot: GameSnapshot) => void,
    onEvent: (event: GameEvent) => void,
  ) {
    this.canvas = canvas
    this.onSnapshot = onSnapshot
    this.onEvent = onEvent

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.15
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFShadowMap

    this.composer = new EffectComposer(this.renderer)
    this.composer.addPass(new RenderPass(this.scene, this.camera))
    this.bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.56, 0.5, 0.78)
    this.composer.addPass(this.bloom)

    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(canvas)
    canvas.addEventListener('pointerdown', this.handlePointerDown)

    this.buildScene()
    this.resize()
    this.ready = true
    this.emitSnapshot()
    this.timer.connect(document)
    this.animate()
  }

  public start(playerName: string): void {
    this.playerName = playerName.trim().slice(0, 16) || 'PLAYER'
    this.status = 'playing'
    this.emitSnapshot()
  }

  public addBall(): void {
    if (!this.canMutateGame()) return

    if (!this.started) {
      this.started = true
      this.elapsedSeconds = 0
    }

    const value = randomInteger(GAME_RULES.valueMin, GAME_RULES.valueMax)
    const shape: BallShape = Math.random() > 0.5 ? 'sphere' : 'roundedCube'
    const size = THREE.MathUtils.randFloat(0.56, 0.92)
    const id = this.nextBallId++
    const selection: SelectionState = this.balls.size === 0 ? 'implicit' : 'none'
    const position: [number, number, number] = [
      -ARENA_HALF_WIDTH + 1.35,
      size + 0.08,
      ARENA_HALF_DEPTH - 1.25,
    ]
    const velocity = this.randomVelocity()

    this.createBall({ id, value, shape, size, selection, position, velocity })
    this.pulseArena(new THREE.Color('#36d9ff'), 0.32)
    this.onEvent({ type: 'notice', message: `新增 ${value} 分${shape === 'sphere' ? '球' : '方块'}`, tone: 'info' })
    this.emitSnapshot()
  }

  public deleteSelected(): void {
    if (!this.canMutateGame() || this.balls.size === 0) return

    const selected = [...this.balls.values()].find((ball) => ball.selection === 'explicit')
      ?? [...this.balls.values()].find((ball) => ball.selection === 'implicit')
      ?? this.balls.values().next().value as BallEntity | undefined

    if (!selected) return

    const gainsScore = selected.selection === 'explicit'
    if (gainsScore) this.score += selected.value
    const position = selected.body.translation()
    this.spawnBurst(new THREE.Vector3(position.x, position.y, position.z), gainsScore ? '#3be7ff' : '#ff4f73', 34)
    this.removeBall(selected)

    const oldest = this.balls.values().next().value as BallEntity | undefined
    if (oldest) {
      this.setSelection(oldest, 'implicit')
    }

    this.onEvent({
      type: 'notice',
      message: gainsScore ? `+${selected.value} 分` : '删除了最早出现的小球，本次不计分',
      tone: gainsScore ? 'success' : 'info',
    })

    const winReason = getWinReason(this.score, this.balls.size)
    if (winReason) {
      this.status = 'won'
      this.paused = true
      this.pulseArena(new THREE.Color('#ffc45c'), 1.4)
      this.onEvent({ type: 'won', reason: winReason, elapsedSeconds: this.elapsedSeconds })
    }

    this.emitSnapshot()
  }

  public togglePause(): void {
    if (!this.started || this.status !== 'playing') return
    this.paused = !this.paused
    this.onEvent({
      type: 'notice',
      message: this.paused ? '竞技场已暂停' : '继续挑战',
      tone: 'info',
    })
    this.emitSnapshot()
  }

  public changeSpeed(direction: -1 | 1): void {
    if (this.status !== 'playing' || this.paused) return
    const levels = GAME_RULES.speedLevels
    const currentIndex = levels.findIndex((level) => Math.abs(level - this.speed) < 0.001)
    const nextIndex = THREE.MathUtils.clamp(currentIndex + direction, 0, levels.length - 1)
    const nextSpeed = levels[nextIndex] ?? 1
    if (nextSpeed === this.speed) return

    const ratio = nextSpeed / this.speed
    this.speed = nextSpeed
    this.balls.forEach((ball) => {
      const velocity = ball.body.linvel()
      ball.body.setLinvel({ x: velocity.x * ratio, y: 0, z: velocity.z * ratio }, true)
    })
    this.onEvent({ type: 'notice', message: `速度调整为 ${this.speed.toFixed(2)}×`, tone: 'info' })
    this.emitSnapshot()
  }

  public save(): void {
    const data: SaveGameV1 = {
      version: 1,
      playerName: this.playerName,
      score: this.score,
      elapsedSeconds: this.elapsedSeconds,
      speed: this.speed,
      paused: this.paused,
      nextBallId: this.nextBallId,
      balls: [...this.balls.values()].map((ball) => {
        const position = ball.body.translation()
        const velocity = ball.body.linvel()
        return {
          id: ball.id,
          value: ball.value,
          shape: ball.shape,
          size: ball.size,
          selection: ball.selection,
          position: [position.x, position.y, position.z],
          velocity: [velocity.x, velocity.y, velocity.z],
        }
      }),
    }

    localStorage.setItem(SAVE_KEY, JSON.stringify(data))
    this.onEvent({ type: 'notice', message: '游戏状态已存入本机', tone: 'success' })
  }

  public load(): void {
    const raw = localStorage.getItem(SAVE_KEY)
    if (!raw) {
      this.onEvent({ type: 'notice', message: '还没有可读取的存档', tone: 'danger' })
      return
    }

    try {
      const data = JSON.parse(raw) as SaveGameV1
      if (!this.isValidSave(data)) throw new Error('invalid save')

      this.clearBalls()
      this.playerName = data.playerName
      this.score = data.score
      this.elapsedSeconds = data.elapsedSeconds
      this.speed = data.speed
      this.paused = data.paused
      this.started = data.balls.length > 0 || data.elapsedSeconds > 0
      this.status = 'playing'
      this.nextBallId = data.nextBallId
      data.balls.forEach((ball) => this.createBall(ball))
      this.onEvent({ type: 'notice', message: '存档读取成功', tone: 'success' })
      this.emitSnapshot()
    } catch {
      this.onEvent({ type: 'notice', message: '存档损坏，已停止读取', tone: 'danger' })
    }
  }

  public restart(): void {
    this.clearBalls()
    this.score = 0
    this.elapsedSeconds = 0
    this.paused = false
    this.started = false
    this.status = 'playing'
    this.speed = 1
    this.nextBallId = 1
    this.emitSnapshot()
  }

  public destroy(): void {
    this.destroyed = true
    cancelAnimationFrame(this.animationFrame)
    this.resizeObserver.disconnect()
    this.canvas.removeEventListener('pointerdown', this.handlePointerDown)
    this.clearBalls()
    this.world.free()
    this.spaceTexture?.dispose()
    this.timer.dispose()
    this.composer.dispose()
    this.renderer.dispose()
  }

  private buildScene(): void {
    this.scene.background = new THREE.Color('#020407')
    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}assets/deep-space.png`, (texture) => {
      if (this.destroyed) {
        texture.dispose()
        return
      }
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      this.spaceTexture = texture
      this.scene.background = texture
    })
    this.scene.fog = new THREE.FogExp2('#02060b', 0.027)
    this.camera.position.set(0, 10.5, 12.5)
    this.camera.lookAt(0, 0, 0.1)

    const ambient = new THREE.HemisphereLight('#7edcff', '#05030a', 1.15)
    this.scene.add(ambient)

    const keyLight = new THREE.SpotLight('#8ae9ff', 62, 35, Math.PI / 4, 0.55, 1.1)
    keyLight.position.set(-5, 12, 6)
    keyLight.target.position.set(0, 0, 0)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    this.scene.add(keyLight, keyLight.target)

    const warmLight = new THREE.SpotLight('#ff9b4a', 42, 28, Math.PI / 5, 0.7, 1.2)
    warmLight.position.set(7, 8, -4)
    warmLight.target.position.set(1, 0, 0)
    this.scene.add(warmLight, warmLight.target)

    const floorMaterial = new THREE.MeshPhysicalMaterial({
      color: '#06121d',
      roughness: 0.32,
      metalness: 0.72,
      clearcoat: 0.85,
      clearcoatRoughness: 0.28,
    })
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA_HALF_WIDTH * 2, ARENA_HALF_DEPTH * 2),
      floorMaterial,
    )
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    floor.name = 'arena-floor'
    this.scene.add(floor)

    const grid = new THREE.GridHelper(15, 30, '#1fb6dd', '#0b4057')
    grid.position.y = 0.012
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material]
    gridMaterials.forEach((material) => {
      material.transparent = true
      material.opacity = 0.38
      material.depthWrite = false
    })
    this.scene.add(grid)

    this.buildWalls()
    this.buildCenterMark()
  }

  private buildWalls(): void {
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: '#092331',
      emissive: '#00b7e8',
      emissiveIntensity: 0.75,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 1,
    })
    wallMaterial.name = 'arena-glow'

    const wallSpecs = [
      { position: [0, 0.75, -ARENA_HALF_DEPTH] as const, half: [ARENA_HALF_WIDTH + 0.3, 0.72, 0.18] as const },
      { position: [0, 0.75, ARENA_HALF_DEPTH] as const, half: [ARENA_HALF_WIDTH + 0.3, 0.72, 0.18] as const },
      { position: [-ARENA_HALF_WIDTH, 0.75, 0] as const, half: [0.18, 0.72, ARENA_HALF_DEPTH] as const },
      { position: [ARENA_HALF_WIDTH, 0.75, 0] as const, half: [0.18, 0.72, ARENA_HALF_DEPTH] as const },
    ]

    wallSpecs.forEach(({ position, half }, index) => {
      const [x, y, z] = position
      const [hx, hy, hz] = half
      const collider = RAPIER.ColliderDesc.cuboid(hx, hy, hz)
        .setTranslation(x, y, z)
        .setRestitution(1)
        .setFriction(0)
        .setCollisionGroups(WALL_COLLISION_GROUPS)
      this.world.createCollider(collider)

      const visualHeight = 0.24
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(hx * 2, visualHeight, hz * 2), wallMaterial)
      mesh.position.set(x, visualHeight / 2, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      this.scene.add(mesh)

      const accent = new THREE.Mesh(
        new THREE.BoxGeometry(
          index < 2 ? hx * 1.65 : 0.07,
          0.055,
          index < 2 ? 0.07 : hz * 1.65,
        ),
        new THREE.MeshBasicMaterial({ color: index === 0 ? '#ff9f45' : '#43dcff', toneMapped: false }),
      )
      accent.position.set(x, visualHeight + 0.035, z)
      this.scene.add(accent)
    })
  }

  private buildCenterMark(): void {
    const rings = new THREE.Group()
    for (let index = 0; index < 3; index += 1) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.8 + index * 0.42, 0.81 + index * 0.42, 96),
        new THREE.MeshBasicMaterial({
          color: index === 1 ? '#ff8f43' : '#1ccff5',
          transparent: true,
          opacity: 0.2 - index * 0.035,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      )
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.025
      rings.add(ring)
    }
    rings.name = 'center-rings'
    this.scene.add(rings)
  }

  private createBall(saved: SavedBall): void {
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(...saved.position)
      .setLinvel(...saved.velocity)
      .setGravityScale(0)
      .setLinearDamping(0)
      .setAngularDamping(0)
      .setCanSleep(false)
      .setCcdEnabled(true)
      .enabledTranslations(true, false, true)
      .lockRotations()
    const body = this.world.createRigidBody(bodyDesc)

    const colliderDesc = saved.shape === 'sphere'
      ? RAPIER.ColliderDesc.ball(saved.size)
      : RAPIER.ColliderDesc.roundCuboid(saved.size * 0.82, saved.size * 0.72, saved.size * 0.82, saved.size * 0.18)
    colliderDesc
      .setRestitution(1)
      .setFriction(0)
      .setDensity(1)
      .setCollisionGroups(BALL_COLLISION_GROUPS)
    const collider = this.world.createCollider(colliderDesc, body)

    const root = new THREE.Group()
    const geometry: THREE.BufferGeometry = saved.shape === 'sphere'
      ? new THREE.SphereGeometry(saved.size, 48, 32)
      : new RoundedBoxGeometry(saved.size * 1.78, saved.size * 1.56, saved.size * 1.78, 8, saved.size * 0.25)
    const material = new THREE.MeshPhysicalMaterial({
      color: '#d41939',
      emissive: '#6b0017',
      emissiveIntensity: 1.1,
      metalness: 0.18,
      roughness: 0.16,
      transmission: 0.08,
      thickness: 1.4,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      ior: 1.38,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.userData.ballId = saved.id
    root.add(mesh)

    const label = this.createNumberLabel(saved.value, saved.size)
    label.position.y = saved.size * 0.15
    label.userData.ballId = saved.id
    root.add(label)

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(saved.size * 1.28, 0.035, 10, 64),
      new THREE.MeshBasicMaterial({ color: '#58e7ff', transparent: true, opacity: 0.9, toneMapped: false }),
    )
    ring.rotation.x = Math.PI / 2
    ring.position.y = -saved.size + 0.05
    ring.visible = false
    root.add(ring)

    const light = new THREE.PointLight('#25d9ff', 0, 4.5, 2)
    light.position.y = 0.8
    root.add(light)

    const trailPositions = new Float32Array(30 * 3)
    const trailGeometry = new THREE.BufferGeometry()
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3))
    const trail = new THREE.Line(
      trailGeometry,
      new THREE.LineBasicMaterial({
        color: '#ff345e',
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    )
    this.scene.add(root, trail)

    const entity: BallEntity = {
      ...saved,
      body,
      collider,
      root,
      mesh,
      label,
      ring,
      light,
      trail,
      trailPositions,
    }
    this.balls.set(saved.id, entity)
    this.clickableMeshes.push(mesh, label)
    this.setSelection(entity, saved.selection)
  }

  private createNumberLabel(value: number, size: number): THREE.Sprite {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const context = canvas.getContext('2d')!
    context.clearRect(0, 0, 256, 256)
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = '900 156px Arial, sans-serif'
    context.shadowColor = 'rgba(0,0,0,.78)'
    context.shadowBlur = 18
    context.shadowOffsetY = 8
    context.fillStyle = '#ffffff'
    context.fillText(String(value), 128, 132)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy())
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.setScalar(size * 1.18)
    sprite.renderOrder = 8
    return sprite
  }

  private setSelection(ball: BallEntity, selection: SelectionState): void {
    ball.selection = selection
    const explicit = selection === 'explicit'
    ball.mesh.material.color.set(explicit ? '#086db5' : '#d41939')
    ball.mesh.material.emissive.set(explicit ? '#004f78' : '#6b0017')
    ball.mesh.material.emissiveIntensity = explicit ? 1.05 : 1.1
    ball.ring.visible = explicit
    ball.light.intensity = explicit ? 1.5 : 0
    ball.trail.material.color.set(explicit ? '#3fe7ff' : '#ff345e')
  }

  private selectBall(ball: BallEntity): void {
    this.balls.forEach((candidate) => this.setSelection(candidate, 'none'))
    this.setSelection(ball, 'explicit')
    const position = ball.body.translation()
    this.spawnBurst(new THREE.Vector3(position.x, position.y, position.z), '#44e6ff', 20)
    this.pulseArena(new THREE.Color('#4de8ff'), 0.62)
    this.onEvent({ type: 'notice', message: `已锁定 ${ball.value} 分目标`, tone: 'info' })
    this.emitSnapshot()
  }

  private miss(): void {
    if (this.balls.size === 0) return
    const penalty = randomInteger(GAME_RULES.missPenaltyMin, GAME_RULES.missPenaltyMax)
    this.score = Math.max(0, this.score - penalty)
    this.balls.forEach((candidate) => this.setSelection(candidate, 'none'))
    const oldest = this.balls.values().next().value as BallEntity | undefined
    if (oldest) this.setSelection(oldest, 'implicit')
    this.onEvent({ type: 'notice', message: `没有点中，-${penalty} 分`, tone: 'danger' })
    this.emitSnapshot()
  }

  private handlePointerDown = (event: PointerEvent): void => {
    if (!this.canMutateGame() || this.balls.size === 0) return
    const rect = this.canvas.getBoundingClientRect()
    this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    this.raycaster.setFromCamera(this.pointer, this.camera)
    const hits = this.raycaster.intersectObjects(this.clickableMeshes, false)
    const hit = hits[0]
    const id = hit?.object.userData.ballId as number | undefined
    const ball = id === undefined ? undefined : this.balls.get(id)
    if (ball) this.selectBall(ball)
    else this.miss()
  }

  private animate = (timestamp?: number): void => {
    if (this.destroyed) return
    this.animationFrame = requestAnimationFrame(this.animate)
    this.timer.update(timestamp)
    const delta = Math.min(this.timer.getDelta(), 0.05)

    if (!this.paused && this.status === 'playing') {
      this.accumulator += delta
      if (this.started) this.elapsedSeconds += delta
      while (this.accumulator >= FIXED_TIMESTEP) {
        this.world.timestep = FIXED_TIMESTEP
        this.world.step()
        this.accumulator -= FIXED_TIMESTEP
      }
    }

    this.updateScene(delta)
    this.snapshotAccumulator += delta
    if (this.snapshotAccumulator > 0.2) {
      this.snapshotAccumulator = 0
      this.emitSnapshot()
    }
    this.composer.render()
  }

  private updateScene(delta: number): void {
    const elapsed = this.timer.getElapsed()
    const centerRings = this.scene.getObjectByName('center-rings')
    if (centerRings) centerRings.rotation.y = elapsed * 0.08
    this.balls.forEach((ball) => {
      const position = ball.body.translation()
      ball.root.position.set(position.x, position.y, position.z)
      ball.ring.rotation.z = elapsed * 1.7
      if (ball.selection === 'explicit') {
        const pulse = 1 + Math.sin(elapsed * 7) * 0.05
        ball.ring.scale.setScalar(pulse)
      }

      const positions = ball.trailPositions
      for (let index = positions.length - 3; index >= 3; index -= 3) {
        positions[index] = positions[index - 3] ?? position.x
        positions[index + 1] = positions[index - 2] ?? position.y
        positions[index + 2] = positions[index - 1] ?? position.z
      }
      positions[0] = position.x
      positions[1] = Math.max(0.07, position.y - ball.size * 0.65)
      positions[2] = position.z
      const attribute = ball.trail.geometry.getAttribute('position')
      attribute.needsUpdate = true
    })

    for (let index = this.bursts.length - 1; index >= 0; index -= 1) {
      const burst = this.bursts[index]
      if (!burst) continue
      burst.life -= delta
      const positionAttribute = burst.points.geometry.getAttribute('position') as THREE.BufferAttribute
      for (let particleIndex = 0; particleIndex < burst.velocities.length; particleIndex += 1) {
        const velocity = burst.velocities[particleIndex]
        if (!velocity) continue
        positionAttribute.array[particleIndex * 3] = Number(positionAttribute.array[particleIndex * 3]) + velocity.x * delta
        positionAttribute.array[particleIndex * 3 + 1] = Number(positionAttribute.array[particleIndex * 3 + 1]) + velocity.y * delta
        positionAttribute.array[particleIndex * 3 + 2] = Number(positionAttribute.array[particleIndex * 3 + 2]) + velocity.z * delta
        velocity.y -= 2.4 * delta
      }
      positionAttribute.needsUpdate = true
      burst.points.material.opacity = Math.max(0, burst.life)
      if (burst.life <= 0) {
        this.scene.remove(burst.points)
        burst.points.geometry.dispose()
        burst.points.material.dispose()
        this.bursts.splice(index, 1)
      }
    }
  }

  private spawnBurst(position: THREE.Vector3, color: string, count: number): void {
    const positions = new Float32Array(count * 3)
    const velocities: THREE.Vector3[] = []
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = position.x
      positions[index * 3 + 1] = position.y
      positions[index * 3 + 2] = position.z
      velocities.push(new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(4),
        THREE.MathUtils.randFloat(0.5, 3.5),
        THREE.MathUtils.randFloatSpread(4),
      ))
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color,
      size: 0.1,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    })
    const points = new THREE.Points(geometry, material)
    this.scene.add(points)
    this.bursts.push({ points, velocities, life: 1 })
  }

  private pulseArena(color: THREE.Color, intensity: number): void {
    const material = this.scene.getObjectByName('arena-floor') instanceof THREE.Mesh
      ? (this.scene.getObjectByName('arena-floor') as THREE.Mesh).material
      : null
    if (!(material instanceof THREE.MeshPhysicalMaterial)) return
    material.emissive.copy(color)
    material.emissiveIntensity = intensity
    window.setTimeout(() => {
      if (material) material.emissiveIntensity = 0
    }, 180)
  }

  private randomVelocity(): [number, number, number] {
    const nonZero = () => {
      let value = 0
      while (value === 0) value = randomInteger(-3, 3)
      return value
    }
    const scale = 1.12 * this.speed
    return [nonZero() * scale, 0, nonZero() * scale]
  }

  private removeBall(ball: BallEntity): void {
    this.world.removeRigidBody(ball.body)
    this.scene.remove(ball.root, ball.trail)
    const clickIndex = this.clickableMeshes.indexOf(ball.mesh)
    if (clickIndex >= 0) this.clickableMeshes.splice(clickIndex, 1)
    const labelIndex = this.clickableMeshes.indexOf(ball.label)
    if (labelIndex >= 0) this.clickableMeshes.splice(labelIndex, 1)
    ball.mesh.geometry.dispose()
    ball.mesh.material.dispose()
    ball.label.material.map?.dispose()
    ball.label.material.dispose()
    ball.ring.geometry.dispose()
    ball.ring.material.dispose()
    ball.trail.geometry.dispose()
    ball.trail.material.dispose()
    this.balls.delete(ball.id)
  }

  private clearBalls(): void {
    ;[...this.balls.values()].forEach((ball) => this.removeBall(ball))
  }

  private canMutateGame(): boolean {
    return this.status === 'playing' && !this.paused
  }

  private isValidSave(value: unknown): value is SaveGameV1 {
    if (!value || typeof value !== 'object') return false
    const save = value as Partial<SaveGameV1>
    return save.version === 1
      && typeof save.playerName === 'string'
      && typeof save.score === 'number'
      && typeof save.elapsedSeconds === 'number'
      && typeof save.speed === 'number'
      && typeof save.nextBallId === 'number'
      && Array.isArray(save.balls)
      && save.balls.every((ball) =>
        typeof ball.id === 'number'
        && typeof ball.value === 'number'
        && (ball.shape === 'sphere' || ball.shape === 'roundedCube')
        && Array.isArray(ball.position)
        && ball.position.length === 3
        && Array.isArray(ball.velocity)
        && ball.velocity.length === 3,
      )
  }

  private emitSnapshot(): void {
    const selected = [...this.balls.values()].find((ball) => ball.selection === 'explicit')
    this.onSnapshot({
      ready: this.ready,
      playerName: this.playerName,
      score: this.score,
      elapsedSeconds: this.elapsedSeconds,
      ballCount: this.balls.size,
      paused: this.paused,
      started: this.started,
      speed: this.speed,
      selectedValue: selected?.value ?? null,
      status: this.status,
    })
  }

  private resize(): void {
    const width = Math.max(1, this.canvas.clientWidth)
    const height = Math.max(1, this.canvas.clientHeight)
    const pixelRatio = Math.min(window.devicePixelRatio, 1.75)
    this.renderer.setPixelRatio(pixelRatio)
    this.renderer.setSize(width, height, false)
    this.composer.setPixelRatio(pixelRatio)
    this.composer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
}
