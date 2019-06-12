import React, { Component } from 'react';
import ModalDialog from '../ModalDialog/ModalDIalog';
import Table from '../Table/Table';
import env from '../../env';
import { Alert } from 'reactstrap';
export default class Category extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableHead: ["Nama kategori", "Jumlah produk"],
            loading: "none",
            onSuccess: false,
            successMsg: "",
            alertColor: "primary"
        }
        this.postCategory = this.postCategory.bind(this)
        this.handleAlert = this.handleAlert.bind(this)
        this.onDismiss = this.onDismiss.bind(this)

    }
    onDismiss() {
        this.setState({
            onSuccess: false
        })
    }
    handleAlert(load, visible, msg, color) {
        console.log("executed")
        this.setState({
            loading: load,
            onSuccess: visible,
            successMsg: msg,
            alertColor: color
        })
    }
    postCategory(e) {
        e.preventDefault();
        let data = {}
        this.handleAlert("block", false, "", "")
        data.categoryName = document.getElementById("categoryName").value
        if (data.categoryName === "" || data.categoryName === null || data.categoryName === undefined) {
            this.handleAlert("none", true, "Masukan kategori", "danger")
            return false;
        }

        fetch(env.url + "category", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(result => {
                document.getElementById("closeAddSize").click();
                return result.json()

            })
            .then(res => {


                this.handleAlert("none", true, "Kategori berhasil di tambahkan", "primary")
                window.location.href = "/product"
                console.log(res)

            })
            .catch(err => {

                console.log(err)
            })
    }
    render() {
        return (
            <div class="card mb-3">
                <div class="card-header text-white bg-dark">Daftar Kategori</div>
                <div className="container">
                    <div className="mb-2 mt-2">
                        <button type="button" data-toggle="modal" data-target="#addNewCategory" className="btn btn-primary"> <i className="fa fa-plus-circle"></i> Tambah Kategori</button>

                    </div>
                    <Table tableHeader={this.state.tableHead} tableBody={this.props.category} />

                </div>
                <ModalDialog id={"addNewCategory"} title={"Masukan kategori"} idClose={"closeaddNewCategory"}>
                    <Alert color={this.state.alertColor} isOpen={this.state.onSuccess} toggle={this.onDismiss} fade={true}>
                        {this.state.successMsg}
                    </Alert>
                    <form id="formCategory" >
                        <div className="form-row">
                            <div className="col-sm-12 mb-2">
                                <label htmlFor="validationCustom01">Nama kategori</label>
                                <input autoComplete="off" type="text" className="form-control" id="categoryName" placeholder="Masukan nama kategori" required></input>
                            </div>


                        </div>
                        <button className="btn btn-primary ml-auto mt-3" onClick={this.postCategory} type="submit"><i className="fa fa-plus"></i> Tambah Kategori</button>
                    </form>
                </ModalDialog>
            </div>
        )
    }
}