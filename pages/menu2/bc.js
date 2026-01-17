class Menu2 {
    constructor(){
        this.windowWidth = 400;
        this.windowHeight = 400;
        this.windowCenterX = width / 2 - this.windowWidth / 2;
        this.windowCenterY = height / 2 - this.windowHeight / 2 - 100;
        this.windowPos = [this.windowCenterX, this.windowCenterY];
        this.windowTopLeft = [this.windowPos[0], this.windowPos[1]];
        this.windowTopRight = [this.windowPos[0] + this.windowWidth, this.windowPos[1]];
        this.windowBottomLeft = [this.windowPos[0], this.windowPos[1] + this.windowHeight];
        this.windowBottomRight = [this.windowPos[0] + this.windowWidth, this.windowPos[1] + this.windowHeight];
        this.partitionX = 100;
        this.partitionY = 100;
        this.cellWidth = this.windowWidth / this.partitionX;
        this.cellHeight = this.windowHeight / this.partitionY;
        this.lengthX = 1.0;
        this.lengthY = 1.0;
        this.deltaX = this.lengthX / this.partitionX;
        this.deltaY = this.lengthY / this.partitionY;
        this.alpha = 0.01;
        this.deltaT = 0.0001;
        this.Tkiri = 0;
        this.Tkanan = 100;

        this.isPlaying = false;
        this.isRunning = false;

        this.TempPanelCenter();
        this.TempPanelOuter();
        this.ButtonPanel();
        this.TimePanel();

        this.lastTemp = Array.from({ length: this.partitionX + 1 }, () => Array(this.partitionY + 1).fill(0));
    }

    display(){
        this.WindowPanel();
        this.tempSliderCenter.display();
        this.tempSliderOuter.display();
        this.timePanel.display(this);
        // text('===== TEXT', this.windowBottomLeft[0], this.windowBottomLeft[1] + 20);
    }

    WindowPanel(){
        noStroke();
        for (let i = 0; i <= this.partitionX; i++) {
            for (let j = 0; j <= this.partitionY; j++) {
                let x = this.windowPos[0] + i * this.cellWidth;
                let y = this.windowPos[1] + j * this.cellHeight;
                let color = this.TemptoColor(this.lastTemp[i][j]);
                fill(color);
                rect(x, y, this.cellWidth, this.cellHeight);
            }
        }
        fill(0);
    }

    TempPanelCenter() {
        this.tempSliderCenter = new PanelSlider({
            props: this,
            label: 'Suhu Titik Tengah',
            initial: 50,
            x: this.windowBottomLeft[0],
            y: this.windowBottomLeft[1],
        });
        this.tempSliderCenter.create();
    }

    TempPanelOuter() {
        let y = this.tempSliderCenter.getBottomLeft()[1];
        this.tempSliderOuter = new PanelSlider({
            props: this,
            label: 'Suhu Bagian Luar',
            initial: 50,
            x: this.windowBottomLeft[0],
            y: y,
        });
        this.tempSliderOuter.create();
        console.log("test");
    }

    TemptoColor(temp) {
        const ratio = constrain((temp - this.Tkiri) / (this.Tkanan - this.Tkiri), 0, 1); // mengatur nilai antara 0 dan 1
        let blue = [0, 0, 255];
        let red = [255, 0, 0];
        let colorValue = [
            Math.round(blue[0] + ratio * (red[0] - blue[0])),
            Math.round(blue[1] + ratio * (red[1] - blue[1])),
            Math.round(blue[2] + ratio * (red[2] - blue[2]))
        ];
        return color(colorValue[0], colorValue[1], colorValue[2]);
    }

    TimePanel() {
        let posX = this.windowBottomLeft[0];
        let posY = this.windowTopLeft[1] - 10;

        this.timePanel = new TimerPanel({
            props: this,
            x: posX,
            y: posY
        });
    }

    ButtonPanel() {
        let posX = this.windowCenterX;
        let posY = this.tempSliderOuter.getBottomLeft()[1] + 50;

        // PLAY
        this.playButton = createButton("▶");
        this.playButton.position(posX, posY);
        this.playButton.style('background-color', '#4CAF50');
        this.playButton.style('width', '90px');
        this.playButton.mouseClicked(() => {
            this.timePanel.start();
            this.isPlaying = true;
            this.isRunning = true;
        });

        // PAUSE
        posX = posX + 100
        this.pauseButton = createButton("▐▐ ");
        this.pauseButton.position(posX, posY);
        this.pauseButton.style('width', '90px');
        this.pauseButton.style('background-color', '#ffc107');
        this.pauseButton.mouseClicked(() => {
            this.isPlaying = false;
            this.timePanel.pause();
        });

        // RESET
        posX = posX + 100
        this.resetButton = createButton("↻");
        this.resetButton.position(posX, posY);
        this.resetButton.style('width', '90px');
        this.resetButton.style('background-color', '#dc3545');
        this.resetButton.mousePressed(() => {
            this.isPlaying = false;
            this.isRunning = false;
            this.timePanel.reset();
        });
    }
}