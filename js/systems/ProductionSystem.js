
export class ProductionSystem {
    constructor(towers) {
        this.towers = towers;
    }

    update(deltaTime) {
        this.towers.forEach(tower => {

            // Torres neutras não produzem
            if (tower.owner === "neutral") {
                return;
            }

            // Capacidade máxima atingida
            if (tower.units >= tower.capacity) {
                tower.productionTimer = 0;
                return;
            }

            // Acumula o tempo decorrido
            tower.productionTimer += deltaTime;

            // Produz enquanto houver tempo suficiente
            while (
                tower.productionTimer >= tower.productionTime &&
                tower.units < tower.capacity
            ) {
                tower.units++;

                tower.productionTimer -= tower.productionTime;
            }
        });
    }
}
