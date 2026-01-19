class Menu2 {
  #diffAr;

  constructor(onMenuChange) {
    this.onMenuChange = onMenuChange;

    // ===== WINDOW =====
    this.windowWidth = 300;
    this.windowHeight = 300;
    this.windowSize = [this.windowWidth, this.windowHeight];
    this.windowCenterX = 250;
    this.windowCenterY = height / 2 - this.windowHeight / 2 - 100;

    this.windowPos = [this.windowCenterX, this.windowCenterY];
    this.windowTopLeft = [this.windowPos[0], this.windowPos[1]];
    this.windowTopRight = [
      this.windowPos[0] + this.windowWidth,
      this.windowPos[1],
    ];
    this.windowBottomLeft = [
      this.windowPos[0],
      this.windowPos[1] + this.windowHeight,
    ];
    this.windowBottomRight = [
      this.windowPos[0] + this.windowWidth,
      this.windowPos[1] + this.windowHeight,
    ];

    // ===== GRID =====
    this.partitionX = 100;
    this.partitionY = 100;
    this.cellWidth = this.windowWidth / this.partitionX;
    this.cellHeight = this.windowHeight / this.partitionY;

    // ===== PROBE LINE (STEP 1) =====
    this.selectedYIndex = Math.floor(this.partitionY / 2);
    this.isProbeLocked = false;
    this.isDraggingProbe = false;

    // ===== PHYSICS =====
    this.lengthX = 1.0;
    this.lengthY = 1.0;
    this.deltaX = this.lengthX / this.partitionX;
    this.deltaY = this.lengthY / this.partitionY;
    this.deltaT = 0.00001;

    this.Tkiri = 0;
    this.Tkanan = 100;

    this.Temp = Array.from({ length: this.partitionX + 1 }, () =>
      Array(this.partitionY + 1).fill(0),
    );
    this.lastTemp = Array.from({ length: this.partitionX + 1 }, () =>
      Array(this.partitionY + 1).fill(0),
    );
    this.#diffAr = Array.from({ length: this.partitionX + 1 }, () =>
      Array(this.partitionY + 1).fill(0),
    );

    // ===== STATE =====
    this.isPlaying = false;
    this.isRunning = false;

    // ===== UI =====
    this.thermostats = new Thermostats({
      topY: this.windowTopLeft[1],
    });

    this.TempPanelCenter();
    this.TempPanelOuter();
    this.ButtonPanel();
    this.TimePanel();
    this.ButtonBack();

    this.GetDiffusivityArray(0.1, 0.9);
  }

  // ==================================================
  // DISPLAY LOOP
  // ==================================================
  display() {
    // === BASE LAYER ===
    this.WindowPanel();

    // === SIMULATION ===
    if (!this.isRunning) {
      this.SetInitialTemp(
        this.tempSliderCenter.getValue(),
        this.tempSliderOuter.getValue(),
      );
    }

    if (this.isRunning) {
      this.tempSliderCenter.disabled();
      this.tempSliderOuter.disabled();
    } else {
      this.tempSliderCenter.enabled();
      this.tempSliderOuter.enabled();
    }

    if (this.isPlaying) {
      this.playButton.attribute("disabled", "");
      this.pauseButton.removeAttribute("disabled");
      this.heat2dExplicit(this.tempSliderOuter.getValue());
    } else {
      this.playButton.removeAttribute("disabled");
      this.pauseButton.attribute("disabled", "");
    }

    // === HEATMAP ===
    this.drawHeatMap();

    // === UI OVERLAY (PALING AKHIR) ===
    this.drawProbeLine();
    this.timePanel.display(this);
    this.thermostats.display();
    this.tempSliderCenter.display();
    this.tempSliderOuter.display();

    // this.drawTooltip();
  }

  // ==================================================
  // MOUSE HANDLER (STEP 2)
  // ==================================================
  handleMousePressed(mx, my) {
    if (this.isRunning || this.isProbeLocked) return;

    if (
      mx >= this.windowTopLeft[0] &&
      mx <= this.windowBottomRight[0] &&
      my >= this.windowTopLeft[1] &&
      my <= this.windowBottomRight[1]
    ) {
      let localY = my - this.windowTopLeft[1];
      let j = Math.floor(localY / this.cellHeight);
      this.selectedYIndex = constrain(j, 0, this.partitionY);
    }
  }

  // ==================================================
  // PROBE LINE DRAW (STEP 3)
  // ==================================================
  drawProbeLine() {
    let y = this.windowTopLeft[1] + this.selectedYIndex * this.cellHeight;

    stroke(255,255, 255);
    strokeWeight(2);
    line(this.windowTopLeft[0] +1, y, this.windowTopRight[0], y);
    noStroke();
    fill(0);
    triangle(this.windowTopLeft[0], y, this.windowTopLeft[0] - 10, y - 5, this.windowTopLeft[0] - 10, y + 5);
    triangle(this.windowTopRight[0], y, this.windowTopRight[0] + 10, y - 5, this.windowTopRight[0] + 10, y + 5);
  }

  // ==================================================
  // DATA EXTRACTION (STEP 5)
  // ==================================================
  getHorizontalTemperatureProfile() {
    let row = [];
    for (let i = 0; i <= this.partitionX; i++) {
      row.push(this.Temp[i][this.selectedYIndex]);
    }
    return row;
  }

  // ==================================================
  // SOLVER (UNCHANGED)
  // ==================================================
  BoundaryCondition(outerTemp) {
    for (let i = 0; i <= this.partitionX; i++) {
      this.Temp[i][0] = outerTemp;
      this.Temp[i][this.partitionY] = outerTemp;
      this.lastTemp[i][0] = outerTemp;
      this.lastTemp[i][this.partitionY] = outerTemp;
    }
    for (let j = 0; j <= this.partitionY; j++) {
      this.Temp[0][j] = outerTemp;
      this.Temp[this.partitionX][j] = outerTemp;
      this.lastTemp[0][j] = outerTemp;
      this.lastTemp[this.partitionX][j] = outerTemp;
    }
  }

  SetInitialTemp(centerTemp, outerTemp) {
    for (let i = 1; i < this.partitionX; i++) {
      for (let j = 1; j < this.partitionY; j++) {
        let isCenter =
          i > this.partitionX * 0.3 &&
          i < this.partitionX * 0.7 &&
          j > this.partitionY * 0.3 &&
          j < this.partitionY * 0.7;

        let val = isCenter ? centerTemp : outerTemp;
        this.Temp[i][j] = val;
        this.lastTemp[i][j] = val;
      }
    }
    this.BoundaryCondition(outerTemp);
  }

  GetDiffusivityArray(v1, v2) {
    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        this.#diffAr[i][j] =
          i > this.partitionX * 0.3 &&
          i < this.partitionX * 0.7 &&
          j > this.partitionY * 0.3 &&
          j < this.partitionY * 0.7
            ? v1
            : v2;
      }
    }
  }

  heat2dExplicit(outerTemp) {
    let ax = this.deltaT / (2 * this.deltaX ** 2);
    let ay = this.deltaT / (2 * this.deltaY ** 2);

    this.BoundaryCondition(outerTemp);

    for (let i = 1; i < this.partitionX; i++) {
      for (let j = 1; j < this.partitionY; j++) {
        this.Temp[i][j] =
          this.lastTemp[i][j] +
          ax *
            (this.lastTemp[i + 1][j] -
              2 * this.lastTemp[i][j] +
              this.lastTemp[i - 1][j]) +
          ay *
            (this.lastTemp[i][j + 1] -
              2 * this.lastTemp[i][j] +
              this.lastTemp[i][j - 1]);
      }
    }

    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        this.lastTemp[i][j] = this.Temp[i][j];
      }
    }
  }

  drawHeatMap() {
    noStroke();
    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        let x = this.windowPos[0] + i * this.cellWidth;
        let y = this.windowPos[1] + j * this.cellHeight;
        fill(this.TemptoColor(this.Temp[i][j]));
        rect(x, y, this.cellWidth, this.cellHeight);
      }
    }
  }

  drawTooltip() {
    if (this.isRunning) return;

    // Cek apakah mouse di dalam window
    if (
      mouseX < this.windowPos[0] ||
      mouseX > this.windowPos[0] + this.windowSize[0] ||
      mouseY < this.windowPos[1] ||
      mouseY > this.windowPos[1] + this.windowSize[1]
    )
      return;

    // === HITUNG INDEX GRID (PIXEL → CELL) ===
    let i = Math.floor((mouseX - this.windowPos[0]) / this.cellWidth);
    let j = Math.floor((mouseY - this.windowPos[1]) / this.cellHeight);

    i = constrain(i, 0, this.partitionX);
    j = constrain(j, 0, this.partitionY);

    // === AMBIL DATA TERBARU ===
    let temp = this.Temp[i][j];

    // === TOOLTIP UI ===
    let dialogW = 160;
    let dialogH = 45;

    let px = mouseX + 12;
    let py = mouseY - dialogH - 12;

    fill(255);
    stroke(0);
    strokeWeight(1);
    rect(px, py, dialogW, dialogH, 6);

    noStroke();
    fill(0);
    textSize(13);
    textAlign(LEFT, TOP);
    // text(`X : ${i}\nY : ${j}\nT : ${temp.toFixed(2)} °C`, px + 8, py + 6);
    text(`Y : ${j}`, px + 8, py + 6);
  }

  WindowPanel() {
    noStroke();
    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        let x = this.windowPos[0] + i * this.cellWidth;
        let y = this.windowPos[1] + j * this.cellHeight;
        fill(this.TemptoColor(this.lastTemp[i][j]));
        rect(x, y, this.cellWidth, this.cellHeight);
      }
    }
  }

  TempPanelCenter() {
    let posX = this.windowTopLeft[0] - 40;
    let posY = this.windowBottomLeft[1];
    this.tempSliderCenter = new PanelSliderVertical({
      props: this,
      x: posX,
      y: posY,
      initial: 100,
      label: "Suhu Titik Tengah",
    });
    this.tempSliderCenter.create();
  }

  TempPanelOuter() {
    let posX = this.windowTopRight[0] + 40;
    let posY = this.windowBottomLeft[1];
    this.tempSliderOuter = new PanelSliderVertical({
      props: this,
      x: posX,
      y: posY,
      initial: 0,
      label: "Suhu Bagian Luar",
    });
    this.tempSliderOuter.create();
  }

  TemptoColor(temp) {
    let deltaT = this.Tkanan - this.Tkiri;
    if (temp == null) return [255, 255, 255];
    if (deltaT === 0) return [255, 255, 255]; // Menghindari pembagian dengan nol
    let r = (255 * (temp - 0)) / deltaT;
    let g = 0;
    let b = (255 * (100 - temp)) / deltaT;
    return [r, g, b];
  }

  TimePanel() {
    this.timePanel = new TimerPanel({
      props: this,
      x: this.windowPos[0],
      y: this.windowPos[1] - 30,
    });
  }

  ButtonPanel() {
    let posX = this.windowCenterX;
    let posY = this.windowBottomLeft[1] + 150;

    this.playButton = createButton("▶");
    this.playButton.position(posX, posY);
    this.playButton.style("background-color", "#4CAF50");
    this.playButton.style("width", "90px");
    this.playButton.style("height", "45px");
    this.playButton.mouseClicked(() => {
      if (!this.isRunning) {
        this.isRunning = true;
      }

      this.isPlaying = true;
      this.timePanel.start();
    });

    posX += 100;
    this.pauseButton = createButton("▐▐");
    this.pauseButton.position(posX, posY);
    this.pauseButton.style("background-color", "#ffc107");
    this.pauseButton.style("width", "90px");
    this.pauseButton.style("height", "45px");
    this.pauseButton.mouseClicked(() => {
      this.isPlaying = false;
      this.timePanel.pause();
    });

    posX += 100;
    this.resetButton = createButton("↻");
    this.resetButton.position(posX, posY);
    this.resetButton.style("width", "90px");
    this.resetButton.style("height", "45px");
    this.resetButton.style("background-color", "#dc3545");
    this.resetButton.mousePressed(() => {
      this.isPlaying = false;
      this.isRunning = false;

      this.timePanel.reset();

      this.Temp = Array.from({ length: this.partitionX + 1 }, () =>
        Array(this.partitionY + 1).fill(0),
      );

      this.lastTemp = Array.from({ length: this.partitionX + 1 }, () =>
        Array(this.partitionY + 1).fill(0),
      );

      this.tempSliderCenter.setValue(100);
      this.tempSliderOuter.setValue(0);
    });
  }

  ButtonBack() {
    this.buttonBack = createButton("Kembali");
    this.buttonBack.position(20, 20);
    this.buttonBack.style("width", "100px");
    this.buttonBack.style("background-color", "#dc3545");
    this.buttonBack.mousePressed(() => {
      this.onMenuChange("home");

      // clean all tags
      let sliders = selectAll("input");
      sliders.forEach((slider) => slider.remove());

      let buttons = selectAll("button");
      buttons.forEach((button) => button.remove());

      let dropdowns = selectAll("select");
      dropdowns.forEach((dropdown) => dropdown.remove());
    });
  }

  handleMousePressed(mx, my) {
        if (this.isRunning || this.isProbeLocked) return;

        let lineY =
            this.windowTopLeft[1] +
            this.selectedYIndex * this.cellHeight;

        let tolerance = 6;

        if (
            mx >= this.windowTopLeft[0] &&
            mx <= this.windowBottomRight[0] &&
            Math.abs(my - lineY) <= tolerance
        ) {
            this.isDraggingProbe = true;
        }
    }

    handleMouseDragged(mx, my) {
        if (!this.isDraggingProbe) return;
        if (this.isRunning || this.isProbeLocked) return;

        let localY = my - this.windowTopLeft[1];
        let j = Math.floor(localY / this.cellHeight);

        this.selectedYIndex = constrain(j, 0, this.partitionY);
    }

    handleMouseReleased() {
        this.isDraggingProbe = false;
    }
}
