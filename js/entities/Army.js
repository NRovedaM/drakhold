export class Army {
  constructor(origin, destination, units) {
    this.origin = origin;
    this.destination = destination;
    this.units = units;

    this.owner = origin.owner;

    // O tipo de unidade depende da torre de origem
    this.type = origin.unitType;

    this.progress = 0;

    // Dragões voam mais rápido que soldados
    this.speed = this.type === "dragon" ? 120 : 80;
  }

  update(deltaTime, mapWidth, mapHeight) {
    const dx = ((this.destination.x - this.origin.x) / 100) * mapWidth;

    const dy = ((this.destination.y - this.origin.y) / 100) * mapHeight;

    const distance = Math.hypot(dx, dy);

    if (distance === 0) {
      this.progress = 1;
      this.finished = true;
      return;
    }

    this.progress += (this.speed * deltaTime) / distance;

    if (this.progress >= 1) {
      this.progress = 1;
      this.finished = true;
    }
  }

  getPosition(mapWidth, mapHeight) {
    const x1 = (this.origin.x / 100) * mapWidth;
    const y1 = (this.origin.y / 100) * mapHeight;

    const x2 = (this.destination.x / 100) * mapWidth;
    const y2 = (this.destination.y / 100) * mapHeight;

    return {
      x: x1 + (x2 - x1) * this.progress,
      y: y1 + (y2 - y1) * this.progress,
    };
  }
}
