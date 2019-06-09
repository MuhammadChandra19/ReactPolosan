import React, { Component } from 'react';
import ModalDialog from '../ModalDialog/ModalDIalog';
import Table from '../Table/Table';
export default class Category extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableHead: ["Nama kategori", "Jumlah produk"]
        }

    }

    render() {
        return (
            <div class="card mb-3">
                <div class="card-header text-white bg-dark">Daftar Kategori</div>
                <div className="container">
                    <div className="mb-2 mt-2">
                        <button type="button" data-toggle="modal" data-target="#addProduct" className="btn btn-primary"> <i className="fa fa-plus-circle"></i> Tambah Kategori</button>

                    </div>
                    <Table tableHeader={this.state.tableHead} tableBody={this.props.category} />

                </div>
            </div>
        )
    }
}