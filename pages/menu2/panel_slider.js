class PanelSlider {
    constructor({props = props, label = label, x = x, y = y, initial = initial}) {
        this.props = props;
        this.label = label;
        this.initial = initial;
        this.posX = x;
        this.posY = y + 60;
        this.labelPos = [x, this.posY - 20];
        this.leftInfoPos = [this.posX, this.posY];
        this.size = props.windowWidth + 20;
    }

    create() {
        this.slider = createSlider(0, 100, this.initial);
        this.slider.position(this.posX, this.posY);
        this.slider.size(this.size);
    }

    display(){
        strokeWeight(1);
        text(`${this.label}: ${this.slider.value()}ºC`, this.labelPos[0], this.labelPos[1]);
    }

    getValue() {
        let value = this.slider.value();
        return value;
    }

    setValue(value) {
        if (value >= 0 && value <= 100) { // memastikan nilai berada dalam rentang slider
            this.slider.value(value);
        } else {
            console.warn("Value out of range. It should be between 0 and 100.");
        }
    }

    disabled() {
        this.slider.attribute('disabled', '');
    }

    enabled() {
        this.slider.removeAttribute('disabled');
    }

    show() {
        this.slider.show();
    }

    hide() {
        this.slider.hide();
    }

    getBottomLeft() {
        return this.leftInfoPos;
    }
}