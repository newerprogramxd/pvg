const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = 900;
canvas.height = 500;

const sprites = {
  alcoholico: new Image(),
  camote: new Image(),
  chicharito: new Image(),
  gatoNormal: new Image(),
  gatoBandera: new Image(),
  gatoCono: new Image(),
  gatoCubeta: new Image(),
  caguama: new Image(),
  guisante: new Image(),
  fondo: new Image()
};

// Usa tus .gif reales cuando los tengas
sprites.alcoholico.src = "assets/alcoholico.gif";
sprites.camote.src = "assets/camote.gif";
sprites.chicharito.src = "assets/chicharito.gif";
sprites.gatoNormal.src = "assets/gatoNormal.gif";
sprites.gatoBandera.src = "assets/gatoBandera.gif";
sprites.gatoCono.src = "assets/gatoCono.gif";
sprites.gatoCubeta.src = "assets/gatoCubeta.gif";
sprites.caguama.src = "assets/caguama.gif";
sprites.guisante.src = "assets/guisante.gif";
sprites.fondo.src = "assets/02.jpeg";

let soles = 0;
let plantas = [];
let gatos = [];
let proyectiles = [];
let intervalId;

// 🔹 Barra de vida
function drawHealthBar(x, y, width, hp, maxHp) {
  ctx.fillStyle = "red";
  ctx.fillRect(x, y - 10, width, 5);
  ctx.fillStyle = "green";
  ctx.fillRect(x, y - 10, (width * hp) / maxHp, 5);
}

// 🔹 Cuadrícula
function drawGrid() {
  const cellSize = 100;
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  for (let x = 0; x < canvas.width; x += cellSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += cellSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

let caguamas = [];

// 🔹 Clases
class Alcoholico {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.hp = 100;
    this.maxHp = 100;
    this.cooldown = 0;
  }
  draw() {
    ctx.drawImage(sprites.alcoholico, this.x, this.y, this.width, this.height);
    drawHealthBar(this.x, this.y, this.width, this.hp, this.maxHp);
  }
  update() {
    this.cooldown++;
    if (this.cooldown > 200) {
      caguamas.push({x: this.x + 20, y: this.y + 20, size: 40});
      this.cooldown = 0;
    }
    this.draw();
  }
}


class Camote {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.hp = 300;
    this.maxHp = 300;
  }
  draw() {
    ctx.drawImage(sprites.camote, this.x, this.y, this.width, this.height);
    drawHealthBar(this.x, this.y, this.width, this.hp, this.maxHp);
  }
  update() { this.draw(); }
}

class Chicharito {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.hp = 100;
    this.maxHp = 100;
    this.cooldown = 0;
  }
  draw() {
    ctx.drawImage(sprites.chicharito, this.x, this.y, this.width, this.height);
    drawHealthBar(this.x, this.y, this.width, this.hp, this.maxHp);
  }
  update() {
    this.cooldown++;
    if (this.cooldown > 100) {
      proyectiles.push(new Proyectil(this.x + 50, this.y + 20));
      this.cooldown = 0;
    }
    this.draw();
  }
}

class Proyectil {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20;
    this.speed = 5;
  }
  draw() {
    ctx.drawImage(sprites.guisante, this.x, this.y, this.width, this.height);
  }
  update() {
    this.x += this.speed;
    this.draw();
  }
}

class Gato {
  constructor(tipo, y) {
    this.x = canvas.width;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.speed = 1;
    this.hp = tipo === "cubeta" ? 300 : tipo === "cono" ? 200 : 100;
    this.maxHp = this.hp;
    this.sprite = sprites["gato" + tipo.charAt(0).toUpperCase() + tipo.slice(1)];
  }
  draw() {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
    drawHealthBar(this.x, this.y, this.width, this.hp, this.maxHp);
  }
  update() {
    this.x -= this.speed;
    this.draw();
  }
}

// 🔹 Spawner
function spawnGato() {
  const tipos = ["Normal", "Bandera", "Cono", "Cubeta"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const y = Math.floor(Math.random() * 5) * 100;
  gatos.push(new Gato(tipo.toLowerCase(), y));
}

// 🔹 Loop principal
function updateGame() {
  ctx.drawImage(sprites.fondo, 0, 0, canvas.width, canvas.height);
  drawGrid(); // cuadrícula

  plantas.forEach(p => p.update());
  proyectiles.forEach((proj, i) => {
    proj.update();
    gatos.forEach((gato, j) => {
      if (
        proj.x < gato.x + gato.width &&
        proj.x + proj.width > gato.x &&
        proj.y < gato.y + gato.height &&
        proj.y + proj.height > gato.y
      ) {
        gato.hp -= 25;
        proyectiles.splice(i, 1);
        if (gato.hp <= 0) gatos.splice(j, 1);
      }
    });
  });
  gatos.forEach(g => g.update());

  requestAnimationFrame(updateGame);
}

function startGame() {
  intervalId = setInterval(spawnGato, 3000); // cada 3 segundos
  updateGame();
}
startGame();

function plantar(tipo) {
  // Calcula una celda de la cuadrícula (100px)
  const x = Math.floor(Math.random() * 5) * 100;
  const y = Math.floor(Math.random() * 5) * 100;

  if (tipo === "alcoholico") {
    plantas.push(new Alcoholico(x, y));
  } else if (tipo === "camote") {
    plantas.push(new Camote(x, y));
  } else if (tipo === "chicharito") {
    plantas.push(new Chicharito(x, y));
  }
}
