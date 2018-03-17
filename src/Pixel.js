import React, { Component } from 'react';

class Pixel extends Component {
    render() {
        return (
            <div style={{width: '15px', height: '15px', backgroundColor: this.props.color, border: '1px solid'}}></div>
        )
    }

}

export default Pixel;