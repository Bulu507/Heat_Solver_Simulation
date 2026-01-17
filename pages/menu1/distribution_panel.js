class DistributionPanel {
    constructor(props) {
        this.sliderPanel = new SliderPanel(props);
        this.sliderPanel.create();
        this.partition = props.partition;
        this.windowTopLeft = props.windowTopLeft;
        this.lineDivider = new LineDivider({y1: props.windowTopLeft[1], y2: props.windowBottomLeft[1]});
    }

    display() {
        let lineX = this.windowTopLeft[0] + this.getValue();
        this.lineDivider.display(lineX);
        this.sliderPanel.display();
    }

    getValue() {
        return this.sliderPanel.getValue();
    }

    getPixelValue() {
        return this.sliderPanel.getPixelValue();
    }

    getBottomLeft() {
        return this.sliderPanel.getBottomLeft();
    }

    getBottomRight() {
        return this.sliderPanel.getBottomRight();
    }

    disabled() {
        this.sliderPanel.disabled();
    }

    enabled() {
        this.sliderPanel.enabled();
    }
}

class LineDivider {
    constructor({y1 = y1, y2 = y2}) {
        this.y1 = y1;
        this.y2 = y2;
    }

    display(posX) {
        strokeWeight(3);
        line(posX, this.y1, posX, this.y2);
        strokeWeight(1);
    }
}

class SliderPanel {
    constructor(props) {
        this.partition = props.partition;
        this.windowBottomLeft = props.windowBottomLeft;
        this.windowBottomRight = props.windowBottomRight;
        this.posX = props.windowBottomLeft[0] + xSliderTolerance;
        this.posY = props.windowBottomLeft[1] + 40;
        this.size = props.windowWidth;
        this.slider = null;
        this.labelPos = [this.windowBottomLeft[0], this.posY - 20];
        this.leftInfoPos = [this.windowBottomLeft[0], this.posY + 15];
        this.rightInfoPos = [this.windowBottomRight[0] - 25, this.posY + 15];
    }

    create() {
        this.slider = createSlider(0, this.partition, this.partition / 2);
        this.slider.position(this.posX, this.posY);
        this.slider.size(this.size);
    }

    display() {
        text(`Batas Batang: ${this.slider.value()}`, this.labelPos[0], this.labelPos[1]);
        text('0 cm', this.leftInfoPos[0], this.leftInfoPos[1]);
        text(`${this.partition} cm`, this.rightInfoPos[0], this.rightInfoPos[1]);
    }

    getValue() {
        let value = this.slider.value() * this.size / this.partition;
        return value;
    }

    getPixelValue() {
        let value = this.slider.value();
        return value;
    }

    getBottomLeft() {
        return this.leftInfoPos;
    }

    getBottomRight() {
        return this.rightInfoPos;
    }

    disabled() {
        this.slider.attribute('disabled', '');
    }

    enabled() {
        this.slider.removeAttribute('disabled');
    }
}