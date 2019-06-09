import React, { Component } from 'react';
import ModalDialog from '../ModalDialog/ModalDIalog';
import Table from '../Table/Table';
import env from '../../env';
export default class Size extends Component {

    constructor(props) {
        super(props)
        this.state = {
            tableHead: ["Size", "Upsize price"]
        }
        this.postSize = this.postSize.bind(this)

    }
    postSize(e) {
        e.preventDefault();
        let data = {}
        data.size = document.getElementById("sizeName").value
        data.upsizePrice = parseInt(document.getElementById("upSize").value);
        fetch(env.url + "size", {
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
                if (res.status !== 200) {

                    alert("failed")
                    console.log(res)

                }
                else {
                    alert("success")
                    window.location.href = "/product"
                    console.log(res)
                }
            })
            .catch(err => {

                console.log(err)
            })
    }
    render() {
        return (
            <div>
                <div class="card mb-3">
                    <div class="card-header text-white bg-dark">Daftar Size</div>
                    <div className="container">
                        <div className="mb-2 mt-2">
                            <button type="button" data-toggle="modal" data-target="#addNewSize" className="btn btn-primary"> <i className="fa fa-plus-circle"></i> Tambah Size</button>

                        </div>
                        <Table tableHeader={this.state.tableHead} tableBody={this.props.size} />

                    </div>
                </div>
                <ModalDialog id={"addNewSize"} title={"Masukan Size"} idClose={"closeAddSize"}>

                    <form id="formSize">
                        <div className="form-row">
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="validationCustom01">Size</label>
                                <input autoComplete="off" type="text" className="form-control" id="sizeName" placeholder="Masukan Size" required></input>
                            </div>
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="category">Harga Tambahan</label>
                                <input autoComplete="off" type="number" className="form-control" id="upSize" placeholder="Masukan Harga per-Size" required></input>

                            </div>

                        </div>
                        <button className="btn btn-primary ml-auto mt-3" onClick={this.postSize} type="submit"><i className="fa fa-plus"></i> Tambah Size</button>
                    </form>
                </ModalDialog>
            </div>

        )
    }
}