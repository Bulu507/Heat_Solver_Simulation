class MaterialMenu {
    constructor({props = props, label = label, x = x, y = y}) {
        this.dropdown = null;
        this.selected = 0;
        this.label = label;
        this.posX = x + xSliderTolerance;
        this.posY = y + 60;
        this.size = 200;
        this.labelPos = [this.posX + 80, this.posY - 20];
        this.leftInfoPos = [x, this.posY + 15];
        this.rightInfoPos = [this.size + this.posX - 15, this.posY + 15];
    }

    create() {
        this.dropdown = createSelect();
        this.dropdown.position(this.posX, this.posY);

        Constanta.getMaterials.map((item) => {
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