import React, { Component } from 'react';
import Navbar from '../../../Component/Navbar/Navbar';
import env from '../../../env';
import Table from '../../../Component/Table/Table';
import { Alert } from 'reactstrap';
import $ from '../../../../node_modules/jquery/dist/jquery';
import ModalDialog from '../../../Component/ModalDialog/ModalDIalog';
import Breadcrumb from '../../../Component/Breadcrumb/Breadcrumb';
import Common from '../../../Common/Common';
import Pagination from '../../../Component/Pagination/Pagination';

export default class Transaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            transHeader: ["Jumlah barang", "Total harga awal", "Total harga akhir", "Selisih", "Tanggal", "Detail"],
            dataTransaction: [],
            detailTransaction: [],
            detailHeader: ["Total Pendapatan", "Total Modal", "Profit"],
            dataAudit: [],

            viewDetail: [],
            currentPage: 1,
            totalPage: 5,
            pageSize: 5,
            totalItems: 0,
            pagination: "",
            onError: false,
            transactionAudit: "Total transaksi"
        }
        this.loadTransaction = this.loadTransaction.bind(this);
        this.viewTransactionDetail = this.viewTransactionDetail.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        this.modifiedDate = this.modifiedDate.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.countTransaction = this.countTransaction.bind(this)
        this.auditTransaction = this.auditTransaction.bind(this)
    }
    componentDidMount() {
        this.searchByDate();
        this.countTransaction();
    }
    auditTransaction() {
        this.setState({

            dataAudit: []
        })
        let startDate = document.getElementById("dateStartProcess").value
        let endDate = document.getElementById("dateEndprocess").value
        let queries = ""
        let textTitle = ""
        if (startDate !== null && startDate !== undefined && startDate !== "") {
            startDate = new Date(document.getElementById("dateStartProcess").value).toISOString();
            queries += "startDate=" + startDate + "&"
            textTitle += " dari tanggal " + document.getElementById("dateStartProcess").value
        }
        if (endDate !== null && endDate !== undefined && endDate !== "") {
            // endDate = new Date(document.getElementById("dateEnd").value).toISOString();
            endDate = this.modifiedDate(document.getElementById("dateEndprocess").value)
            queries += "endDate=" + endDate
            textTitle += " sampai tanggal " + document.getElementById("dateEndprocess").value

        }
        console.log(queries)
        fetch(env.url + "sumTransaction?" + queries)
            .then(response => {
                return response.json()
            })
            .then(res => {

                console.log(res.data)
                this.setState({
                    transactionAudit: this.state.transactionAudit + textTitle,
                    dataAudit: this.state.dataAudit.concat(res.data)
                }, () => document.getElementById("loadModal").click())

            })
            .catch(err => {
                console.log(err)
            })
    }
    countTransaction() {
        let startDate = document.getElementById("dateStart").value
        let endDate = document.getElementById("dateEnd").value
        let queries = ""
        if (startDate !== null && startDate !== undefined && startDate !== "") {
            startDate = new Date(document.getElementById("dateStart").value).toISOString();
            queries += "startDate=" + startDate + "&"
        }
        if (endDate !== null && endDate !== undefined && endDate !== "") {
            // endDate = new Date(document.getElementById("dateEnd").value).toISOString();
            endDate = this.modifiedDate(document.getElementById("dateEnd").value)
            queries += "endDate=" + endDate
        }
        fetch(env.url + "countTransaction?" + queries)
            .then(response => {
                return response.json()
            })
            .then(res => {

                console.log(res.count)
                this.setState({
                    totalItems: res.count,
                    totalPage: Math.ceil(res.count / this.state.pageSize)
                })



            })
            .catch(err => {
                console.log(err)
            })
    }
    loadTransaction() {
        let startDate = document.getElementById("dateStart").value
        let endDate = document.getElementById("dateEnd").value
        let queries = ""
        if (startDate !== null && startDate !== undefined && startDate !== "") {
            startDate = new Date(document.getElementById("dateStart").value).toISOString();
            queries += "endDate=" + startDate
        }
        if (endDate !== null && endDate !== undefined && endDate !== "") {
            // endDate = new Date(document.getElementById("dateEnd").value).toISOString();
            endDate = this.modifiedDate(document.getElementById("dateEnd").value)
            queries += "endDate=" + endDate

        }
        fetch(env.url + "transaction")
            .then(response => {
                return response.json()
            })
            .then(res => {
                console.log(res)
                if (res.status !== 200) {

                    alert("failed load data")
                    console.log(res)

                }
                else {
                    let transData = []
                    let transDetail = []
                    let waiters = res.data.length
                    for (var i = 0; i < res.data.length; i++) {
                        let transObj = {};

                        let current = res.data[i];
                        transObj.transactionId = current.transactionId;
                        transObj.quantity = current.quantity;
                        transObj.totalPrice = current.totalPrice;
                        transObj.totalPriceSells = current.totalPriceSells;
                        transObj.profit = current.profit;
                        transObj.transactionDate = Common.convertDate(current.transactionDate);
                        transObj.button = (<button className="btn btn-primary" data-toggle="modal" onClick={() => this.viewTransactionDetail(current.transactionId)} data-target="#modalDetailTrans" >
                            <i className="fa fa-edit"></i>
                        </button>);
                        for (var j = 0; j < current.transactionDetail.length; j++) {
                            transDetail.push(current.transactionDetail[j]);
                        }
                        transData.push(transObj);
                        waiters--;
                        if (waiters === 0) {
                            this.setState({
                                dataTransaction: transData,
                                detailTransaction: transDetail
                            })
                        }


                    }

                }


            })
            .catch(err => {
                console.log(err)
            })
    }

    modifiedDate(val) {
        var tomorrow = new Date(val)
        tomorrow.setDate(tomorrow.getDate() + 1)

        return tomorrow.toISOString();
    }
    searchByDate() {
        let current = this.state.currentPage
        let page = current -= 1;
        let startDate = document.getElementById("dateStart").value
        let endDate = document.getElementById("dateEnd").value
        let queries = ""

        if (startDate !== null && startDate !== undefined && startDate !== "") {
            startDate = new Date(document.getElementById("dateStart").value).toISOString();
            queries += "startDate=" + startDate + "&"

        }
        if (endDate !== null && endDate !== undefined && endDate !== "") {
            // endDate = new Date(document.getElementById("dateEnd").value).toISOString();
            endDate = this.modifiedDate(document.getElementById("dateEnd").value)
            queries += "endDate=" + endDate
        }
        console.log(queries)
        fetch(env.url + "transaction?" + queries + "&skip=" + page * this.state.pageSize + "&limit=" + this.state.pageSize)
            .then(response => {
                return response.json()
            })
            .then(res => {
                console.log(res)
                if (res.status !== 200) {

                    alert("data tidak di temukan")
                    console.log(res)

                }
                else {

                    let transData = []
                    let transDetail = []
                    let waiters = res.data.length
                    for (var i = 0; i < res.data.length; i++) {
                        let transObj = {};

                        let current = res.data[i];
                        transObj.transactionId = current.transactionId;
                        transObj.quantity = current.quantity;
                        transObj.totalPrice = current.totalPrice;
                        transObj.totalPriceSells = current.totalPriceSells;
                        transObj.profit = current.profit;
                        transObj.transactionDate = Common.convertDate(current.transactionDate);
                        transObj.button = (<button className="btn btn-primary" data-toggle="modal" onClick={() => this.viewTransactionDetail(current.transactionId)} data-target="#modalDetailTrans" >
                            <i className="fa fa-edit"></i>
                        </button>);
                        for (var j = 0; j < current.transactionDetail.length; j++) {
                            transDetail.push(current.transactionDetail[j]);
                        }
                        transData.push(transObj);
                        waiters--;
                        if (waiters === 0) {
                            this.setState({
                                dataTransaction: transData,
                                detailTransaction: transDetail
                            })
                        }


                    }
                    this.countTransaction();

                }


            })
            .catch(err => {
                console.log(err)
            })
    }
    viewTransactionDetail(id) {
        this.setState({
            viewDetail: this.state.detailTransaction.filter(dt => dt.transactionId === id)
        })
    }
    onDismiss() {
        this.setState({
            onError: false
        })
    }
    nextPage(page, callback) {
        this.setState({
            currentPage: page
        }, () => callback(this.state.totalItems, this.state.currentPage, this.state.pageSize, this.state.totalPage, this.searchByDate))


    }
    render() {

        const detail = this.state.viewDetail.map((dt, i) =>
            <div className="row btm-border" key={i}>
                <div className="col-sm-4 mt-2">

                    <p className="mb-5px">
                        <i className="fa fa-tags mr-1"></i>
                        Nama Produk
                                </p>

                    {/* <p>Nama Produk</p> */}
                </div>
                <div className="col-sm-8 mt-2">

                    <p className="mb-5px">

                        : {dt.productName}
                    </p>

                </div>
                <div className="col-sm-4 mt-2">
                    <p >
                        <i className="fa fa-info-circle mr-1"></i>
                        Info produk
                                </p>
                </div>
                <div className="col-sm-8 mt-3">
                    <div className="row">
                        <div className="col-sm-4 mt-2">
                            <p>
                                <i className="fa fa-info mr-2"></i>
                                Size
                                        </p>
                        </div>
                        <div className="col-sm-8 mt-2"><p>: {dt.size}</p></div>
                        <div className="col-sm-4 mt-2">
                            <p>
                                <i className="fa fa-money mr-2"></i>
                                Harga awal
                                        </p>
                        </div>
                        <div className="col-sm-8 mt-2"><p>: {dt.price}</p></div>
                        <div className="col-sm-4 mt-2">
                            <p>
                                <i className="fa fa-usd mr-2"></i>
                                Harga jual
                                        </p>
                        </div>
                        <div className="col-sm-8 mt-2"><p>: {dt.sells}</p></div>
                        <div className="col-sm-4 mt-2">
                            <p>
                                <i className="fa fa-plus mr-2"></i>
                                Jumlah barang
                                        </p>
                        </div>
                        <div className="col-sm-8 mt-2"><p>: {dt.quantity}</p></div>
                    </div>
                </div>
            </div>
        )
        return (
            <div>
                <Navbar></Navbar>
                <div className="container">
                    <Breadcrumb title={"Transaksi"}></Breadcrumb>
                    <div class="card mb-3 mt-3">
                        <div class="card-header text-white bg-dark">Lihat pendapatan</div>

                        <div className="container">


                            <div className="row mb-3 mt-3">
                                <div className="col-sm-5">
                                    <input type="date" placeholder="Transaksi dari tanngal" id="dateStartProcess" className="form-control"></input>
                                </div>
                                <div className="col-sm-5">
                                    <input type="date" placeholder="Transaksi sampai tanggal" id="dateEndprocess" className="form-control"></input>
                                </div>
                                <div className="col-sm-2">
                                    <button className="btn btn-danger" onClick={this.auditTransaction} > <i className="fa fa-recycle mr-2 ml-2"></i>Proses</button>
                                    <button className="btn btn-danger" id="loadModal" data-toggle="modal" style={{ display: "none" }} data-target="#modalAuditTransaction"> <i className="fa fa-recycle mr-2 ml-2"></i>Proses</button>

                                </div>
                            </div>


                        </div>



                    </div>
                    <div class="card mb-3 mt-3">
                        <div class="card-header text-white bg-dark">Daftar transksi</div>

                        <div className="container">

                            <div className="row mb-3 mt-3">
                                <div className="col-sm-5">
                                    <input type="date" placeholder="Transaksi dari tanngal" id="dateStart" className="form-control"></input>
                                </div>
                                <div className="col-sm-5">
                                    <input type="date" placeholder="Transaksi sampai tanggal" id="dateEnd" className="form-control"></input>
                                </div>
                                <div className="col-sm-2">
                                    <button className="btn btn-danger" onClick={this.searchByDate}> <i className="fa fa-search"></i> Cari transaksi</button>
                                </div>
                            </div>
                            <Table tableHeader={this.state.transHeader} tableBody={this.state.dataTransaction}></Table>

                        </div>
                        <div class="card-footer">

                            {/* <Pagination callParent={this.searchByDate} pageFunction={this.nextPage} maxPages={Math.ceil(this.state.totalItems / this.state.pageSize)} pageSize={this.state.pageSize} totalItems={this.state.totalItems} currentPage={this.state.currentPage}></Pagination> */}
                            {
                                this.state.totalItems > 0 ? (
                                    <Pagination callParent={this.searchByDate} pageFunction={this.nextPage} maxPages={Math.ceil(this.state.totalItems / this.state.pageSize)} pageSize={this.state.pageSize} totalItems={this.state.totalItems} currentPage={this.state.currentPage}></Pagination>

                                ) : (<div></div>)
                            }
                            {/* {this.state.pagination} */}
                            {/* <Pagination pageFunction={this.nextPage} maxPages={3} pageSize={5} totalItems={12} currentPage={1}></Pagination> */}

                            {
                                /* <Pagination pageFunction={this.nextPage} maxPages={this.state.totalPage} pageSize={this.state.pageSize} totalItems={this.state.totalItems} currentPage={this.state.currentPage}></Pagination> */}
                        </div>


                    </div>
                    <ModalDialog id={"modalDetailTrans"} title={"Detail transaksi"} idClose={"closeAddProduct"}>
                        {detail}
                    </ModalDialog>
                    <ModalDialog id={"modalAuditTransaction"} title={"Total transaksi"} idClose={"closeAddProduct"}>
                        {/* {detail} */}
                        <div className="container">
                            <p>{this.state.transactionAudit}</p>
                            <Table tableHeader={this.state.detailHeader} tableBody={this.state.dataAudit}></Table>

                        </div>
                    </ModalDialog>

                </div>
            </div>
        )

    }
}