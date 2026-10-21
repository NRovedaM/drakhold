
export class InputController {    
    constructor(canvas, towers, movementSystem) {
        this.canvas = canvas;
        this.towers = towers;
        this.movementSystem = movementSystem;

        this.selectedTower = null;
        this.sendPercentage = 50;

        this.canvas.addEventListener("click", event => {
            this.handleClick(event);
        });
    }


    getMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    findTowerAt(x, y) {
        const radius = 35;

        return this.towers.find(tower => {
            const towerX = (tower.x / 100) * this.canvas.width;
            const towerY = (tower.y / 100) * this.canvas.height;

            const distance = Math.hypot(
                x - towerX,
                y - towerY
            );

            return distance <= radius;
        });
    }
   
    handleClick(event) {
        const position = this.getMousePosition(event);

        const tower = this.findTowerAt(
            position.x,
            position.y
        );

        if (!tower) {
            this.selectedTower = null;
            return;
        }

        if (!this.selectedTower) {
            this.selectedTower = tower;
            return;
        }

        if (this.selectedTower.id === tower.id) {
            this.selectedTower = null;
            return;
        }

        const sent = this.movementSystem.sendArmy(
            this.selectedTower,
            tower,
            this.sendPercentage
        );

        if (!sent) {
            this.selectedTower = tower;
        } else {
            this.selectedTower = null;
        }
    }
}
