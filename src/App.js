import React, { Component } from 'react';
import './App.css';
import { Grid, Row, Col } from 'react-flexbox-grid';
import Pixel from './Pixel';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pixels: [],
            supportBarLength: 30,
            bumperLength: 7,
            intakeLength: 13,
            pulseLength: 4,
            pulseTicker: 0
        }
    }

    componentDidMount() {
        let leds = [];
        for(let i = 0; i < 80; i++) {
            leds[i] = {color: '#ff0000'};
        }
        this.setState({pixels: leds});
    }

    startTest = () => {
        console.log(this.timer);
        if(this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        } else {
            this.timer = setInterval(this.colorEvent, 50);
        }
    }

    colorEvent = () => {
        //
        this.pulses();
    }

    pulses = () => {
        let leds = [];
        let pulseLength = this.state.pulseLength;
        let pulseCount = this.state.pulseTicker % (this.state.pulseLength * 2);

        const blue = {color: "#0000ff"};
        const yellow = {color: "#ffff00"};
        const red = {color: "#ff0000"};

        // constants, but this is different than the arduino code's
        const SUPPORT_BAR_1_START = 0;
        const SUPPORT_BAR_LENGTH = 30;
        const SUPPORT_BAR_2_START = 37;
        const BUMPER_START = 30;
        const BUMPER_LENGTH = 7;
        const INTAKE_START = 67;
        const INTAKE_LENGTH = 13;


        // Right support bar
        for(let i = SUPPORT_BAR_1_START; i < SUPPORT_BAR_1_START + SUPPORT_BAR_LENGTH; i++) { // SUPPORT BAR 1 START, SUPPORT BAR 1 START + SUPPORT BAR LENGTH
            if((i+pulseCount) % (pulseLength * 2) < pulseLength) {
                leds[i] = blue;
            } else {
                leds[i] = yellow;
            }
        }

        // Left support bar
        for(let i = SUPPORT_BAR_2_START; i < SUPPORT_BAR_2_START + SUPPORT_BAR_LENGTH; i++) { // SUPPORT BAR 2 START, SUPPORT BAR 2 START + SUPPORT BAR LENGTH
            if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) {
                leds[i] = blue;
            } else {
                leds[i] = yellow;
            }
        }

        // Bumper
        for(let i = BUMPER_START; i < BUMPER_START + BUMPER_LENGTH; i++) { // BUMPER START, BUMPER LENGTH
            leds[i] = red;
        }

        // Intake
        for(let i = INTAKE_START; i < INTAKE_START + INTAKE_LENGTH; i++) {
            if(i < INTAKE_START+ this.state.intakeLength/2) {
                if((i+pulseCount) % (pulseLength * 2) < pulseLength) {
                    leds[i] = blue;
                } else {
                    leds[i] = yellow;
                }
            } else {
                if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) {
                    leds[i] = blue;
                } else {
                    leds[i] = yellow;
                }
            }
        }

        this.setState({pulseTicker: this.state.pulseTicker+1, pixels: leds}); // increment the iteration
    }

    render() {
        let revLeftSupp = [];
        let revBump = [];
        this.state.pixels.forEach((d,i) => {
            if(i > 36 && i < 67) {
                revLeftSupp.unshift(d);
            } else if( i > 29 && i < 37) {
                revBump.unshift(d);
            }
        });
        return (
            <div className="App">
                <Grid className="centered">
                    <Row className="marginAuto">Intake</Row>
                    <Row>
                        {   
                            this.state.pixels.map((d,i) => {
                                if(i > 66) {
                                    return(<Pixel key={"pixel"+i} color={d.color}/>)
                                }
                            })
                        }
                    </Row> {/* 0 - 29, 30 - 36, 37 - 66, 67 - end */}
                    <Row>
                        <Col md={1}>
                            <Row>Left support bar (Support bar 2)</Row>
                            {
                                revLeftSupp.map((d,i) => {
                                        return(<Pixel key={"pixel"+i} color={d.color}/>)
                                })
                            }
                        </Col>
                        <Col md={1}>
                            <Row>Right support bar (support bar 1)</Row>
                            {
                                this.state.pixels.map((d,i) => {
                                    if(i >= 0 && i < 30) {
                                        return(<Pixel key={"pixel"+i} color={d.color}/>)
                                    }
                                })
                            }
                        </Col>
                    </Row>
                    <Row>Bumper</Row>
                    <Row>
                        {   
                            revBump.map((d,i) => {
                                    return(<Pixel key={"pixel"+i} color={d.color}/>)
                            })
                        }
                    </Row>
                    <Row>
                        <button onClick={() => this.startTest()}> Click to toggle </button>
                    </Row>
                </Grid>
                
            </div>
        );
    }
}

export default App;
