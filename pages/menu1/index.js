const xSliderTolerance = 5;
const diffusivityRange = 10;
// const Tkiri = 0;
// const Tkanan = 70;
const labelDirichletSolver = 'Suhu Tepi Dijaga Tetap';
const labelNeumanSolver = 'Fluks Tepi Dijaga Tetap';

class Menu1 {
    constructor(onMenuChange) {
        this.temp = []; //temperature
        this.onMenuChange = onMenuChange;
        this.windowWidth = 500;
        this.windowHeight = 300;
        this.windowSize = [this.windowWidth, this.windowHeight];
        this.partition = 100;
        this.deltaX = this.windowSize[0] / this.partition;
        this.deltaT = 5;
        this.windowCenterY = height / 2 - this.windowHeight / 2 - 100;
        this.windowPos = [200, this.windowCenterY];
        this.windowTopLeft = [this.windowPos[0], this.windowPos[1]];
        this.windowTopRight = [this.windowPos[0] + this.windowWidth, this.windowPos[1]];
        this.windowBottomLeft = [this.windowPos[0], this.windowPos[1] + this.windowHeight];
        this.windowBottomRight = [this.windowPos[0] + this.windowWidth, this.windowPos[1] + this.windowHeight];

        this.formulaPanel = new FormulaPanel(this);
        this.temperaturePanel = new TemperaturePanel({topY: this.windowTopLeft[1]});
        this.timePanel = new TimePanel(this);
        this.distributionPanel = new DistributionPanel(this);
        this.graphicPanel = new GraphicPanel(this);

        this.isPlaying = false;
        this.isRunning = false;
        
        this.DiffusivityPanelA();
        this.DiffusivityPanelB();
        this.TempPanelLeft();
        this.TempPanelRight();
        this.FluxPanelLeft();
        this.FluxPanelRight();
        this.InitialTempPanelLeft();
        this.InitialTempPanelRight();
        this.ButtonPanel();
        this.ButtonBack();
        this.formulaPanel.create();

        this.Tkiri = this.tempPanelLeft.getValue();
        this.Tkanan = this.tempPanelRight.getValue();
        // this.Tkiri = 0;
        // this.Tkanan = 100;

        this.formula = new Heat1DSolvers([this.windowPos[0], this.windowPos[0] + this.windowWidth], [this.Tkiri,this.Tkanan], this.deltaX, this.deltaT, this.diffusivity.bind(this), this.initialDistribution.bind(this));
    }
 
    display() {
        this.WindowPanel();
        this.timePanel.display(this);
        this.temperaturePanel.display();
        this.diffusivityPanelA.display();
        this.diffusivityPanelB.display();
        this.distributionPanel.display();
        this.graphicPanel.display(this);
        this.initialTempPanelLeft.display();
        this.initialTempPanelRight.display();

        // displaying temp and flux slider
        if (this.formulaPanel.selected === 1) {
            this.tempPanelLeft.display();
            this.tempPanelRight.display();
            this.tempPanelLeft.show();
            this.tempPanelRight.show();

            this.fluxPanelLeft.hide();
            this.fluxPanelRight.hide();
        } else {
            this.fluxPanelLeft.display();
            this.fluxPanelRight.display();
            this.fluxPanelLeft.show();
            this.fluxPanelRight.show();

            this.tempPanelLeft.hide();
            this.tempPanelRight.hide();
        }

        if (this.isRunning) {
            this.distributionPanel.disabled();
            this.diffusivityPanelA.disabled();
            this.diffusivityPanelB.disabled();
            this.formulaPanel.disable();
            this.tempPanelLeft.disabled();
            this.tempPanelRight.disabled();
            this.fluxPanelLeft.disabled();
            this.fluxPanelRight.disabled();
            this.initialTempPanelLeft.disabled();
            this.initialTempPanelRight.disabled();
            this.formula.UpdateDiffusivity();
            if (this.formulaPanel.selected === 1) {
                this.formula.UpdateBoundary(this.tempPanelLeft.getValue(), this.tempPanelRight.getValue());
            } else {
                this.formula.UpdateBoundary(this.fluxPanelLeft.getValue(), this.tempPanelRight.getValue());
            }

            this.graphicPanel.drawGraph(this);
        } else {
            this.distributionPanel.enabled();
            this.diffusivityPanelA.enabled();
            this.diffusivityPanelB.enabled();
            this.temp = this.formula.Initializer();
            this.graphicPanel.drawGraph(this);
        }

        if (this.isPlaying) {
            this.playButton.attribute('disabled', '');
            this.playButton.style('background-color', '#cccccc');
            this.playButton.style('color', '#666666');

            this.pauseButton.removeAttribute('disabled');
            this.pauseButton.style('background-color', '#ffc107');
            this.pauseButton.style('color', '#ffffff');

            if (this.formulaPanel.selected === 1) {
                this.temp = this.formula.DirichletSolver(this);
            } else {
                let leftValue = this.fluxPanelLeft.getValue();
                let rightValue = this.fluxPanelRight.getValue();
                this.temp = this.formula.NeumannSolver(this, leftValue, rightValue);
            }


            console.log(`cek DIFUSITI A`, this.diffusivityPanelA.getValue());
            console.log(`cek TEMP`, this.temp);
            // console.log(`cek DIFUSITI B`, this.diffusivityPanelB.getValue());
        } else {
            this.playButton.removeAttribute('disabled');
            this.playButton.style('background-color', '#4CAF50');
            this.playButton.style('color', '#ffffff');

            this.pauseButton.attribute('disabled', '');
            this.pauseButton.style('background-color', '#cccccc');
            this.pauseButton.style('color', '#666666');
        }
    }

    WindowPanel() {
        colorMode(RGB, 255);
        noStroke();  // Menghapus stroke pada rect
    
        // Gambar semua rect terlebih dahulu
        for (let i = 0; i < this.windowSize[0] / this.deltaX; i++) {
            fill(this.tempToColor(this.temp[i]));
            let x = this.windowPos[0] + i * this.deltaX;
            let y = this.windowPos[1];
            let w = this.deltaX;
    
            // Gambar kotak
            rect(x, y, w, this.windowSize[1]);
        }
    
        if (this.isRunning) {
            // Gambar dialog terakhir agar berada di atas
            for (let i = 0; i < this.windowSize[0] / this.deltaX; i++) {
                let x = this.windowPos[0] + i * this.deltaX;
                let y = this.windowPos[1];
                let w = this.deltaX;
        
                if (mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + this.windowSize[1]) {
                    // Gambar dialog kecil dengan suhu di posisi teratas
                    fill(255);  // Warna latar belakang dialog
                    stroke(0);  // Warna tepi
                    strokeWeight(1);  // Ketebalan tepi
        
                    let textPadding = 5;
                    let dialogWidth = 150;
                    let dialogHeight = 25;
        
                    // Gambar latar belakang dialog di atas semua elemen
                    rect(mouseX, mouseY - dialogHeight, dialogWidth, dialogHeight, 5);
                    
                    // Gambar teks di atas latar dialog
                    fill(0);  // Warna teks
                    noStroke();  // Hilangkan garis tepi teks
                    textSize(16);
                    text(`X: ${i}, Temp: ${this.temp[i].toFixed(2)}`, mouseX + textPadding, mouseY - dialogHeight / 2);
                }
            }
        }
    }

    DiffusivityPanelA() {
        let posY = this.distributionPanel.getBottomLeft()[1];
        this.diffusivityPanelA = new Diffusivity2({
            props: this,
            label: 'A',
            x: this.windowBottomLeft[0],
            y: posY,
        });
        this.diffusivityPanelA.create();
    }

    DiffusivityPanelB() {
        let posX = this.windowBottomLeft[0] + (this.windowWidth / 2) + 15;
        let posY = this.distributionPanel.getBottomLeft()[1];
        this.diffusivityPanelB = new Diffusivity2({
            props: this,
            label: 'B',
            x: posX,
            y: posY,
        });
        this.diffusivityPanelB.create();
    }

    TempPanelLeft() {
        let posX = this.graphicPanel.getBottomLeft()[0];
        let posY = this.graphicPanel.getBottomLeft()[1];
        this.tempPanelLeft = new TemperatureSlider({
            props: this,
            label: 'Suhu Batang Kiri',
            minLabel: '0º',
            maxLabel: '100º',
            x: posX,
            y: posY,
            initial: 0,
        });
        this.tempPanelLeft.create();
    }

    TempPanelRight() {
        let posX = this.graphicPanel.getBottomLeft()[0] + this.windowHeight / 2 + 30;
        let posY = this.graphicPanel.getBottomLeft()[1];
        this.tempPanelRight = new TemperatureSlider({
            props: this,
            label: 'Suhu Batang Kanan',
            minLabel: '0º',
            maxLabel: '100º',
            x: posX,
            y: posY,
            initial: 100,
        });
        this.tempPanelRight.create();
    }

    FluxPanelLeft() {
        let posX = this.graphicPanel.getBottomLeft()[0];
        let posY = this.graphicPanel.getBottomLeft()[1];
        this.fluxPanelLeft = new TemperatureSlider({
            props: this,
            label: 'Flux Kiri',
            minLabel: '0',
            maxLabel: '100',
            x: posX,
            y: posY,
            initial: 0,
        });
        this.fluxPanelLeft.create();
    }

    FluxPanelRight() {
        let posX = this.graphicPanel.getBottomLeft()[0] + this.windowHeight / 2 + 30;
        let posY = this.graphicPanel.getBottomLeft()[1];
        this.fluxPanelRight = new TemperatureSlider({
            props: this,
            label: 'Flux Kanan',
            minLabel: '0',
            maxLabel: '100',
            x: posX,
            y: posY,
            initial: 100,
        });
        this.fluxPanelRight.create();
    }

    InitialTempPanelLeft() {
        let posX = this.windowTopLeft[0] - 40;
        let posY = this.windowBottomLeft[1];
        this.initialTempPanelLeft = new TemperatureVerticalSlider({
            props: this,
            x: posX,
            y: posY,
            initial: 0,
        });
        this.initialTempPanelLeft.create();
    }

    InitialTempPanelRight() {
        let posX = this.windowTopRight[0] + 20;
        let posY = this.windowBottomRight[1];
        this.initialTempPanelRight = new TemperatureVerticalSlider({
            props: this,
            x: posX,
            y: posY,
            initial: 100,
        });
        this.initialTempPanelRight.create();
    }

    ButtonPanel() {
        let posY = this.diffusivityPanelA.getBottomLeft()[1] + 60;
        let posX = this.windowBottomLeft[0];

        this.playButton = createButton("▶");
        this.playButton.position(posX, posY);
        this.playButton.style('background-color', '#4CAF50');
        this.playButton.style('width', '90px');
        this.playButton.mouseClicked(() => {
            if (this.diffusivityPanelA.getValue() == 0) {
                alert("Jenis Bahan A Harus Diisi!");
                return;
            } 
            if (this.diffusivityPanelB.getValue() == 0) {
                alert("Jenis Bahan B Harus Diisi!");
                return;
            } 

        //     this.state.saveState(this.distributionPanel.getValue(), this.diffusivityPanelA.getValue(), this.diffusivityPanelB.getValue(),
        //     this.InitialTempPanelLeft.getValue(), this.initialTempPanelRight.getValue(), this.tempPanelLeft.getValue(),
        //     this.tempPanelRight.getValue(), this.formulaPanel.selectedValue
        // );

            this.timePanel.start();
            this.isPlaying = true;
            this.isRunning = true;
        });

        posX = posX + 100
        this.pauseButton = createButton("▐▐ ");
        this.pauseButton.position(posX, posY);
        this.pauseButton.style('width', '90px');
        this.pauseButton.style('background-color', '#ffc107');
        this.pauseButton.mouseClicked(() => {
            this.isPlaying = false;
            this.timePanel.pause();
        });

        posX = posX + 100
        this.resetButton = createButton("↻");
        this.resetButton.position(posX, posY);
        this.resetButton.style('width', '90px');
        this.resetButton.style('background-color', '#dc3545');
        this.resetButton.mousePressed(() => {
            // this.temp = [];
            // redraw(1);
            // window.location.reload();
            //Assign state
            // this.diffusivityPanelA.setValue(this.State.bahanKiri);
            // this.diffusivityPanelB.setValue(this.State.bahanKanan);

            this.isPlaying = false;
            this.isRunning = false;
            this.timePanel.reset();
            this.distributionPanel.enabled();
            this.diffusivityPanelA.enabled();
            this.diffusivityPanelB.enabled();
            this.formulaPanel.enable();
            this.tempPanelLeft.enabled();
            this.tempPanelRight.enabled();
            this.fluxPanelLeft.enabled();
            this.fluxPanelRight.enabled();
            this.initialTempPanelLeft.enabled();
            this.initialTempPanelRight.enabled();
        });
    }

    tempToColor(temperature) {
        let deltaT = this.Tkanan - this.Tkiri;
        if (temperature == null) return [255, 255, 255];
        if (deltaT === 0) return [255, 255, 255]; // Menghindari pembagian dengan nol
        let r = 255 * (temperature - 0) / deltaT;
        let g = 0;
        let b = 255 * (100 - temperature) / deltaT;
        return [r, g , b];
    }

    diffusivity(x) {
        let posX = x - this.windowPos[0];
        let val1 = this.diffusivityPanelA.getValue();
        let val2 = this.diffusivityPanelB.getValue();
    
        return posX < this.windowWidth ? val1 : val2;
    }

    initialDistribution(x) {
        let posX = x - this.windowPos[0];
        let left = this.initialTempPanelLeft.getValue();
        let right = this.initialTempPanelRight.getValue();
        return posX < this.distributionPanel.getValue() ? left : right;
        // return posX < this.distributionPanel.getValue() ? 0 : 80;
        // return posX < this.windowWidth / 2 ? 0 : 100;
        // return 100 * (x - this.windowPos[0])/this.windowWidth;
    }

    ButtonBack() {
        this.buttonBack = createButton("Kembali");
        this.buttonBack.position(20, 20);
        this.buttonBack.style('width', '100px');
        this.buttonBack.style('background-color', '#dc3545');
        this.buttonBack.mousePressed(() => {
            this.onMenuChange('home');

            // clean all tags
            let sliders = selectAll('input');
            sliders.forEach(slider => slider.remove());

            let buttons = selectAll('button');
            buttons.forEach(button => button.remove());

            let dropdowns = selectAll('select');
            dropdowns.forEach(dropdown => dropdown.remove());
        });
    }
}

class FormulaPanel {
    constructor(props) {
        this.dropdown = null;
        this.windowTopRight = props.windowTopRight;
        this.selected = 1;
    }

    create() {
        this.dropdown = createSelect();
        this.dropdown.position(this.windowTopRight[0] - 205, this.windowTopRight[1] - 20);
        this.dropdown.option(labelDirichletSolver);
        this.dropdown.option(labelNeumanSolver);
        this.dropdown.changed(() => this.onChange());
    }

    onChange() {
        let selectedOption = this.dropdown.value();

        if (selectedOption === labelDirichletSolver) {
            this.selected = 1;
        } else if (selectedOption === labelNeumanSolver) {
            this.selected = 2;
        }
    }

    getValue() {
        return this.selected;
    }

    disable() {
        this.dropdown.attribute('disabled', '');
    }

    enable() {
        this.dropdown.removeAttribute('disabled');
    }
}

class TimePanel {
    constructor(props) {
        this.leftX = props.windowTopLeft[0];
        this.leftY = props.windowTopLeft[1] - 20;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.isPlaying = props.isPlaying;
    }

    display(props) {
        this.isPlaying = props.isPlaying;

        // Jika timer sedang berjalan, hitung waktu yang berlalu
        if (this.isPlaying) {
            this.elapsedTime = millis() - this.startTime;
        }
    
         // Hitung jam, menit, detik, dan milidetik
        let hours = Math.floor(this.elapsedTime / (1000 * 60 * 60));
        let minutes = Math.floor((this.elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((this.elapsedTime % (1000 * 60)) / 1000);
        let milliseconds = this.elapsedTime % 1000;

        // Format menjadi dua digit jika dibawah 10
        hours = nf(hours, 2);
        minutes = nf(minutes, 2);
        seconds = nf(seconds, 2);
        milliseconds = nf(milliseconds, 3, 0).replace(".", "");

        fill(0);
        textSize(20);
        text(`Waktu: ${hours}:${minutes}:${seconds}:${milliseconds}`, this.leftX, this.leftY);
        textSize(12);
    }

    start() {
        if (!this.isPlaying) {
          this.startTime = millis() - this.elapsedTime; // Mulai dari waktu yang tersimpan
        }
      }
    
    pause() {
        if (this.isPlaying) {
            this.elapsedTime = millis() - this.startTime; // Simpan waktu yang berlalu
        }                   
    }

    reset() {
        this.startTime = 0; // Atur ulang waktu mulai ke 0
        this.elapsedTime = 0; // Atur ulang waktu yang berlalu ke 0
    }
}

class TemperaturePanel {
    constructor({topY = topY}) {
        this.panelWidth = 20;
        this.panelHeight = 300;
        this.topY = topY;
        this.bottomY = this.topY + this.panelHeight;
        this.leftX = 50;
        this.rightX = this.leftX + this.panelWidth;
        this.partition = 100;
        this.partHeight = this.panelHeight / this.partition;
    }

    display() {
        noStroke();
        for (let i = 0; i < this.partition; i++) {
            let y = (i * this.partHeight) + this.topY;
            // Interpolasi warna
            let t = i / this.partition; // Proporsi posisi bagian dari atas ke bawah
            let r = lerp(255, 0, t);
            let g = 0;
            let b = lerp(0, 255, t);

            fill(r, g, b);
            rect(this.leftX, y, this.panelWidth, this.partHeight);
            if ((i) % 20 == 0) {
                line(this.leftX, y, this.rightX + 5, y);
                textAlign(LEFT, CENTER);
                text(this.partition - i, this.rightX + 8, y);
            }
        }

        stroke(0, 0, 0); 
        strokeWeight();

        line(this.leftX, this.bottomY, this.rightX + 5, this.bottomY);
        textAlign(LEFT, CENTER);
        text('0', this.rightX + 8, this.bottomY);

        fill(0,0,0);
        text('Pita Suhu T (ºC)', this.leftX - 25, this.topY - 20);
        
        // text('Heat Equation adalah persamaan diferensial parsial yang memodelkan perubahan suhu', this.leftX+680 , this.topY+350);
        // text('di seluruh dimensi suatu benda, sehubungan dengan waktu. Garis pada kurva merepresentasikan', this.leftX+680 , this.topY+370);
        // text('grafik fungsi posisi, menunjukkan distribusi suhu sepanjang batang pada waktu tertentu. ', this.leftX+680 , this.topY+390)
         
        // text('Ada dua kondisi batas yang digunakan, yakni:', this.leftX+680 , this.topY+420)
        // text('o Dirichlet: suhu pada ujung batang dijaga selalu konstan', this.leftX+680 , this.topY+440)
        // text('o Neumann: ujung batang terisolasi sehingga tidak ada kalor yang masuk dan keluar', this.leftX+680 , this.topY+460)
        
        // text('Note: ', this.leftX+680 , this.topY+490)
        // text('Simulasi hanya bisa dijalankan ketika jenis bahan telah dipilih', this.leftX+680 , this.topY+510)
    }
}