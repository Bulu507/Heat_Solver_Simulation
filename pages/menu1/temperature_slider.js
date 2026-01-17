class TemperatureSlider {
    constructor({props = props, label = label, x = x, y = y, initial = initial, minLabel = minLabel, maxLabel = maxLabel}) {
        this.props = props;
        this.partition = props.partition;
        this.label = label;
        this.initial = initial;
        this.size = (props.windowHeight / 2) - 15;
        this.posX = x;
        this.posY = y + 60;
        this.labelPos = [x, this.posY - 20];
        this.minLabel = minLabel;
        this.maxLabel = maxLabel;
    }

    create() {
        this.slider = createSlider(0, this.partition, this.initial);
        this.slider.position(this.posX, this.posY);
        this.slider.size(this.size);
    }

    display() {
        strokeWeight(1);
        text(`${this.label}: ${this.slider.value()}`, this.labelPos[0], this.labelPos[1]);
        text(`${this.minLabel}`, this.posX, this.posY + 20);
        text(`${this.maxLabel}`, this.posX + (this.size - 30), this.posY + 20);
    }

    getValue() {
        let value = this.slider.value();
        return value;
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
}