
import { Tower } from "./entities/Tower.js";
import { PathSystem } from "./systems/PathSystem.js";
import { ProductionSystem } from "./systems/ProductionSystem.js";
import { CanvasRenderer } from "./rendering/CanvasRenderer.js";
import { InputController } from "./input/InputController.js";
import { MovementSystem } from "./systems/MovementSystem.js";

const canvas = document.getElementById("game-canvas");

const renderer = new CanvasRenderer(canvas);
const gameStatus = document.getElementById("game-status");

const towers = [
    new Tower(1, 20, 50, "terrestrial", "player", 30),
    new Tower(2, 50, 25, "common", "neutral", 15),
    new Tower(3, 80, 50, "dragon", "player", 10)
];

const pathSystem = new PathSystem(towers);
const movementSystem = new MovementSystem(
    pathSystem,
    canvas.width,
    canvas.height
);
const inputController = new InputController(
    canvas,
    towers,
    movementSystem
);
const productionSystem = new ProductionSystem(towers);


// Criando as conexões
pathSystem.connect(towers[0], towers[1]);
pathSystem.connect(towers[1], towers[2]);

let lastTime = null;

function gameLoop(currentTime) {
    if (lastTime === null) {
        lastTime = currentTime;
    }

    const deltaTime = Math.min(
        (currentTime - lastTime) / 1000,
        0.1
    );

    lastTime = currentTime;

    // Atualiza a lógica do jogo
    productionSystem.update(deltaTime);
    movementSystem.update(deltaTime);

    // Limpa a superfície
    renderer.clear();

    // Desenha primeiro as estradas
    renderer.drawPaths(towers);

    // Desenha as torres sobre as estradas
    
    towers.forEach(tower => {
        const isSelected =
            inputController.selectedTower?.id === tower.id;

        renderer.drawTower(tower, isSelected);
    });

    movementSystem.armies.forEach(army => {
        renderer.drawArmy(army);
    });

    const selected = inputController.selectedTower;

    if (selected) {
        gameStatus.textContent =
            `Torre ${selected.id} | ${selected.type} | ` +
            `Unidades: ${selected.units}/${selected.capacity}`;
    } else {
        gameStatus.textContent = "Selecione uma torre";
    }


    const percentageButtons = document.querySelectorAll(
        "#send-controls button"
    );

    percentageButtons.forEach(button => {
        button.addEventListener("click", () => {
            const percentage = Number(
                button.dataset.percentage
            );

            inputController.sendPercentage = percentage;

            percentageButtons.forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
        });
    });


    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
