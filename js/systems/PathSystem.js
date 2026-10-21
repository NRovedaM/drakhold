
export class PathSystem {
    constructor(towers) {
        this.towers = towers;
    }

    connect(towerA, towerB) {
        towerA.addConnection(towerB.id);
        towerB.addConnection(towerA.id);
    }

    canMove(origin, destination) {
        return origin.isConnected(destination.id);
    }
}
