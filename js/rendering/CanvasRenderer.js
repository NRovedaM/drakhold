export class CanvasRenderer {
  constructor(canvas) {
    this.canvas = canvas;

    // Contexto responsável pelos desenhos 2D
    this.ctx = canvas.getContext("2d");

    if (!this.ctx) {
      throw new Error("Não foi possível iniciar o Canvas 2D.");
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawTest() {
    const ctx = this.ctx;

    // Desenha um círculo azul
    ctx.beginPath();

    ctx.arc(
      300, // Posição horizontal
      300, // Posição vertical
      35, // Raio
      0, // Ângulo inicial
      Math.PI * 2, // Volta completa
    );

    ctx.fillStyle = "#2878d0";
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Desenha o número da torre
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText("30", 300, 300);
  }

  drawTower(tower, isSelected = false) {
    const ctx = this.ctx;

    // Converte porcentagens em coordenadas do Canvas
    const x = (tower.x / 100) * this.canvas.width;
    const y = (tower.y / 100) * this.canvas.height;

    const colors = {
      player: "#2878d0",
      enemy: "#c0392b",
      neutral: "#777777",
    };

    // Desenha o corpo da torre
    ctx.beginPath();
    ctx.arc(x, y, 35, 0, Math.PI * 2);

    ctx.fillStyle = colors[tower.owner];
    ctx.fill();

    // Contorno
    ctx.strokeStyle = isSelected ? "#f1c40f" : "#ffffff";
    ctx.lineWidth = isSelected ? 6 : 3;
    ctx.stroke();

    // Quantidade de unidades
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(tower.units, x, y);
  }

  drawPaths(towers) {
    const ctx = this.ctx;
    const renderedPaths = new Set();

    towers.forEach((tower) => {
      tower.connections.forEach((connectionId) => {
        const destination = towers.find((item) => item.id === connectionId);

        if (!destination) return;

        const pathId = [tower.id, destination.id]
          .sort((a, b) => a - b)
          .join("-");

        if (renderedPaths.has(pathId)) return;

        renderedPaths.add(pathId);

        const x1 = (tower.x / 100) * this.canvas.width;
        const y1 = (tower.y / 100) * this.canvas.height;

        const x2 = (destination.x / 100) * this.canvas.width;
        const y2 = (destination.y / 100) * this.canvas.height;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);

        ctx.strokeStyle = "#b79b72";
        ctx.lineWidth = 12;
        ctx.lineCap = "round";
        ctx.stroke();
      });
    });
  }

  drawArmy(army) {
    const ctx = this.ctx;

    const position = army.getPosition(this.canvas.width, this.canvas.height);

    ctx.beginPath();

    if (army.type === "dragon") {
      // Losango representando um dragão
      ctx.moveTo(position.x, position.y - 16);
      ctx.lineTo(position.x + 16, position.y);
      ctx.lineTo(position.x, position.y + 16);
      ctx.lineTo(position.x - 16, position.y);
      ctx.closePath();
    } else {
      // Círculo representando soldados
      ctx.arc(position.x, position.y, 12, 0, Math.PI * 2);
    }

    const colors = {
      player: "#9ed4ff",
      enemy: "#ff8b80",
      neutral: "#cccccc",
    };

    ctx.fillStyle = colors[army.owner];
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#17212b";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(army.units, position.x, position.y);
  }
}
