import React, { Component } from 'react';

class Loading extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="loader-container" id="loader" style={{ display: this.props.showloading }}>
                <div className="loader"></div>
            </div>
        )
    }
}
export default Loading;