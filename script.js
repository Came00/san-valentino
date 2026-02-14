import * as THREE from "https://cdn.skypack.dev/three@0.133.1/build/three.module";

const canvasEl = document.querySelector("#canvas");
const cleanBtn = document.querySelector(".clean-btn");

const pointer = {
    x: .66,
    y: .3,
    clicked: true,
    vanishCanvas: false
};

let basicMaterial, shaderMaterial;
let renderer = new THREE.WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

let sceneShader = new THREE.Scene();
let sceneBasic = new THREE.Scene();
let camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
let clock = new THREE.Clock();

let renderTargets = [
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight),
    new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight)
];

function createPlane() {
    shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            u_stop_time: { value: 0. },
            u_stop_randomizer: { value: new THREE.Vector2(Math.random(), Math.random()) },
            u_cursor: { value: new THREE.Vector2(pointer.x, pointer.y) },
            u_ratio: { value: window.innerWidth / window.innerHeight },
            u_texture: { value: null },
            u_clean: { value: 1. },
        },
        vertexShader: document.getElementById("vertexShader").textContent,
        fragmentShader: document.getElementById("fragmentShader").textContent
    });
    basicMaterial = new THREE.MeshBasicMaterial();
    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    const planeBasic = new THREE.Mesh(planeGeometry, basicMaterial);
    const planeShader = new THREE.Mesh(planeGeometry, shaderMaterial);
    sceneBasic.add(planeBasic);
    sceneShader.add(planeShader);
}

function updateSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    renderTargets[0].setSize(width, height);
    renderTargets[1].setSize(width, height);
    if (shaderMaterial) {
        shaderMaterial.uniforms.u_ratio.value = width / height;
    }
}

function cleanCanvas() {
    pointer.vanishCanvas = true;
    setTimeout(() => {
        pointer.vanishCanvas = false;
    }, 50);
}

function render() {
    shaderMaterial.uniforms.u_clean.value = pointer.vanishCanvas ? 0 : 1;
    shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

    if (pointer.clicked) {
        shaderMaterial.uniforms.u_cursor.value = new THREE.Vector2(pointer.x, 1 - pointer.y);
        shaderMaterial.uniforms.u_stop_randomizer.value = new THREE.Vector2(Math.random(), Math.random());
        shaderMaterial.uniforms.u_stop_time.value = 0.;
        pointer.clicked = false;
    }
    shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();

    renderer.setRenderTarget(renderTargets[1]);
    renderer.render(sceneShader, camera);
    basicMaterial.map = renderTargets[1].texture;
    renderer.setRenderTarget(null);
    renderer.render(sceneBasic, camera);

    let tmp = renderTargets[0];
    renderTargets[0] = renderTargets[1];
    renderTargets[1] = tmp;

    requestAnimationFrame(render);
}

// Avvio
createPlane();
updateSize();

window.addEventListener("resize", () => {
    updateSize();
    cleanCanvas();
});

window.addEventListener("click", e => {
    pointer.x = e.pageX / window.innerWidth;
    pointer.y = e.pageY / window.innerHeight;
    pointer.clicked = true;
});

cleanBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    cleanCanvas();
});

render();



const yesbtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const questionSection = document.getElementById('questionSection');
const successSection = document.getElementById('successSection');

const moveButton = () => {
    const containerHeight = window.innerHeight;
    const containerWidth = window.innerWidth;

    const btnHeight = noBtn.offsetHeight;
    const btnWidth = noBtn.offsetWidth;

    const newTop = Math.random() * (containerHeight - btnHeight);
    const newLeft = Math.random() * (containerWidth - btnWidth);

    noBtn.style.position = "fixed";
    noBtn.style.top = `${newTop}px`;
    noBtn.style.left = `${newLeft}px`;
};

if (window.matchMedia("(max-width: 768px)").matches) {
    noBtn.addEventListener("click", moveButton);
} else {
    noBtn.addEventListener("mouseover", moveButton);
}

yesbtn.addEventListener('click', () => {
    questionSection.style.display = 'none';
    successSection.style.display = 'block';
    noBtn.remove();
});



yesbtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Evita che nasca un fiore sotto il pulsante
    questionSection.style.display = 'none';
    successSection.style.display = 'block';
    noBtn.remove();
});

// Aggiungi stopPropagation anche al mouseover del noBtn se vuoi
noBtn.addEventListener("mouseover", (e) => {
    e.stopPropagation();
    moveButton();
});