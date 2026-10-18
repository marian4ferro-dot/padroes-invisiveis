
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const container = document.getElementById("scene3d");
const shapeName = document.getElementById("shapeName");
const shapeNumber = document.getElementById("shapeNumber");
const generateBtn = document.getElementById("generateBtn");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("shapeSearch");
const searchMessage = document.getElementById("searchMessage");
const complexityInput = document.getElementById("complexity");
const complexityValue = document.getElementById("complexityValue");
const formulaTitle = document.getElementById("formulaTitle");
const formulaEquation = document.getElementById("formulaEquation");
const formulaExplanation = document.getElementById("formulaExplanation");
const formulaDetails = document.getElementById("formulaDetails");
const shapeButtons = document.querySelectorAll(".shape-btn");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#080a18");

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
camera.position.set(0, 0, 9);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.rotateSpeed = 0.85;
controls.zoomSpeed = 0.8;
controls.minDistance = 3;
controls.maxDistance = 18;
controls.enablePan = true;
controls.panSpeed = 0.6;

scene.add(new THREE.AmbientLight(0x8299ff, 1.7));

const light1 = new THREE.PointLight(0x55f5ff, 45);
light1.position.set(4, 4, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0x9855ff, 35);
light2.position.set(-4, -2, -4);
scene.add(light2);

const root = new THREE.Group();
scene.add(root);

let currentShape = "spiral";
let complexity = 60;
let composition = 1;
let currentObjects = [];
let resizeObserver;

const material = (color = 0x70f7ff, opacity = 0.9) =>
  new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.55,
    metalness: 0.55,
    roughness: 0.25,
    transparent: opacity < 1,
    opacity,
    side: THREE.DoubleSide
  });

function addObject(object) {
  root.add(object);
  currentObjects.push(object);
  return object;
}

function addLine(points, color = 0x70f7ff, opacity = 0.9) {
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity
    })
  );
  return addObject(line);
}

function clearObjects() {
  for (const object of currentObjects) {
    root.remove(object);

    object.traverse(child => {
      child.geometry?.dispose();

      if (Array.isArray(child.material)) {
        child.material.forEach(m => m.dispose());
      } else {
        child.material?.dispose();
      }
    });
  }

  currentObjects = [];
}

function buildSpiral() {
  const points = [];
  const turns = 9 + complexity * 0.12;
  const count = complexity * 24;

  for (let i = 0; i <= count; i++) {
    const t = i / count;
    const angle = t * turns * Math.PI * 2;
    const radius = 0.12 + t * 2.3;

    points.push(new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle) * radius,
      (t - 0.5) * 2.2
    ));
  }

  addLine(points, 0x8b65ff);

  for (let i = 0; i < points.length; i += Math.max(1, Math.floor(count / 60))) {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 8, 8),
      material(i % 2 ? 0x70f7ff : 0xb18aff)
    );

    dot.position.copy(points[i]);
    addObject(dot);
  }
}

function buildSphere() {
  const geometry = new THREE.IcosahedronGeometry(2, Math.min(4, Math.floor(complexity / 25)));
  const wire = new THREE.Mesh(geometry, material(0x6df7ff, 0.18));
  addObject(wire);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x9b72ff })
  );
  addObject(edges);

  const inner = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 24, 24),
    material(0x246dff, 0.12)
  );
  addObject(inner);
}

function buildTorus() {
  const geometry = new THREE.TorusGeometry(1.45, 0.65, 12, complexity * 2);
  const mesh = new THREE.Mesh(geometry, material(0x8b65ff, 0.38));
  addObject(mesh);

  addObject(new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry, 20),
    new THREE.LineBasicMaterial({ color: 0x70f7ff })
  ));
}

function buildMobius() {
  const points = [];
  const faces = [];
  const steps = complexity * 12;
  const across = 14;

  for (let i = 0; i <= steps; i++) {
    const u = i / steps * Math.PI * 2;

    for (let j = 0; j <= across; j++) {
      const v = (j / across - 0.5) * 1.2;
      const radius = 1.5 + v * Math.cos(u / 2);

      points.push(
        radius * Math.cos(u),
        radius * Math.sin(u),
        v * Math.sin(u / 2)
      );
    }
  }

  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < across; j++) {
      const a = i * (across + 1) + j;
      const b = a + across + 1;

      faces.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();

  addObject(new THREE.Mesh(geometry, material(0x70f7ff, 0.75)));
}

function buildKnot() {
  const points = [];
  const count = complexity * 30;

  for (let i = 0; i <= count; i++) {
    const t = i / count * Math.PI * 2;

    points.push(new THREE.Vector3(
      1.6 * (Math.cos(t) + 2 * Math.cos(2 * t)),
      1.6 * (Math.sin(t) - 2 * Math.sin(2 * t)),
      1.6 * -Math.sin(3 * t)
    ).multiplyScalar(0.48));
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, count, 0.055, 8, true);

  addObject(new THREE.Mesh(geometry, material(0xa177ff)));
}

function buildHelix() {
  const points = [];
  const count = complexity * 25;

  for (let i = 0; i <= count; i++) {
    const t = i / count * Math.PI * 12;

    points.push(new THREE.Vector3(
      Math.cos(t) * 1.4,
      (i / count - 0.5) * 4.5,
      Math.sin(t) * 1.4
    ));
  }

  addLine(points, 0x70f7ff);

  const second = points.map(p =>
    new THREE.Vector3(-p.x, p.y, -p.z)
  );

  addLine(second, 0xa177ff);
}

function buildWave() {
  const rows = Math.max(10, Math.floor(complexity / 2));
  const columns = rows * 2;
  const points = [];

  for (let i = 0; i <= rows; i++) {
    for (let j = 0; j <= columns; j++) {
      const x = (j / columns - 0.5) * 4.5;
      const z = (i / rows - 0.5) * 4.5;
      const y = 0.45 * Math.sin(x * 2) * Math.cos(z * 2);

      points.push(new THREE.Vector3(x, y, z));
    }
  }

  for (let i = 0; i <= rows; i++) {
    addLine(
      points.slice(i * (columns + 1), (i + 1) * (columns + 1)),
      0x70f7ff,
      0.8
    );
  }

  for (let j = 0; j <= columns; j++) {
    const line = [];

    for (let i = 0; i <= rows; i++) {
      line.push(points[i * (columns + 1) + j]);
    }

    addLine(line, 0xa177ff, 0.65);
  }
}

function buildCrystal() {
  const geometry = new THREE.OctahedronGeometry(2, Math.min(4, Math.floor(complexity / 25)));
  addObject(new THREE.Mesh(geometry, material(0x6df7ff, 0.14)));

  addObject(new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0xb18aff })
  ));

  const core = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.85, 1),
    material(0x8b65ff, 0.5)
  );

  addObject(core);
}

function buildSierpinski() {
  let points = [
    new THREE.Vector3(-2, -1.7, 0),
    new THREE.Vector3(2, -1.7, 0),
    new THREE.Vector3(0, 1.8, 0)
  ];

  const all = [];
  let p = new THREE.Vector3(0, 0, 0);

  for (let i = 0; i < complexity * 100; i++) {
    const target = points[Math.floor(Math.random() * 3)];
    p = p.clone().add(target).multiplyScalar(0.5);
    all.push(p.x, p.y, p.z);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(all, 3));

  addObject(new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: 0x70f7ff,
      size: 0.025,
      sizeAttenuation: true
    })
  ));

  addLine(points.concat(points[0]), 0xa177ff);
}

function buildKlein() {
  const points = [];
  const faces = [];
  const uCount = Math.max(30, complexity);
  const vCount = 24;

  for (let i = 0; i <= uCount; i++) {
    const u = i / uCount * Math.PI * 2;

    for (let j = 0; j <= vCount; j++) {
      const v = j / vCount * Math.PI * 2;

      const radius = 1.2 + Math.cos(u / 2) * Math.sin(v)
        - Math.sin(u / 2) * Math.sin(2 * v);

      points.push(
        radius * Math.cos(u),
        radius * Math.sin(u),
        Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)
      );
    }
  }

  for (let i = 0; i < uCount; i++) {
    for (let j = 0; j < vCount; j++) {
      const a = i * (vCount + 1) + j;
      const b = a + vCount + 1;
      faces.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  geometry.setIndex(faces);
  geometry.computeVertexNormals();

  addObject(new THREE.Mesh(geometry, material(0x8b65ff, 0.7)));
}

const catalogue = {
  spiral: {
    name: "ESPIRAL DE ARQUIMEDES",
    title: "Espiral de Arquimedes",
    equation: "r = a + bθ",
    explanation: "O raio cresce proporcionalmente ao ângulo. A cada volta, a distância entre os braços da espiral permanece constante.",
    details: "r é o raio, θ é o ângulo, a é o raio inicial e b determina o crescimento.",
    build: buildSpiral
  },
  sphere: {
    name: "ESFERA GEOMÉTRICA",
    title: "Esfera",
    equation: "x² + y² + z² = R²",
    explanation: "Todos os pontos da superfície ficam à mesma distância do centro.",
    details: "x, y e z são coordenadas espaciais e R é o raio.",
    build: buildSphere
  },
  torus: {
    name: "TORO",
    title: "Toro",
    equation: "(√(x²+y²) − R)² + z² = r²",
    explanation: "O toro é uma superfície em forma de anel, construída pela rotação de um círculo em torno de um eixo externo.",
    details: "R representa o raio maior e r o raio do tubo.",
    build: buildTorus
  },
  mobius: {
    name: "FITA DE MÖBIUS",
    title: "Fita de Möbius",
    equation: "x = (R + v cos(u/2)) cos(u)",
    explanation: "A fita de Möbius é uma superfície com apenas um lado e uma única borda.",
    details: "A parametrização também usa y = (R + v cos(u/2)) sin(u) e z = v sin(u/2).",
    build: buildMobius
  },
  knot: {
    name: "NÓ TOROIDAL",
    title: "Nó toroidal",
    equation: "x = (cos t + 2 cos 2t)",
    explanation: "Uma curva espacial pode se entrelaçar com ela mesma e formar um nó matemático.",
    details: "As coordenadas y e z também variam com t; a composição usa uma curva espacial fechada.",
    build: buildKnot
  },
  helix: {
    name: "HÉLICE",
    title: "Hélice circular",
    equation: "x = r cos t, y = r sin t, z = ct",
    explanation: "A hélice combina uma rotação circular com um avanço constante ao longo de um eixo.",
    details: "r é o raio e c controla o avanço por unidade de ângulo.",
    build: buildHelix
  },
  wave: {
    name: "SUPERFÍCIE ONDULATÓRIA",
    title: "Onda matemática",
    equation: "z = A sin(kx) cos(ky)",
    explanation: "Funções trigonométricas produzem uma superfície que sobe e desce de forma periódica.",
    details: "A controla a amplitude e k controla a frequência espacial.",
    build: buildWave
  },
  crystal: {
    name: "CRISTAL GEOMÉTRICO",
    title: "Octaedro",
    equation: "|x| + |y| + |z| = R",
    explanation: "O octaedro é um poliedro com oito faces triangulares e simetria em três dimensões.",
    details: "A superfície é formada por faces planas que se encontram em vértices.",
    build: buildCrystal
  },
  sierpinski: {
    name: "TRIÂNGULO DE SIERPIŃSKI",
    title: "Triângulo de Sierpiński",
    equation: "Pₙ₊₁ = (Pₙ + V) / 2",
    explanation: "Uma regra repetida escolhe um dos vértices e aproxima o ponto atual da metade do caminho até ele.",
    details: "A repetição revela uma estrutura fractal autossimilar.",
    build: buildSierpinski
  },
  klein: {
    name: "SUPERFÍCIE DE KLEIN",
    title: "Garrafa de Klein",
    equation: "Superfície paramétrica em u e v",
    explanation: "A garrafa de Klein é uma superfície não orientável que, no espaço tridimensional comum, precisa se intersectar para ser representada.",
    details: "Esta é uma visualização paramétrica ilustrativa, não uma imersão perfeita sem autointerseções.",
    build: buildKlein
  }
};

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const aliases = {
  "espiral": "spiral",
  "espirais": "spiral",
  "arquimedes": "spiral",
  "esfera": "sphere",
  "esferica": "sphere",
  "bola": "sphere",
  "globo": "sphere",
  "torus": "torus",
  "toro": "torus",
  "donut": "torus",
  "anel": "torus",
  "mobius": "mobius",
  "moebius": "mobius",
  "fita": "mobius",
  "fita de mobius": "mobius",
  "no": "knot",
  "no toroidal": "knot",
  "trefoil": "knot",
  "helice": "helix",
  "onda": "wave",
  "ondas": "wave",
  "superficie": "wave",
  "cristal": "crystal",
  "octaedro": "crystal",
  "poliedro": "crystal",
  "sierpinski": "sierpinski",
  "fractal": "sierpinski",
  "fractais": "sierpinski",
  "triangulo": "sierpinski",
  "triangulo de sierpinski": "sierpinski",
  "klein": "klein",
  "garrafa de klein": "klein"
};

function selectShape(key) {
  const item = catalogue[key];
  if (!item) return;

  currentShape = key;
  composition++;

  clearObjects();
  item.build();

  shapeName.textContent = item.name;
  shapeNumber.textContent = `FORM. ${String(composition).padStart(3, "0")}`;

  formulaTitle.textContent = item.title;
  formulaEquation.textContent = item.equation;
  formulaExplanation.textContent = item.explanation;
  formulaDetails.textContent = item.details;

  shapeButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.shape === key);
  });

  searchMessage.textContent = `Explorando: ${item.title}. Arraste o objeto para observar diferentes ângulos.`;
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();

  const query = normalize(searchInput.value);
  const key = aliases[query];

  if (key && catalogue[key]) {
    selectShape(key);
  } else if (catalogue[query]) {
    selectShape(query);
  } else {
    searchMessage.textContent =
      "Ainda não temos essa forma no catálogo. Experimente: esfera, toro, espiral, Möbius, hélice, onda, cristal, fractal ou garrafa de Klein.";
  }
});

shapeButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectShape(button.dataset.shape);
  });
});

generateBtn.addEventListener("click", () => {
  const keys = Object.keys(catalogue);
  const choices = keys.filter(key => key !== currentShape);
  const next = choices[Math.floor(Math.random() * choices.length)];
  selectShape(next);
});

complexityInput.addEventListener("input", () => {
  complexity = Number(complexityInput.value);
  complexityValue.textContent = complexity;

  selectShape(currentShape);
});

function resizeRenderer() {
  const w = container.clientWidth;
  const h = container.clientHeight;

  if (!w || !h) return;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

resizeObserver = new ResizeObserver(resizeRenderer);
resizeObserver.observe(container);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

selectShape("spiral");
resizeRenderer();
animate();
