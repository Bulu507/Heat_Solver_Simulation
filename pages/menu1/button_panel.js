class ButtonPanel {
    constructor(props) {
        this.posY = props.diffusivityPanelA.getBottomLeft()[1] + 60;
        this.posX = props.windowBottomLeft[0];
        this.isRunning = false;
        this.isPlaying = false;
    }

    create() {
        this.playButton = createButton("Play");
        this.playButton.position(this.posX, this.posY);
        this.playButton.style('width', '90px');
        this.playButton.mouseClicked(() => {
            this.isPlaying = true;
            this.isRunning = true;
        });

        this.posX = this.posX + 100
        this.pauseButton = createButton("Pause");
        this.pauseButton.position(this.posX, this.posY);
        this.pauseButton.style('width', '90px');
        this.pauseButton.style('background-color', '#ffc107');
        this.pauseButton.mouseClicked(() => {this.isPlaying = false;});

        this.posX = this.posX + 100
        this.resetButton = createButton("Reset");
        this.resetButton.position(this.posX, this.posY);
        this.resetButton.style('width', '90px');
        this.resetButton.style('background-color', '#dc3545');
        this.resetButton.mousePressed(() => {
            // this.temp = [];
            // redraw(1);
            window.location.reload();
        });
    }

    getIsRunning
}