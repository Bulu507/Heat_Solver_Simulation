class HomeMenu {
    constructor(onMenuChange) {
        this.onMenuChange = onMenuChange;
        this.windowWidth = 500;
        this.windowHeight = 600;
        this.windowCenterX = width / 2 - this.windowWidth / 2;
        this.windowCenterY = height / 2 - this.windowHeight / 2;
        this.windowPos = [this.windowCenterX, this.windowCenterY];

        this.centerBoxX = this.windowCenterX + this.windowWidth / 2;

        this.ButtonHeat1D()
        this.ButtonHeat2D();
    }

    display() {
        noStroke();
        fill(147,166,192);
        rect(this.windowCenterX, this.windowCenterY, this.windowWidth, this.windowHeight, 10);
        fill('white');
        textSize(40);
        textAlign(CENTER, CENTER);
        textFont('Verdana');
        text(`HEAT TRANSFER\nSIMULATOR`, this.centerBoxX, this.windowCenterY + 80);

        this.buttonHeat1D.display();
        this.buttonHeat2D.display();

        if (this.buttonHeat1D.isClicked()) {
            console.log("Button HEAT 1D clicked!");
            this.onMenuChange('heat1D');
        }

        if (this.buttonHeat2D.isClicked()) {
            console.log("Button HEAT 2D clicked!");
            this.onMenuChange('heat2D');
        }
    }

    ButtonHeat1D() {
        let posX = this.centerBoxX;
        let posY = this.windowCenterY + 250;

        this.buttonHeat1D = new ButtonBox({
            props: this,
            label: 'Heat 1D',
            x: posX,
            y: posY,
        });
    }

    ButtonHeat2D() {
        let posX = this.centerBoxX;
        let posY = this.buttonHeat1D.getBottomY() + 50;

        this.buttonHeat2D = new ButtonBox({
            props: this,
            label: 'Heat 2D',
            x: posX,
            y: posY,
        });
    }
}


class ButtonBox {
    constructor({props: props, label = label, x = x, y = y,}) {
        this.boxWidth = 400;
        this.boxHeight = 100;
        this.posX = x - (this.boxWidth / 2);
        this.posY = y;

        this.label = label;
        this.labelX = x;
        this.labelY = this.posY + (this.boxHeight / 2);
    }

    display() {
        fill(229,238,251);
        rect(this.posX, this.posY, this.boxWidth, this.boxHeight, 10);
        fill(147,166,192);
        textSize(30);
        textAlign(CENTER, CENTER);
        text(this.label, this.labelX, this.labelY);
    }

    isClicked() {
        return (
            mouseIsPressed && // Hanya ketika mouse ditekan
            mouseX > this.posX &&
            mouseX < this.posX + this.boxWidth &&
            mouseY > this.posY &&
            mouseY < this.posY + this.boxHeight
        );
    }

    getBottomY() {
        return this.posY + this.boxHeight;
    }
}