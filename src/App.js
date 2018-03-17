import React, { Component } from 'react';
import logo from './logo.svg';
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
        let arr = [];
        for(let i = 0; i < 80; i++) {
            arr[i] = {color: '#ff0000'};
        }
        this.setState({pixels: arr});
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
        let arr = [];
        let pulseLength = this.state.pulseLength;
        let pulseCount = this.state.pulseTicker % (this.state.pulseLength * 2);

        // Right support bar
        for(let i = 0; i < 30; i++) { // SUPPORT BAR 1 START, SUPPORT BAR 1 START + SUPPORT BAR LENGTH
            if((i+pulseCount) % (pulseLength * 2) < pulseLength) {
                arr[i] = {color: '#0000ff'};
            } else {
                arr[i] = {color: '#ffff00'};
            }
        }

        // Left support bar
        for(let i = 37; i < 67; i++) { // SUPPORT BAR 2 START, SUPPORT BAR 2 START + SUPPORT BAR LENGTH
            if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) {
                arr[i] = {color: '#0000ff'};
            } else {
                arr[i] = {color: '#ffff00'};
            }
        }

        // Bumper
        for(let i = 30; i < 37; i++) { // BUMPER START, BUMPER LENGTH
            arr[i] = {color: "#ff0000"};
        }

        // Intake
        for(let i = 67; i < 80; i++) {
            if(i < 67+ this.state.intakeLength/2) {
                if((i+pulseCount) % (pulseLength * 2) < pulseLength) {
                    arr[i] = {color: '#0000ff'};
                } else {
                    arr[i] = {color: '#ffff00'};
                }
            } else {
                if((i+1-pulseCount) % (pulseLength * 2) < pulseLength) {
                    arr[i] = {color: '#0000ff'};
                } else {
                    arr[i] = {color: '#ffff00'};
                }
            }
            
            //arr[i] = {color: "#ff0000"};
        }
        this.setState({pulseTicker: this.state.pulseTicker+1, pixels: arr});
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
                                    return(<Pixel color={d.color}/>)
                                }
                            })
                        }
                    </Row> {/* 0 - 29, 30 - 36, 37 - 66, 67 - end */}
                    <Row>
                        <Col md={1}>
                            <Row>Left support bar (Support bar 2)</Row>
                            {
                                revLeftSupp.map((d,i) => {
                                        return(<Pixel color={d.color}/>)
                                })
                            }
                        </Col>
                        <Col md={1}>
                            <Row>Right support bar (support bar 1)</Row>
                            {
                                this.state.pixels.map((d,i) => {
                                    if(i >= 0 && i < 30) {
                                        return(<Pixel color={d.color}/>)
                                    }
                                })
                            }
                        </Col>
                    </Row>
                    <Row>Bumper</Row>
                    <Row>
                        {   
                            revBump.map((d,i) => {
                                    return(<Pixel color={d.color}/>)
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
