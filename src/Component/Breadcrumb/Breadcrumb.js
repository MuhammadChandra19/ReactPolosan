import React, { Component } from 'react';

export default class Breadcrumb extends Component {

    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="mt-3">
                <nav aria-label="breadcrumb mt-5">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item active" aria-current="page">{this.props.title}</li>
                    </ol>
                </nav>
            </div>
        )
    }
}