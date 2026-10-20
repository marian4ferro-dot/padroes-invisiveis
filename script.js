
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const $ = (id) => document.getElementById(id);

const shapes = [
  {
    id: "sphere",
    name: "Esfera",
    sub: "Uma superfície perfeitamente simétrica.",
    desc: "Conjunto de pontos no espaço à mesma distância de um centro.",
    formula: "x² + y² + z² = r²",
    param: "x = r sen(φ) cos(θ)<br>y = r sen(φ) sen(θ)<br>z = r cos(φ)",
    props: [
      "Superfície fechada e sem arestas.",
      "Simetria em todas as direções que passam pelo centro.",
      "Área: A = 4πr² · Volume: V = 4/3 πr³."
    ],
    insight: "A esfera minimiza a área de superfície entre os corpos que encerram o mesmo volume."
  },
  {
    id: "torus",
    name: "Toro",
    sub: "Uma superfície fechada com um furo central.",
    desc: "Superfície gerada pela rotação de um círculo em torno de um eixo.",
    formula: "(√(x² + y²) − R)² + z² = r²",
    param: "x = (R + r cos(v)) cos(u)<br>y = (R + r cos(v)) sen(u)<br>z = r sen(v)",
    props: [
      "R é o raio maior; r é o raio menor.",
      "Área: A = 4π²Rr.",
      "Volume: V = 2π²Rr²."
    ],
    insight: "O toro aparece em objetos como boias, anéis e estruturas rotacionais."
  },
  {
    id: "spiral",
    name: "Espiral",
    sub: "Uma curva que gira enquanto sobe.",
    desc: "Curva espacial que combina rotação angular com variação vertical.",
    formula: "x = a cos(t), y = a sen(t)",
    param: "x = a cos(t)<br>y = a sen(t)<br>z = bt",
    props: [
      "a controla o raio; b controla a subida.",
      "Uma volta corresponde a Δt = 2π.",
      "O passo da hélice é 2πb."
    ],
    insight: "Hélices aparecem em molas, escadas helicoidais e estruturas como o DNA."
  },
  {
    id: "mobius",
    name: "Fita de Möbius",
    sub: "Uma superfície com uma face e uma borda.",
    desc: "Superfície não orientável formada ao unir uma fita após meia torção.",
    formula: "Superfície não orientável",
    param: "x = (1 + v/2 cos(u/2)) cos(u)<br>y = (1 + v/2 cos(u/2)) sen(u)<br>z = v/2 sen(u/2)",
    props: [
      "Possui uma única face e uma única borda.",
      "É uma superfície não orientável.",
      "u e v descrevem a torção e a largura."
    ],
    insight: "A fita de Möbius é um exemplo clássico de como a topologia desafia nossa intuição."
  },
  {
    id: "cone",
    name: "Cone",
    sub: "Uma superfície que converge para um vértice.",
    desc: "Superfície que liga um vértice aos pontos de uma base circular.",
    formula: "x² + y² = (kz)²",
    param: "x = ρ cos(θ)<br>y = ρ sen(θ)<br>z = h(1 − ρ/R)",
    props: [
      "Possui uma base circular e um vértice.",
      "Seções paralelas à base são circulares.",
      "Volume: V = 1/3 πR²h."
    ],
    insight: "Seções planas de um cone podem formar círculos, elipses, parábolas ou hipérboles."
  },
  {
    id: "cylinder",
    name: "Cilindro",
    sub: "Seções circulares paralelas ao longo de um eixo.",
    desc: "Superfície com seção circular constante ao longo do eixo.",
    formula: "x² + y² = r²",
    param: "x = r cos(θ)<br>y = r sen(θ)<br>z = h",
    props: [
      "Raio constante ao longo do eixo.",
      "Área lateral: A = 2πrh.",
      "Volume: V = πr²h."
    ],
    insight: "Cilindros são usados em engenharia, arquitetura e mecânica."
  },
  {
    id: "hypercube",
    name: "Hipercubo",
    sub: "Projeção 3D de uma estrutura de quatro dimensões.",
    desc: "O tesserato é o análogo quadridimensional do cubo.",
    formula: "xᵢ ∈ {−1, +1}, i = 1…4",
    param: "16 vértices<br>32 arestas<br>24 faces quadradas<br>8 células cúbicas",
    props: [
      "É o hipercubo de dimensão 4.",
      "Possui 16 vértices e 32 arestas.",
      "A cena mostra uma projeção tridimensional."
    ],
    insight: "Projeções de hipercubos ajudam a explorar visualmente dimensões além das três que percebemos."
  },
  {
    id: "fractal",
    name: "Fractal",
    sub: "Detalhes que reaparecem em diferentes escalas.",
    desc: "Estrutura com autossimilaridade exata ou aproximada.",
    formula: "N(ε) ∝ ε⁻ᴰ",
    param: "D = dimensão fractal<br>ε = escala de observação<br>N(ε) = número de partes",
    props: [
      "Pode apresentar autossimilaridade.",
      "A dimensão fractal pode não ser inteira.",
      "O padrão depende da regra de construção."
    ],
    insight: "Fractais ajudam a modelar padrões naturais e sistemas dinâmicos."
  },
  {
    id: "enneper",
    name: "Superfície de Enneper",
    sub: "Uma superfície mínima de curvatura média zero.",
    desc: "Superfície mínima clássica parametrizada no espaço tridimensional.",
    formula: "H = (k₁ + k₂)/2 = 0",
    param: "x = u − u³/3 + uv²<br>y = v − v³/3 + vu²<br>z = u² − v²",
    props: [
      "Curvatura média H igual a zero.",
      "É uma superfície mínima clássica.",
      "Pode apresentar auto-interseções."
    ],
    insight: "Superfícies mínimas aparecem em problemas de área mínima e em películas de sabão."
  },
  {
    id: "chaos",
    name: "Caos",
    sub: "Trajetórias complexas a partir de regras determinísticas.",
    desc: "Visualização de uma trajetória do sistema não linear de Lorenz.",
    formula: "ẋ = σ(y − x)",
    param: "ẏ = x(ρ − z) − y<br>ż = xy − βz<br>σ = 10, ρ = 28, β = 8/3",
    props: [
      "Sistema determinístico e não linear.",
      "Pequenas diferenças iniciais podem crescer.",
      "A trajetória típica não se repete periodicamente."
    ],
    insight: "Caos determinístico não é ausência de regras: a complexidade emerge de equações definidas."
  }
];

let scene, camera, renderer, controls, group;
let rotating = true;
let mode = "solid";
let level = 2;
let scale = 1;
let wire = 0.65;
let current = shapes[0];

const sceneElement = $("scene");

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x090a0c);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(4.3, 3.1, 5.6);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  sceneElement.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 1.4));

  const light = new THREE.DirectionalLight(0xffffff, 3);
  light.position.set(4, 5, 4);
  scene.add(light);

  const rim = new THREE.PointLight(0xb8c0cb, 16, 14);
  rim.position.set(-3, 1, 2);
  scene.add(rim);

  const grid = new THREE.GridHelper(12, 24, 0x343941, 0x202329);
  grid.position.y = -1.6;
  grid.material.transparent = true;
  grid.material.opacity = 0.6;
  scene.add(grid);

  buildList();
  selectShape("sphere");
  resize();

  window.addEventListener("resize", resize);
  $("loading").style.display = "none";

  animate();
}

function resize() {
  if (!renderer) return;

  const width = sceneElement.clientWidth;
  const height = sceneElement.clientHeight;

  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function disposeGroup() {
  if (!group) return;

  scene.remove(group);

  group.traverse((object) => {
    if (object.geometry) object.geometry.dispose();

    if (object.material) {
      const materials = Array.isArray(object.material)
        ? object.material
        : [object.material];

      materials.forEach((material) => material.dispose());
    }
  });

  group = null;
}

function makeSurface(fn, a, b, c, d, divisions) {
  const positions = [];
  const indices = [];
  const rows = Math.floor(divisions * 0.7);

  for (let i = 0; i <= divisions; i++) {
    for (let j = 0; j <= rows; j++) {
      const u = a + (b - a) * i / divisions;
      const v = c + (d - c) * j / rows;
      const point = fn(u, v);

      positions.push(point.x, point.y, point.z);
    }
  }

  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < rows; j++) {
      const p = i * (rows + 1) + j;
      const q = p + rows + 1;

      indices.push(p, q, p + 1, q, q + 1, p + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
}

function makeGeometry(id) {
  const n = level === 1 ? 18 : level === 2 ? 42 : 85;

  if (id === "sphere") {
    return new THREE.SphereGeometry(1.25, n, Math.floor(n * 0.65));
  }

  if (id === "torus") {
    return new THREE.TorusGeometry(0.88, 0.34, Math.floor(n / 3), n * 2);
  }

  if (id === "cone") {
    return new THREE.ConeGeometry(1, 2.4, n, level * 3, true);
  }

  if (id === "cylinder") {
    return new THREE.CylinderGeometry(1, 1, 2.2, n, level * 3, true);
  }

  if (id === "spiral") {
    const points = [];
    const turns = level * 3 + 5;

    for (let i = 0; i <= turns * 35; i++) {
      const t = i / (turns * 35) * turns * Math.PI * 2;
      const radius = 0.15 + t * 0.025;

      points.push(new THREE.Vector3(
        radius * Math.cos(t),
        i / (turns * 35) * 2.5 - 1.25,
        radius * Math.sin(t)
      ));
    }

    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      points.length - 1,
      0.018,
      6,
      false
    );
  }

  if (id === "mobius") {
    return makeSurface((u, v) => new THREE.Vector3(
      (1 + v / 2 * Math.cos(u / 2)) * Math.cos(u),
      (1 + v / 2 * Math.cos(u / 2)) * Math.sin(u),
      v / 2 * Math.sin(u / 2)
    ), 0, Math.PI * 2, -0.65, 0.65, n);
  }

  if (id === "enneper") {
    return makeSurface((u, v) => new THREE.Vector3(
      u - u ** 3 / 3 + u * v ** 2,
      v - v ** 3 / 3 + v * u ** 2,
      u ** 2 - v ** 2
    ), -1.35, 1.35, -1.35, 1.35, n);
  }

  if (id === "hypercube") {
    const vertices = [];

    for (let i = 0; i < 16; i++) {
      const x = i & 1 ? 1 : -1;
      const y = i & 2 ? 1 : -1;
      const z = i & 4 ? 1 : -1;
      const w = i & 8 ? 1 : -1;
      const factor = 1 / (2.8 - w * 0.35);

      vertices.push(new THREE.Vector3(
        (x + w * 0.45) * factor,
        (y + w * 0.25) * factor,
        (z - w * 0.4) * factor
      ));
    }

    const points = [];

    for (let i = 0; i < 16; i++) {
      for (let bit = 0; bit < 4; bit++) {
        const j = i ^ (1 << bit);
        if (i < j) points.push(vertices[i], vertices[j]);
      }
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }

  if (id === "fractal") {
    const tetrahedron = [
      new THREE.Vector3(0, 1.3, 0),
      new THREE.Vector3(-1, -0.7, 1),
      new THREE.Vector3(1, -0.7, 1),
      new THREE.Vector3(0, -0.7, -1)
    ];

    let faces = [
      [tetrahedron[0], tetrahedron[1], tetrahedron[2]],
      [tetrahedron[0], tetrahedron[2], tetrahedron[3]],
      [tetrahedron[0], tetrahedron[3], tetrahedron[1]],
      [tetrahedron[1], tetrahedron[3], tetrahedron[2]]
    ];

    const iterations = level === 1 ? 2 : level === 2 ? 3 : 4;

    for (let k = 0; k < iterations; k++) {
      const next = [];

      for (const [a, b, c] of faces) {
        const ab = a.clone().add(b).multiplyScalar(0.5);
        const bc = b.clone().add(c).multiplyScalar(0.5);
        const ca = c.clone().add(a).multiplyScalar(0.5);

        next.push([a, ab, ca], [ab, b, bc], [ca, bc, c], [ab, bc, ca]);
      }

      faces = next;
    }

    const positions = [];

    faces.forEach((face) => {
      face.forEach((point) => positions.push(point.x, point.y, point.z));
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.computeVertexNormals();

    return geometry;
  }

  if (id === "chaos") {
    const points = [];
    let x = 0.1;
    let y = 0;
    let z = 0;

    const dt = 0.005;
    const count = level === 1 ? 4000 : level === 2 ? 8500 : 14000;

    for (let i = 0; i < count; i++) {
      const dx = 10 * (y - x);
      const dy = x * (28 - z) - y;
      const dz = x * y - (8 / 3) * z;

      x += dx * dt;
      y += dy * dt;
      z += dz * dt;

      if (i % 2 === 0) {
        points.push(new THREE.Vector3(x / 12, (z - 25) / 12, y / 12));
      }
    }

    return new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points),
      points.length - 1,
      0.009,
      5,
      false
    );
  }

  return new THREE.SphereGeometry(1, n, n);
}

function selectShape(id) {
  current = shapes.find((shape) => shape.id === id) || shapes[0];

  disposeGroup();

  const geometry = makeGeometry(id);
  group = new THREE.Group();

  const lineShape = ["spiral", "hypercube", "chaos"].includes(id);
  const surfaceShape = ["mobius", "enneper", "fractal"].includes(id);

  const material = new THREE.MeshStandardMaterial({
    color: 0xcbd1d9,
    metalness: 0.55,
    roughness: 0.3,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.88
  });

  let object;

  if (lineShape) {
    object = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: 0xe1e4e9 })
    );
  } else {
    object = new THREE.Mesh(geometry, material);
  }

  group.add(object);

  if (mode === "wire" && !lineShape) {
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: 0xf2f3f5,
        transparent: true,
        opacity: wire
      })
    );

    group.add(wireframe);
  }

  if (mode === "points") {
    group.add(new THREE.Points(
      geometry.clone(),
      new THREE.PointsMaterial({ color: 0xffffff, size: 0.025 })
    ));
  }

  if (surfaceShape && mode === "solid") {
    material.side = THREE.DoubleSide;
  }

  group.scale.setScalar(scale);
  scene.add(group);

  $("shape-title").textContent = current.name.toUpperCase();
  $("shape-subtitle").textContent = current.sub;
  $("math-title").textContent = current.name;
  $("index").textContent = "GEO." + String(shapes.indexOf(current) + 1).padStart(2, "0");
  $("description").textContent = current.desc;
  $("formula").textContent = current.formula;
  $("param").innerHTML = current.param;

  $("props").innerHTML = current.props
    .map((property) => `<div class="property">${escapeHTML(property)}</div>`)
    .join("");

  $("insight").textContent = current.insight;

  document.querySelectorAll(".shape-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.id === id);
  });

  camera.position.set(4.3, 3.1, 5.6);
  controls.target.set(0, 0, 0);
  controls.update();
}

function escapeHTML(text) {
  return text.replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function buildList() {
  const icons = ["◉", "◎", "⌁", "∞", "△", "▱", "⬡", "✳", "◇", "∿"];

  $("shape-list").innerHTML = shapes.map((shape, index) => `
    <button class="shape-option${index === 0 ? " active" : ""}" data-id="${shape.id}">
      <span class="shape-icon">${icons[index]}</span>
      <span class="shape-name">${shape.name}</span>
      <span class="shape-num">${String(index + 1).padStart(2, "0")}</span>
    </button>
  `).join("");

  $("shape-list").addEventListener("click", (event) => {
    const button = event.target.closest("[data-id]");
    if (button) selectShape(button.dataset.id);
  });
}

$("complexity").addEventListener("input", (event) => {
  level = Number(event.target.value);
  $("complexity-label").textContent = ["", "BAIXA", "MÉDIA", "ALTA"][level];
  selectShape(current.id);
});

$("scale").addEventListener("input", (event) => {
  scale = Number(event.target.value);
  $("scale-out").textContent = scale.toFixed(2) + "×";

  if (group) group.scale.setScalar(scale);
});

$("wire").addEventListener("input", (event) => {
  wire = Number(event.target.value) / 100;
  $("wire-out").textContent = event.target.value + "%";

  if (group) {
    group.traverse((object) => {
      if (object.material && object.material.wireframe) {
        object.material.opacity = wire;
      }
    });
  }
});

document.querySelectorAll("[data-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    mode = button.dataset.mode;

    document.querySelectorAll("[data-mode]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    selectShape(current.id);
  });
});

$("reset").addEventListener("click", () => {
  camera.position.set(4.3, 3.1, 5.6);
  controls.target.set(0, 0, 0);
  controls.update();
});

$("rotate").addEventListener("click", () => {
  rotating = !rotating;
  $("rotate").textContent = rotating ? "Ⅱ" : "▶";
});

$("year").textContent = new Date().getFullYear();

function animate() {
  requestAnimationFrame(animate);

  if (controls) controls.update();
  if (rotating && group) group.rotation.y += 0.0025;

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

try {
  init();
} catch (error) {
  console.error("Erro ao iniciar a visualização 3D:", error);
  $("loading").textContent = "ERRO AO CARREGAR A CENA 3D. VERIFIQUE O CONSOLE.";
}
