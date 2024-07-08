import * as THREE from 'three';

let scene, camera, renderer, material, mesh, clock, uniforms, width, height;


init();
animate();

function init() {
    // Initialize the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    const container = document.getElementById('threejs-container');

    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    clock = new THREE.Clock();

    camera = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, 1, 1000);
    camera.position.set(0, 0, 10);
    scene.add(camera);

    uniforms = {
        resolution: {value: new THREE.Vector4()},
        time: {value: 0.0},
      }

    onWindowResize();
    const geometry = new THREE.PlaneGeometry(2, 2);

    fetch('./shaders/vertexShader.glsl')
        .then(response => response.text())
        .then(vertexShader => {
            fetch('./shaders/fragmentShader.glsl')
                .then(response => response.text())
                .then(fragmentShader => {
                    material = new THREE.ShaderMaterial({
                        uniforms: uniforms,
                        vertexShader: vertexShader,
                        fragmentShader: fragmentShader
                    });

                    mesh = new THREE.Mesh(geometry, material);
                    scene.add(mesh);

                    animate();
                });
        });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    //console.log("Height: ", height, " width: ", width);
    const container = document.getElementById('threejs-container');

    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    const imageAspect = 1;
    let a1; let a2;
    if(height/width>imageAspect) {
        a1 = (width/height) * imageAspect;
        a2 = 1;
    } else {
        a1 = 1;
        a2 = (height/width) / imageAspect;
    }

    uniforms.resolution.value.x = width;
    uniforms.resolution.value.y = height;
    uniforms.resolution.value.z = a1;
    uniforms.resolution.value.w = a2;
}

function animate() {
    // update time uniform
    uniforms.time.value = clock.getElapsedTime();

    // animation loop
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
