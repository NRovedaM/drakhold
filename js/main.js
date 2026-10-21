import { Tower } from "./entities/Tower.js";
import { PathSystem } from "./systems/PathSystem.js";
import { ProductionSystem } from "./systems/ProductionSystem.js";

const gameStatus = document.getElementById("game-status");
const towerLayer = document.getElementById("tower-layer");
const mapPaths = document.getElementById("map-paths");

const towers = [
    new Tower(1, 20, 50, "terrestrial", "player", 30),
    new Tower(2, 50, 25, "common", "neutral", 15),
    new Tower(3, 80, 50, "dragon", "enemy", 10)
];


const pathSystem = new PathSystem(towers, mapPaths);
const productionSystem = new ProductionSystem(towers);

// Criando conexões bidirecionais
pathSystem.connect(towers[0], towers[1]);
pathSystem.connect(towers[1], towers[2]);


function createTowerElement(tower) {
    const element = document.createElement("button");

    element.id = `tower-${tower.id}`;
    element.classList.add("tower", tower.owner);
    element.type = "button";

    element.style.left = `${tower.x}%`;
    element.style.top = `${tower.y}%`;

    element.textContent = tower.units;

    element.addEventListener("click", () => {
        selectTower(tower, element);
    });

    towerLayer.appendChild(element);
}

function selectTower(tower, element) {
    document.querySelectorAll(".tower").forEach(item => {
        item.classList.remove("selected");
    });

    element.classList.add("selected");

    gameStatus.textContent =
        `Torre ${tower.id} | ${tower.type} | Unidades: ${tower.units}`;
}

function iniciarJogo() {

    pathSystem.render();
    
    towers.forEach(tower => {
        createTowerElement(tower);
    });

    gameStatus.textContent = "Selecione uma torre";
    requestAnimationFrame(gameLoop);
}

function updateTowerElements() {
    towers.forEach(tower => {
        const element = document.getElementById(
            `tower-${tower.id}`
        );

        if (element) {
            element.textContent = tower.units;
        }
    });
}


let lastTime = null;

function gameLoop(currentTime) {
    if (lastTime === null) {
        lastTime = currentTime;
    }

    // Converte milissegundos em segundos
    const deltaTime = Math.min(
        (currentTime - lastTime) / 1000,
        0.1
    );

    lastTime = currentTime;

    // Atualiza os sistemas
    productionSystem.update(deltaTime);

    // Atualiza os números na interface
    updateTowerElements();

    // Solicita o próximo quadro
    requestAnimationFrame(gameLoop);
}

iniciarJogo();
