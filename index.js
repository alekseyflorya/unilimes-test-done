const form = document.getElementById('form');
const selectFigure = document.getElementById('selectFigure');
const scaleFigure = document.getElementById('scaleFigure');
const uuidList = document.getElementById('uuidList');

let items = [];

let scale;
let figure;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  scale = document.getElementById('scaleFigure').value;
  objectType = document.getElementById('selectFigure').value;
  addObject(objectType);
});

function getRandomCoords() {
  const rand = ()=>(Math.random()*50);
  return [rand(), 0, rand()];
}

function createListItem(uuid) {
  function deleteItem() {
    const deleteItem = items.find(el => el.uuid === this.getAttribute('data-uuid'));
    items = items.filter(el => el.uuid !== this.getAttribute('data-uuid'));

    this.closest('li').remove();
    scene.remove(deleteItem.getMesh());
  }

  const item = document.createElement('li');
  const itemSpan = document.createElement('span');
  itemSpan.textContent = uuid;
  const button = document.createElement('button');
  button.setAttribute('data-uuid', uuid);
  button.textContent = 'X';

  button.addEventListener('click', deleteItem);

  item.append(itemSpan);
  item.append(button);

  uuidList.append(item);
}


class Shape {
  constructor({scale, color='0x00ff00', coords}) {
    this.scale = scale;
    this.color = color;
    this.coords = coords;
    this.mesh = null;
    this.uuid = null;
    this.material = new THREE.MeshPhongMaterial({color: color, flatShading: true});
  }

  create() {
    this.mesh = new THREE.Mesh(this.getGeometry(), this.material);
    this.mesh.position.set(...this.coords);
    this.mesh.updateMatrix();
    this.mesh.matrixAutoUpdate = false;
    this.uuid = this.mesh.uuid;
    createListItem(this.uuid);

    return this;
  }
  getMesh() {
    return this.mesh;
  }

  getGeometry(){}
}

class Cube extends Shape {
  constructor(args) {
    super(args);
  }

  getGeometry() {
    return new THREE.BoxBufferGeometry(this.scale*5, this.scale*5, this.scale*5);
  }
}

class Sphere extends Shape {
  constructor(args) {
    super(args);
  }

  getGeometry() {
    return new THREE.SphereBufferGeometry(this.scale*3, 30, 30);
  }
}

class Cylinder extends Shape {
  constructor(args) {
    super(args);
  }

  getGeometry() {
    return new THREE.CylinderBufferGeometry(this.scale, this.scale, this.scale*5, 50);
  }
}

class Conus extends Shape {
  constructor(args) {
    super(args);
  }

  getGeometry() {
    return new THREE.ConeBufferGeometry(this.scale, this.scale*3, 50);
  }
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);
scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(400, 200, 0);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;
controls.autoRotate = true;

const lights = [
    {color: 0xffffff, position: {x: 1, y: 1, z: 1}},
    {color: 0x002288, position: {x: -1, y: -1, z: -1}},
    {color: 0xc4c4c4, position: {x: 0, y: -1, z: 1}},
    {color: 0x222222, position: {x: 0, y: 1, z: 0}},
    {color: 0x224488, position: {x: 0, y: -1, z: 1}},
    {color: 0xee4488, position: {x: -1, y: -1, z: 1}}
  ]
  .map(({color, position}) => {
    const light = new THREE.DirectionalLight(color);
    light.position.set(position.x, position.y, position.z);
    scene.add(light);
  });


function animate() {
  requestAnimationFrame( animate );
  renderer.render( scene, camera );
}
animate();
document.body.appendChild( renderer.domElement );

function addObject(type) {
  const object = {
    'cube': ()=> new Cube({scale, color: 0xff0000, coords: getRandomCoords()}).create(),
    'sphere': ()=> new Sphere({scale, color: 0x00ff00, coords: getRandomCoords()}).create(),
    'cylinder': ()=> new Cylinder({scale, color: 0x0000ff, coords: getRandomCoords()}).create(),
    'cone': ()=> new Conus({scale, color: 0x00ffff, coords: getRandomCoords()}).create(),
  }[type]();
  items.push(object);
  scene.add( object.getMesh() );
}