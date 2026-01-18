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
        this.slider = null;
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
        return this.slider.value();
    }

    setValue(value) {
        if (value >= 0 && value <= 100) {
            this.slider.value(value);
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

    destroy() {
        if (this.slider) {
            this.slider.remove();
            this.slider = null;
        }
    }
}
