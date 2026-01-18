// components/thermostats.js
class Thermostats {
  constructor({
    topY = 0,
    leftX = 50,
    panelWidth = 20,
    panelHeight = 300,
    partition = 100
  } = {}) {
    this.panelWidth = panelWidth;
    this.panelHeight = panelHeight;

    this.topY = topY;
    this.bottomY = this.topY + this.panelHeight;

    this.leftX = leftX;
    this.rightX = this.leftX + this.panelWidth;

    this.partition = partition;
    this.partHeight = this.panelHeight / this.partition;
  }

  /* =============================
   * POSITION HELPERS
   * ============================= */

  getTopLeft() {
    return { x: this.leftX, y: this.topY };
  }

  getTopRight() {
    return { x: this.rightX, y: this.topY };
  }

  getBottomLeft() {
    return { x: this.leftX, y: this.bottomY };
  }

  getBottomRight() {
    return { x: this.rightX, y: this.bottomY };
  }

  /* Optional: semua sudut sekaligus */
  getCorners() {
    return {
      topLeft: this.getTopLeft(),
      topRight: this.getTopRight(),
      bottomLeft: this.getBottomLeft(),
      bottomRight: this.getBottomRight()
    };
  }

  /* =============================
   * RENDER
   * ============================= */

  display() {
    noStroke();

    for (let i = 0; i < this.partition; i++) {
      const y = i * this.partHeight + this.topY;

      // interpolasi warna (merah → biru)
      const t = i / this.partition;
      const r = lerp(255, 0, t);
      const g = 0;
      const b = lerp(0, 255, t);

      fill(r, g, b);
      rect(this.leftX, y, this.panelWidth, this.partHeight);

      if (i % 20 === 0) {
        // stroke(0);
        // line(this.leftX, y, this.rightX + 5, y);
        // noStroke();

        textAlign(LEFT, CENTER);
        fill(0);
        text(this.partition - i, this.rightX + 8, y);
      }
    }

    // garis bawah (0°C)
    // stroke(0);
    line(this.leftX, this.bottomY, this.rightX + 5, this.bottomY);

    noStroke();
    textAlign(LEFT, CENTER);
    fill(0);
    text("0", this.rightX + 8, this.bottomY);

    // judul
    textAlign(CENTER);
    text("Pita Suhu T (ºC)", this.leftX + this.panelWidth / 2, this.topY - 20);
  }
}
