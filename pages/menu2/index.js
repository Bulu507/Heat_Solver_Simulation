class Menu2 {
    #diffAr;

    constructor(onMenuChange){
        this.onMenuChange = onMenuChange;
        this.windowWidth = 300;
        this.windowHeight = 300;
        this.windowCenterX = width / 2 - this.windowWidth / 2;
        this.windowCenterY = height / 2 - this.windowHeight / 2 - 100;
        this.windowPos = [this.windowCenterX, this.windowCenterY];
        
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
        this.Temp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
        this.lastTemp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
        this.#diffAr = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));

        this.isPlaying = false;

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

    display(){
        this.WindowPanel();
        this.tempSliderCenter.display();
        this.tempSliderOuter.display();
        this.timePanel.display(this);
        
        if (!this.isPlaying && this.timePanel.elapsedTime === 0) {
            this.SetInitialTemp(this.tempSliderCenter.getValue(), this.tempSliderOuter.getValue());
        }
        
        if (this.isPlaying) {
            this.heat2dExplicit(this.tempSliderOuter.getValue());
            
            this.drawHeatMap();
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

    WindowPanel(){
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

    SetInitialTemp(centerTemp, outerTemp)
    {
        const centerXStart = Math.floor(this.partitionX * 0.3);
        const centerXEnd = Math.floor(this.partitionX * 0.7);
        const centerYStart = Math.floor(this.partitionY * 0.3);
        const centerYEnd = Math.floor(this.partitionY * 0.7);

        for (let i = 1; i < this.partitionX; i++) {
            for (let j = 1; j < this.partitionY; j++) {
                if (i >= centerXStart && i <= centerXEnd && j >= centerYStart && j <= centerYEnd)
                {
                    this.Temp[i][j] = centerTemp;
                    this.lastTemp[i][j] = centerTemp;
                }
                else
                {
                    this.Temp[i][j] = outerTemp;
                    this.lastTemp[i][j] = outerTemp;
                }
            }
        }

        this.BoundaryCondition(outerTemp);
    }

    GetDiffusivityArray(val1, val2) 
    {
        const centerXStart = Math.floor(this.partitionX * 0.3);
        const centerXEnd = Math.floor(this.partitionX * 0.7);
        const centerYStart = Math.floor(this.partitionY * 0.3);
        const centerYEnd = Math.floor(this.partitionY * 0.7);

        console.log('CEK DIFF Before initialization', [val1, val2]);

        for (let i = 0; i <= this.partitionX; i++) {
            for (let j = 0; j <= this.partitionY; j++) {
                if (i >= centerXStart && i <= centerXEnd && j >= centerYStart && j <= centerYEnd)
                {
                    this.#diffAr[i][j] = val1;
                }
                else
                {
                    this.#diffAr[i][j] = val2;
                }
            }
        }

        console.log('CEK DIFF After initialization', this.#diffAr);
    }

    heat2dExplicit(outerTemp) {

        let alphaX = this.deltaT/(2*this.deltaX**2);
        let alphaY = this.deltaT/(2*this.deltaY**2);

        this.BoundaryCondition(outerTemp);

        for (let i = 1; i < this.partitionX; i++) {
            for (let j = 1; j < this.partitionY; j++) {
                this.Temp[i][j] = this.lastTemp[i][j] 
                        + alphaX*((this.#diffAr[i+1][j] + this.#diffAr[i][j])*this.lastTemp[i+1][j] 
                        - (this.#diffAr[i+1][j] + 2*this.#diffAr[i][j] + this.#diffAr[i-1][j])*this.lastTemp[i][j]
                        + (this.#diffAr[i][j] + this.#diffAr[i-1][j])*this.lastTemp[i-1][j]) 
                        + alphaY*((this.#diffAr[i][j+1] + this.#diffAr[i][j])*this.lastTemp[i][j+1] 
                        - (this.#diffAr[i][j+1] + 2*this.#diffAr[i][j] + this.#diffAr[i][j-1])*this.lastTemp[i][j]
                        + (this.#diffAr[i][j] + this.#diffAr[i][j-1])*this.lastTemp[i][j-1])
            }
        }

        for (let i = 0; i <= this.partitionX; i++) {
            for (let j = 0; j <= this.partitionY; j++) {
                this.lastTemp[i][j] = this.Temp[i][j];
            }
        }
    }

    TempPanelCenter() {
        this.tempSliderCenter = new PanelSlider({
            props: this,
            label: 'Suhu Titik Tengah',
            initial: 100,
            x: this.windowPos[0],
            y: this.windowPos[1] + this.windowHeight + 10,
        });
        this.tempSliderCenter.create();
    }

    TempPanelOuter() {
        let y = this.tempSliderCenter.getBottomLeft()[1];
        this.tempSliderOuter = new PanelSlider({
            props: this,
            label: 'Suhu Bagian Luar',
            initial: 0,
            x: this.windowPos[0],
            y: y,
        });
        this.tempSliderOuter.create();
    }

    TemptoColor(temp) {
        let deltaT = this.Tkanan - this.Tkiri;
        if (temp == null) return [255, 255, 255];
        if (deltaT === 0) return [255, 255, 255]; // Menghindari pembagian dengan nol
        let r = 255 * (temp - 0) / deltaT;
        let g = 0;
        let b = 255 * (100 - temp) / deltaT;
        return [r, g , b];
    }

    TimePanel() {
        this.timePanel = new TimerPanel({
            props: this,
            x: this.windowPos[0],
            y: this.windowPos[1] - 30
        });
    }

    ButtonPanel() {
        let posX = this.windowCenterX;
        let posY = this.tempSliderOuter.getBottomLeft()[1] + 50;

        this.playButton = createButton("▶");
        this.playButton.position(posX, posY);
        this.playButton.style('width', '90px');
        this.playButton.mouseClicked(() => {
            this.timePanel.start();
            this.tempSliderCenter.disabled();
            this.tempSliderOuter.disabled();
            this.isPlaying = true;
        });

        posX += 100;
        this.pauseButton = createButton("▐▐");
        this.pauseButton.position(posX, posY);
        this.pauseButton.style('width', '90px');
        this.pauseButton.mouseClicked(() => {
            this.timePanel.pause();
            this.isPlaying = false;
        });

        posX += 100;
        this.resetButton = createButton("↻");
        this.resetButton.position(posX, posY);
        this.resetButton.style('width', '90px');
        this.resetButton.mousePressed(() => {
            this.isPlaying = false;
            this.tempSliderCenter.enabled();
            this.tempSliderOuter.enabled();
            this.timePanel.reset();
            this.lastTemp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
            this.Temp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
            // this.SetInitialTemp(100, 0);
            this.tempSliderCenter.setValue(100);
            this.tempSliderOuter.setValue(0);
        });
    }

    ButtonBack() {
        this.buttonBack = createButton("Kembali");
        this.buttonBack.position(20, 20);
        this.buttonBack.style('width', '100px');
        this.buttonBack.style('background-color', '#dc3545');
        this.buttonBack.mousePressed(() => {
            this.onMenuChange('home');
            
            // clean all tags
            let sliders = selectAll('input');
            sliders.forEach(slider => slider.remove());

            let buttons = selectAll('button');
            buttons.forEach(button => button.remove());

            let dropdowns = selectAll('select');
            dropdowns.forEach(dropdown => dropdown.remove());
        });
    }
}
