class GraphicPanel {
    constructor(props) {
        this.height = props.windowHeight;
        this.width = props.windowHeight;
        this.partition = props.partition;
        this.windowTopLeft = [props.windowTopRight[0] + 200, props.windowTopRight[1]];
        this.windowBottomLeft = [props.windowBottomRight[0] + 200, props.windowBottomRight[1]];
        this.windowBottomRight = [this.windowBottomLeft[0] + this.width, this.windowBottomLeft[1]];
        this.distributionValue = this.windowBottomLeft[0];
    }

    display(props) {
        //Draw Axes
        strokeWeight(3);
        line(this.windowTopLeft[0], this.windowTopLeft[1], this.windowBottomLeft[0], this.windowBottomLeft[1]);
        line(this.windowBottomLeft[0], this.windowBottomLeft[1], this.windowBottomRight[0], this.windowBottomRight[1]);

        //Draw Label
        strokeWeight(1);
        text(`T (ºC)`, this.windowTopLeft[0] - 15, this.windowTopLeft[1] - 20);
        text(`100`, this.windowTopLeft[0] - 25, this.windowTopLeft[1]);
        text(`⒳`, this.windowBottomRight[0] + 15, this.windowBottomRight[1]);
        text(`${this.partition}`, this.windowBottomRight[0] - 10, this.windowBottomRight[1] + 10);
        text(`0`, this.windowBottomLeft[0] - 10, this.windowBottomLeft[1] + 10);

        //Draw Boundary
        strokeWeight(3);
        stroke(0,0,0);

        let formatedValue = props.distributionPanel.getPixelValue() * this.width / this.partition; //format ke ukuran grafik
        this.distributionValue = this.windowBottomLeft[0] + formatedValue;
        stroke(0);
        this.dashedLine(this.distributionValue, this.windowTopLeft[1], this.distributionValue, this.windowBottomLeft[1]);
    }

    drawGraph(props) {
        let tempData = props.temp;
        let px = this.windowBottomLeft[0];
        let py = this.windowBottomLeft[1] - ((tempData[0] / 100) * this.height);
        let arr = [];
        for(let i =0; i < tempData.length; i++){
            let x = (i * (this.width / (tempData.length-1))) + this.windowBottomLeft[0];
            let y =  this.windowBottomLeft[1] - ((tempData[i] / 100) * this.height);
            stroke(this.tempToColor(tempData[i]));
            strokeWeight(3);
            line(px, py, x, y);
            
            arr.push(py);

            //store the last position
            px = x;
            py = y;
        } 
    }

    tempToColor(temperature) {
        let deltaT = 100 - 0;
        if (temperature == null) return [255, 255, 255];
        if (deltaT === 0) return [255, 255, 255]; // Menghindari pembagian dengan nol
        let r = 255 * (temperature - 0) / deltaT;
        let g = 0;
        let b = 255 * (100 - temperature) / deltaT;
        return [r, g , b];
    }

    dashedLine(x1, y1, x2, y2, dashLength = 5, gapLength = 5) {
        let dx = x2 - x1;
        let dy = y2 - y1;
        let distance = dist(x1, y1, x2, y2);
        let dashCount = Math.floor(distance / (dashLength + gapLength));
        
        for (let i = 0; i < dashCount; i++) {
            let startX = x1 + (dx * (i * (dashLength + gapLength))) / distance;
            let startY = y1 + (dy * (i * (dashLength + gapLength))) / distance;
            let endX = x1 + (dx * ((i * (dashLength + gapLength)) + dashLength)) / distance;
            let endY = y1 + (dy * ((i * (dashLength + gapLength)) + dashLength)) / distance;
            line(startX, startY, endX, endY);
        }
    }

    getBottomLeft() {
        return this.windowBottomLeft;
    }

    getBottomRight() {
        return this.windowBottomRight;
    }
}