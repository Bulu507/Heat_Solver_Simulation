class Menu2 {
  #diffAr;

  constructor(onMenuChange) {
    this.onMenuChange = onMenuChange;
    this.windowWidth = 300;
    this.windowHeight = 300;
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

    this.partitionX = 100;
    this.partitionY = 100;
    this.cellWidth = this.windowWidth / this.partitionX;
    this.cellHeight = this.windowHeight / this.partitionY;

    this.lengthX = 1.0;
    this.lengthY = 1.0;
    this.deltaX = this.lengthX / this.partitionX;
    this.deltaY = this.lengthY / this.partitionY;
    //this.alpha = 0.01;
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

    this.isPlaying = false;
    this.isRunning = false;

    this.thermostats = new Thermostats({
      topY: this.windowTopLeft[1],
    });
    this.TempPanelCenter();
    this.TempPanelOuter();
    this.ButtonPanel();
    this.TimePanel();
    this.ButtonBack();

    let centerX = Math.floor(this.partitionX / 2);
    let centerY = Math.floor(this.partitionY / 2);
    this.lastTemp[centerX][centerY] = 100;

    this.GetDiffusivityArray(0.1, 0.9);
  }

  display() {
    this.WindowPanel();
    this.timePanel.display(this);
    this.thermostats.display();
    this.tempSliderCenter.display();
    this.tempSliderOuter.display();

    // ===== INITIAL STATE =====
    if (!this.isRunning) {
      this.SetInitialTemp(
        this.tempSliderCenter.getValue(),
        this.tempSliderOuter.getValue(),
      );
    }

    // ===== RUNNING (LOCK STATE) =====
    if (this.isRunning) {
      this.tempSliderCenter.disabled();
      this.tempSliderOuter.disabled();
    } else {
      this.tempSliderCenter.enabled();
      this.tempSliderOuter.enabled();
    }

    // ===== PLAY =====
    if (this.isPlaying) {
      // ====== UI =======
      this.playButton.attribute("disabled", "");
      this.playButton.style("background-color", "#cccccc");
      this.playButton.style("color", "#666666");

      this.pauseButton.removeAttribute("disabled");
      this.pauseButton.style("background-color", "#ffc107");
      this.pauseButton.style("color", "#ffffff");

      this.heat2dExplicit(this.tempSliderOuter.getValue());
    } else {
      this.playButton.removeAttribute("disabled");
      this.playButton.style("background-color", "#4CAF50");
      this.playButton.style("color", "#ffffff");

      this.pauseButton.attribute("disabled", "");
      this.pauseButton.style("background-color", "#cccccc");
      this.pauseButton.style("color", "#666666");
    }

    // ===== DRAW =====
    this.drawHeatMap();
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

  BoundaryCondition(outerTemp) {
    for (let i = 0; i <= this.partitionX; i++) {
      this.lastTemp[i][0] = outerTemp;
      this.lastTemp[i][this.partitionY] = outerTemp;
      this.Temp[i][0] = outerTemp;
      this.Temp[i][this.partitionY] = outerTemp;
    }
    for (let j = 0; j <= this.partitionY; j++) {
      this.lastTemp[0][j] = outerTemp;
      this.lastTemp[this.partitionX][j] = outerTemp;
      this.Temp[0][j] = outerTemp;
      this.Temp[this.partitionX][j] = outerTemp;
    }
  }

  SetInitialTemp(centerTemp, outerTemp) {
    const centerXStart = Math.floor(this.partitionX * 0.3);
    const centerXEnd = Math.floor(this.partitionX * 0.7);
    const centerYStart = Math.floor(this.partitionY * 0.3);
    const centerYEnd = Math.floor(this.partitionY * 0.7);

    for (let i = 1; i < this.partitionX; i++) {
      for (let j = 1; j < this.partitionY; j++) {
        if (
          i >= centerXStart &&
          i <= centerXEnd &&
          j >= centerYStart &&
          j <= centerYEnd
        ) {
          this.Temp[i][j] = centerTemp;
          this.lastTemp[i][j] = centerTemp;
        } else {
          this.Temp[i][j] = outerTemp;
          this.lastTemp[i][j] = outerTemp;
        }
      }
    }

    this.BoundaryCondition(outerTemp);
  }

  GetDiffusivityArray(val1, val2) {
    const centerXStart = Math.floor(this.partitionX * 0.3);
    const centerXEnd = Math.floor(this.partitionX * 0.7);
    const centerYStart = Math.floor(this.partitionY * 0.3);
    const centerYEnd = Math.floor(this.partitionY * 0.7);

    // console.log("CEK DIFF Before initialization", [val1, val2]);

    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        if (
          i >= centerXStart &&
          i <= centerXEnd &&
          j >= centerYStart &&
          j <= centerYEnd
        ) {
          this.#diffAr[i][j] = val1;
        } else {
          this.#diffAr[i][j] = val2;
        }
      }
    }

    // console.log("CEK DIFF After initialization", this.#diffAr);
  }

  heat2dExplicit(outerTemp) {
    let alphaX = this.deltaT / (2 * this.deltaX ** 2);
    let alphaY = this.deltaT / (2 * this.deltaY ** 2);

    this.BoundaryCondition(outerTemp);

    for (let i = 1; i < this.partitionX; i++) {
      for (let j = 1; j < this.partitionY; j++) {
        this.Temp[i][j] =
          this.lastTemp[i][j] +
          alphaX *
            ((this.#diffAr[i + 1][j] + this.#diffAr[i][j]) *
              this.lastTemp[i + 1][j] -
              (this.#diffAr[i + 1][j] +
                2 * this.#diffAr[i][j] +
                this.#diffAr[i - 1][j]) *
                this.lastTemp[i][j] +
              (this.#diffAr[i][j] + this.#diffAr[i - 1][j]) *
                this.lastTemp[i - 1][j]) +
          alphaY *
            ((this.#diffAr[i][j + 1] + this.#diffAr[i][j]) *
              this.lastTemp[i][j + 1] -
              (this.#diffAr[i][j + 1] +
                2 * this.#diffAr[i][j] +
                this.#diffAr[i][j - 1]) *
                this.lastTemp[i][j] +
              (this.#diffAr[i][j] + this.#diffAr[i][j - 1]) *
                this.lastTemp[i][j - 1]);
      }
    }

    for (let i = 0; i <= this.partitionX; i++) {
      for (let j = 0; j <= this.partitionY; j++) {
        this.lastTemp[i][j] = this.Temp[i][j];
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
}
