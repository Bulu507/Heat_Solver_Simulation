

class Diffusivity2 {
    constructor({props = props, label = label, x = x, y = y}) {
        this.dropdown = null;
        this.selected = 0;
        this.label = label;
        this.posX = x + xSliderTolerance;
        this.posY = y + 60;
        this.size = (props.windowWidth / 2) - 15;
        this.labelPos = [x, this.posY - 20];
        this.leftInfoPos = [x, this.posY + 15];
        this.rightInfoPos = [this.size + this.posX - 15, this.posY + 15];
    }

    create() {
        this.dropdown = createSelect();
        this.dropdown.position(this.posX, this.posY);

        DiffusivityMatter.map((item) => {
            this.dropdown.option(item.label);
        });

        this.dropdown.changed(() => this.onChange());
    }

    display() {
        // text(`Diffusivitas Benda ${this.label}: ${this.getValue()}`, this.labelPos[0], this.labelPos[1]);
        text(`Jenis Bahan ${this.label}`, this.labelPos[0], this.labelPos[1]);
    }

    onChange() {
        let selectedOption = this.dropdown.value();

        DiffusivityMatter.map((item) => {
            if (selectedOption === item.label) {
                this.selected = item;
                return;
            }
        });
    }

    setValue(val) {
        let value = val * this.range;
        return value;
    }

    getValue() {
        if (this.selected.value === undefined) {
            return 0;
        }
        //let value = this.selected.value * 0.000001;
        let value = this.selected.value / 111;
        let result = Number(value.toFixed(10));
        return result;
    }

    getBottomLeft() {
        return this.leftInfoPos;
    }

    getBottomRight() {
        return this.rightInfoPos;
    }

    disabled() {
        this.dropdown.attribute('disabled', '');
    }

    enabled() {
        this.dropdown.removeAttribute('disabled');
    }
}

const DiffusivityMatter = [
    {label: '--- Pilih Jenis Bahan ---', value: 0},
    {label: 'Tembaga', value: 111},
    {label: 'Beton', value: 0.65},
    {label: 'Silikon', value: 0.9},
    {label: 'Alumunium', value: 97},
    {label: 'Besi', value: 23},
    {label: 'Kaca', value: 0.34},
    {label: 'Kayu', value: 0.13},
];