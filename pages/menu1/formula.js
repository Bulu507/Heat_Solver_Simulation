class Heat1DSolvers {
    constructor(props) {
        this.domain = [props.windowPos[0], props.windowPos[0] + props.windowWidth];
        this.boundary = [0, 0];
        this.deltaX = props.deltaX;
        this.deltaT = props.deltaT;
        this.windowPos = props.windowPos;
        this.windowSize = props.windowSize;
        this.length = this.domain[1] - this.domain[0];
        this.distributionValue = props.distributionPanel.getValue();
        this.diffusivityPanelA = props.diffusivityPanelA;
        this.diffusivityPanelB = props.diffusivityPanelB;
        this.totalData = this.length / this.deltaX + 1;
        this.partX = Array.from({length : this.totalData}, (_, i) => this.domain[0] + i * this.deltaX);
        this.diffAr = this.partX.map((x) => this.diffusivity(x));
    }

    initialDistribution(x) {
        let posX = x - this.windowPos[0];
        return posX < this.distributionValue ? 0 : 100;
    }

    diffusivity(x) {
        let posX = x - this.windowPos[0];
        return posX < this.windowSize[0] ? this.diffusivityPanelB.getValue() : this.diffusivityPanelA.getValue();
    }

    DirichletSolver(lastTemp) {
        if(lastTemp == undefined || lastTemp.length == 0) {
            return  this.partX.map((x) => this.initialDistribution(x));
        }

        let r = this.deltaT / (this.deltaX**2);
        let temp = [];
        temp[0] = this.boundary[0];
        temp[this.totalData-1] = this.boundary[1];

        for(let i = 1; i < this.totalData-1; i++)
            {
                temp[i] = lastTemp[i] + r*((this.diffAr[i+1] - this.diffAr[i])*(lastTemp[i+1] - lastTemp[i]) 
                + this.diffAr[i]*(lastTemp[i+1] - 2*lastTemp[i] + lastTemp[i-1]) );   
            }
    
        return temp;
    }

    NeumannSolver(lastTemp) {
        if(lastTemp == undefined || lastTemp.length == 0) {
            return  this.partX.map((x) => this.initialDistribution(x));
        }

        let r = this.deltaT/(this.deltaX**2);
        let temp = [];

        temp[0] = lastTemp[0] + r*((this.diffAr[1] - this.diffAr[0])*(lastTemp[1] - lastTemp[0]) 
            + 2*this.diffAr[0]*(lastTemp[1] - lastTemp[0] - this.boundary[0]*this.deltaX) );

        temp[this.totalData-1] = lastTemp[this.totalData-1] + r*((this.diffAr[this.totalData-1] - this.diffAr[this.totalData-2])*(2*this.deltaX*this.boundary[1]) 
        + 2*this.diffAr[this.totalData-1]*(lastTemp[this.totalData-2] - lastTemp[this.totalData-1] + this.deltaX*this.boundary[1]) );

        for(let i = 1; i<this.totalData-1; i++) {
            temp[i] = lastTemp[i] + r*((this.diffAr[i+1] - this.diffAr[i])*(lastTemp[i+1] - lastTemp[i]) 
            + this.diffAr[i]*(lastTemp[i+1] - 2*lastTemp[i] + lastTemp[i-1]) );   
        }

        return temp;
    }
}