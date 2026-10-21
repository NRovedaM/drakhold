import { TOWER_CONFIG } from "../config/towerConfig.js";

export class Tower {
    constructor(id, x, y, type, owner, units) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.type = type;
        this.owner = owner;
        this.units = units;
        this.level = 1;

        // Ids das torres conectadas diretamente
        this.connections = [];

        const config = TOWER_CONFIG[this.type];

        if (!config) {
            throw new Error(`Tipo de torre inválido: ${this.type}`);
        }

        this.capacity = config.capacity;
        this.productionTime = config.productionTime;
        this.unitType = config.unitType;

        // Tempo acumulado desde a última produção
        this.productionTimer = 0;

    }

    addConnection(towerId) {
        if (!this.connections.includes(towerId)) {
            this.connections.push(towerId);
        }
    }

    isConnected(towerId) {
        return this. connections.includes(towerId);
    }
}
