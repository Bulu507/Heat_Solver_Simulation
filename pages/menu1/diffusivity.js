

class Diffusivity {
    constructor({props = props, label = label, x = x, y = y}, initialValue) {
        this.slider = null;
        this.label = label;
        this.posX = x + xSliderTolerance;
        this.posY = y + 60;
        this.size = (props.windowWidth / 2) - 15;
        this.labelPos = [x, this.posY - 20];
        this.leftInfoPos = [x, this.posY + 15];
        this.rightInfoPos = [this.size + this.posX - 15, this.posY + 15];
        this.range = diffusivityRange;
        this.initialValue = !initialValue ? 5 : initialValue;
    }

    create() {
        this.slider = createSlider(0, this.range, this.initialValue);
        this.slider.position(this.posX, this.posY);
        this.slider.size(this.size);
    }

    display() {
        text(`Jenis Bahan ${this.label}: ${this.getValue()}`, this.labelPos[0], this.labelPos[1]);
        text('0', this.leftInfoPos[0], this.leftInfoPos[1]);
        text('1', this.rightInfoPos[0], this.rightInfoPos[1]);
    }

    setValue(val) {
        let value = val * this.range;
        return value;
    }

    getValue() {
        let value = this.slider.value() / this.range;
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