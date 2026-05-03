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

sprites.alcoholico.src = "assets/alcoholico.jpg";
sprites.camote.src = "assets/camote.jpg";
sprites.chicharito.src = "assets/chicharito.jpg";
sprites.gatoNormal.src = "assets/gatoNormal.jpg";
sprites.gatoBandera.src = "assets/gatoBandera.jpg";
sprites.gatoCono.src = "assets/gatoCono.jpg";
sprites.gatoCubeta.src = "assets/gatoCubeta.jpg";
sprites.caguama.src = "assets/caguama.jpg";
sprites.guisante.src = "assets/guisante.jpg";
sprites.fondo.src = "assets/02.jpeg";

let soles = 0;
let plantas = [];
let gatos = [];
let proyectiles = [];
let intervalId;

class Alcoholico {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.hp = 100;
    this.cooldown = 0;
  }
  draw() {
    ctx.drawImage(sprites.alcoholico, this.x, this.y, this.width, this.height);
  }
  update() {
    this.cooldown++;
    if (this.cooldown > 200) {
      soles += 50; 
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
  }
  draw() {
    ctx.drawImage(sprites.camote, this.x, this.y, this.width, this.height);
  }
  update() {
    this.draw();
  }
}

class Chicharito {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 80;
    this.height = 80;
    this.hp = 100;
    this.cooldown = 0;
  }
  draw() {
    ctx.drawImage(sprites.chicharito, this.x, this.y, this.width, this.height);
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
    this.sprite = sprites["gato" + tipo.charAt(0).toUpperCase() + tipo.slice(1)];
  }
  draw() {
    ctx.drawImage(this.sprite, this.x, this.y, this.width, this.height);
  }
  update() {
    this.x -= this.speed;
    this.draw();
  }
}

function spawnGato() {
  const tipos = ["Normal", "Bandera", "Cono", "Cubeta"];
  const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  const y = Math.floor(Math.random() * 5) * 100;
  gatos.push(new Gato(tipo.toLowerCase(), y));
}

function updateGame() {
  ctx.drawImage(sprites.fondo, 0, 0, canvas.width, canvas.height);

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
  intervalId = setInterval(spawnGato, 3000);
  updateGame();
}

startGame();
