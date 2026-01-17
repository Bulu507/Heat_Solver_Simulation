class TemperatureVerticalSlider {
    constructor({props = props, x = x, y = y, initial = initial}) {
        this.props = props;
        this.partition = props.partition;
        this.initial = initial;
        this.size = props.windowHeight;
        this.posX = x;
        this.posY = y;
        this.top = props.windowTopLeft[1];
        this.bottom = props.windowBottomLeft[1];
        this.labelPos = [x, this.posY - 20];
    }

    create() {
        this.slider = createSlider(0, this.partition, this.initial);
        this.slider.position(this.posX + 15, this.posY);
        this.slider.size(this.size);
        this.slider.style('transform', 'rotate(-90deg)');
        this.slider.style('transform-origin', 'left center');

        // Membuat tooltip menggunakan elemen div
        this.tooltip = createDiv('');
        this.tooltip.style('position', 'absolute');
        this.tooltip.style('background-color', '#333');
        this.tooltip.style('color', '#fff');
        this.tooltip.style('padding', '5px');
        this.tooltip.style('border-radius', '5px');
        this.tooltip.style('font-size', '12px');
        this.tooltip.style('visibility', 'hidden'); // Mulai dengan tooltip tersembunyi
        this.tooltip.style('z-index', '10');
        
        // Event listener untuk menampilkan tooltip saat hover slider
        this.slider.elt.addEventListener('mouseover', () => this.showTooltip());
        this.slider.elt.addEventListener('mousemove', (event) => this.updateTooltip(event));
        this.slider.elt.addEventListener('mouseout', () => this.hideTooltip());
    }

    display() {
        strokeWeight(1);
        // text(`${this.label}: ${this.slider.value()}º`, this.labelPos[0], this.labelPos[1]);
        text('100º', this.posX, this.top - 10);
        text('0º', this.posX + 5, this.bottom + 15);
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

    showTooltip() {
        this.tooltip.style('visibility', 'visible'); // Menampilkan tooltip
      }
    
      updateTooltip(event) {
        let sliderValue = this.slider.value();
        this.tooltip.html(`Nilai: ${sliderValue}º`); // Update isi tooltip dengan nilai slider
    
        // Mengatur posisi tooltip berdasarkan posisi kursor
        this.tooltip.position(event.pageX + 10, event.pageY - 10);
      }
    
      hideTooltip() {
        this.tooltip.style('visibility', 'hidden'); // Menyembunyikan tooltip saat mouse keluar
      }
}