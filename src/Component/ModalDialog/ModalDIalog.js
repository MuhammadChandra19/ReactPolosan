import React, { Component } from 'react';

export default class ModalDialog extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="modal fade bd-example-modal-lg" id={this.props.id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                <div className="modal-dialog  modal-lg modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalScrollableTitle">{this.props.title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            {this.props.children}
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" id={this.props.idClose} >Close</button>

                        </div>
                    </div>
                </div>
            </div>
        )


    }
}