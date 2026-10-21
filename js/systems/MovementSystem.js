import { Army } from "../entities/Army.js";

export class MovementSystem {
    constructor(pathSystem, mapWidth, mapHeight) {
        this.pathSystem = pathSystem;
        this.mapWidth = mapWidth;
        this.mapHeight = mapHeight;

        this.armies = [];
    }

    sendArmy(origin, destination, percentage) {
        if (origin.owner !== "player") return false;
  
        // Soldados precisam de uma estrada direta.
        // Dragões ignoram as conexões terrestres.
        if (
            origin.unitType === "soldier" &&
            !this.pathSystem.canMove(origin, destination)
        ) {
            return false;
        }


        const units = Math.floor(
            origin.units * percentage / 100
        );

        if (units <= 0) return false;

        origin.units -= units;

        const army = new Army(origin, destination, units);

        this.armies.push(army);

        return true;
    }

    update(deltaTime) {
        this.armies.forEach(army => {
            army.update(
                deltaTime,
                this.mapWidth,
                this.mapHeight
            );

            if (army.finished) {
                this.resolveArrival(army);
            }
        });

        // Remove os exércitos que chegaram
        this.armies = this.armies.filter(
            army => !army.finished
        );
    }

    resolveArrival(army) {
        const destination = army.destination;

        // Reforço de torre aliada
        if (destination.owner === army.owner) {
            destination.units += army.units;
            return;
        }

        // Combate contra torre neutra ou inimiga
        const attackers = army.units;
        const defenders = destination.units;

        if (attackers > defenders) {
            // Vitória dos atacantes
            destination.owner = army.owner;
            destination.units = attackers - defenders;

            // Reinicia a produção para o novo proprietário
            destination.productionTimer = 0;

            console.log(
                `Torre ${destination.id} conquistada!`
            );
        } else {
            // Vitória dos defensores ou empate
            destination.units = defenders - attackers;

            console.log(
                `Ataque à torre ${destination.id} defendido!`
            );
        }
    }

}
