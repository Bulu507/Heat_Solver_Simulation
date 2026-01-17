class Menu3 {
    constructor() {
      this.partitionX = 150;
      this.partitionY = 150;
      this.lengthX = 1.0;
      this.lengthY = 1.0;
      this.deltaX = this.lengthX / this.partitionX;
      this.deltaY = this.lengthY / this.partitionY;
      this.alpha = 0.01;
      this.deltaT = 0.0001;
      this.cellWidth = width / this.partitionX;
      this.cellHeight = height / this.partitionY;
      this.lastTemp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
      this.Temp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
      this.totalTime = 0;
      this.animationActive = false;
  
      // Membuat slider dan tombol dengan penempatan yang disesuaikan
      this.centerTempSlider = createSlider(0, 100, 100);
      this.centerTempSlider.position(10, height + 20);
      this.outerTempSlider = createSlider(0, 100, 0);
      this.outerTempSlider.position(10, height + 50);
  
      this.startBtn = createButton('Mulai');
      this.startBtn.position(10, height + 80);
      this.startBtn.mousePressed(() => this.startSimulation());
  
      this.stopBtn = createButton('Berhenti');
      this.stopBtn.position(70, height + 80);
      this.stopBtn.mousePressed(() => this.stopSimulation());
    }
  
    startSimulation() {
      this.initialCondition(this.centerTempSlider.value(), this.outerTempSlider.value());
      this.totalTime = 0;
      this.lastTime = millis();
      this.animationActive = true;
    }
  
    stopSimulation() {
      this.animationActive = false;
    }
  
    initialCondition(centerTemp, outerTemp) {
      for (let i = 0; i <= this.partitionX; i++) {
        for (let j = 0; j <= this.partitionY; j++) {
          let x = i * this.deltaX;
          let y = j * this.deltaY;
          if (x >= 0.4 * this.lengthX && x <= 0.6 * this.lengthX && y >= 0.4 * this.lengthY && y <= 0.6 * this.lengthY) {
            this.lastTemp[i][j] = centerTemp;
          } else {
            this.lastTemp[i][j] = outerTemp;
          }
        }
      }
    }
  
    boundaryCondition(outerTemp) {
      for (let i = 0; i <= this.partitionX; i++) {
        this.lastTemp[i][0] = outerTemp;
        this.lastTemp[i][this.partitionY] = outerTemp;
      }
      for (let j = 0; j <= this.partitionY; j++) {
        this.lastTemp[0][j] = outerTemp;
        this.lastTemp[this.partitionX][j] = outerTemp;
      }
    }
  
    heat2dExplicit(centerTemp, outerTemp) {
      for (let i = 1; i < this.partitionX; i++) {
        for (let j = 1; j < this.partitionY; j++) {
          this.Temp[i][j] = this.lastTemp[i][j] + this.alpha * this.deltaT * (
            (this.lastTemp[i + 1][j] - 2 * this.lastTemp[i][j] + this.lastTemp[i - 1][j]) / this.deltaX ** 2 +
            (this.lastTemp[i][j + 1] - 2 * this.lastTemp[i][j] + this.lastTemp[i][j - 1]) / this.deltaY ** 2
          );
        }
      }
      this.boundaryCondition(outerTemp);
      for (let i = 0; i <= this.partitionX; i++) {
        for (let j = 0; j <= this.partitionY; j++) {
          this.lastTemp[i][j] = this.Temp[i][j];
        }
      }
    }
  
    TemptoColor(temp) {
      const Tmin = 0;
      const Tmax = 100;
      const ratio = Math.min(Math.max((temp - Tmin) / (Tmax - Tmin), 0), 1);
      const blue = color(0, 0, 255);
      const red = color(255, 0, 0);
      return lerpColor(blue, red, ratio);
    }
  
    drawHeatMap() {
      for (let i = 0; i <= this.partitionX; i++) {
        for (let j = 0; j <= this.partitionY; j++) {
          fill(this.TemptoColor(this.lastTemp[i][j]));
          noStroke();
          rect(i * this.cellWidth, j * this.cellHeight, this.cellWidth, this.cellHeight);
        }
      }
    }
  
    draw() {
      if (this.animationActive) {
        let currentTime = millis();
        let deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.totalTime += deltaTime;
  
        this.heat2dExplicit(this.centerTempSlider.value(), this.outerTempSlider.value());
        this.drawHeatMap();
      } else {
        this.drawHeatMap();
      }
      
      // Tampilkan waktu di pojok kiri atas kanvas
      fill(0);
      textSize(14);
      textAlign(LEFT);
      text(`Waktu: ${this.totalTime.toFixed(3)} detik`, 10, 20);
    }
  }
  
  let menu3;
  
  function setup() {
    createCanvas(400, 400);
    menu3 = new Menu3();
  }
  
  function draw() {
    background(255);
    menu3.draw();
  }
  