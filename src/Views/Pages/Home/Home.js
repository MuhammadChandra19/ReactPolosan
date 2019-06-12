import React, { Component } from 'react';
import Navbar from '../../../Component/Navbar/Navbar';
import env from '../../../env';
import ModalDialog from '../../../Component/ModalDialog/ModalDIalog';
import Loading from '../../../Component/Loading/Loading';
import $ from '../../../../node_modules/jquery/dist/jquery';

import { Alert } from 'reactstrap';

import Breadcrumb from '../../../Component/Breadcrumb/Breadcrumb'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataProduct: [],
            formAppend: [],
            selectedSize: [],
            detailProduct: [],
            onSuccess: false,
            successMsg: "",
            loading: "block",
            alertColor: "primary"


        }
        this.loadProduct = this.loadProduct.bind(this)
        this.pushAppendChart = this.pushAppendChart.bind(this)
        this.makeid = this.makeid.bind(this)
        this.appendSize = this.appendSize.bind(this);
        this.setMaxQty = this.setMaxQty.bind(this);
        this.checkMax = this.checkMax.bind(this);
        this.formPrepend = this.formPrepend.bind(this);
        this.processTransaction = this.processTransaction.bind(this);
        this.checkValidationForm = this.checkValidationForm.bind(this);
        this.addSoldPrice = this.addSoldPrice.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }
    componentDidMount() {
        this.setState({
            formAppend: this.state.formAppend.concat(this.makeid(7))
        })
        this.loadProduct()
    }
    onDismiss() {
        this.setState({
            onSuccess: false
        })
    }
    pushAppendChart() {
        this.setState({
            formAppend: this.state.formAppend.concat(this.makeid(7))
        })
    }
    formPrepend(id, key) {
        console.log(id)

        this.setState({
            formAppend: this.state.formAppend.filter(dt => dt !== id),

            detailProduct: this.state.detailProduct.filter(dt => dt.key !== key)
        })

    }
    loadProduct() {
        fetch(env.url + "product")
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

                    this.setState({
                        dataProduct: this.state.dataProduct.concat(res.data),
                        loading: "none"
                    })
                }


            })
            .catch(err => {
                console.log(err)
                this.setState({
                    // dataProduct: this.state.dataProduct.concat(res.data),
                    loading: "none"
                })
            })
    }

    appendSize(idName, idSize, idQty, idPrc, idDetail) {

        const size = document.getElementById(idSize)
        const qts = document.getElementById(idQty)
        const prc = document.getElementById(idPrc)
        const selectedValue = document.getElementById(idName)
        const copyData = JSON.parse(JSON.stringify(this.state.dataProduct))
        const sizeData = copyData.filter(dt => dt.productId === selectedValue.value)

        $("#" + idSize).children().remove();
        $("#" + idSize).append(" <option value='' disabled selected>Pilih Size</option>")
        for (var i = 0; i < sizeData[0].sizes.length; i++) {


            var current = sizeData[0].sizes[i]
            $("#" + idSize).append("<option value=" + current.sizeId + ">" + current.size + "</option>")
        }

        const selectedIdx = selectedValue.options[selectedValue.selectedIndex].text
        qts.classList.add("required-input");
        size.classList.add("required-input");
        prc.classList.add("required-input");

        prc.setAttribute("name", "Harga " + selectedIdx + " harus di isi")
        size.setAttribute("name", "Pilih ukuran untuk " + selectedIdx)
        qts.setAttribute("name", "Masukan jumlah barang untuk " + selectedIdx)
        const objDetailProduct = {
            key: idName,
            id: selectedValue.value,
            productName: selectedIdx,
            productDetailId: "",
            quantity: 0,
            currentqty: 0,
            size: "",
            price: 0,
            sold: 0
        }
        this.setState({
            detailProduct: this.state.detailProduct.concat(objDetailProduct)
        })


    }

    setMaxQty(idName, idSize, idQty, idDetail) {

        const detail = document.getElementById(idDetail);
        const selectedValue = document.getElementById(idName).value
        const selectedSize = document.getElementById(idSize)

        const copyDataDetail = JSON.parse(JSON.stringify(this.state.detailProduct))

        // const modifiedDt = copyDataDetail.filter(dt => dt.id === selectedValue)
        const selectedText = selectedSize.options[selectedSize.selectedIndex].text
        const copyData = JSON.parse(JSON.stringify(this.state.dataProduct))
        const sizeData = copyData.filter(dt => dt.productId === selectedValue)
        for (var i = 0; i < sizeData[0].productDetail.length; i++) {

            var current = sizeData[0].productDetail[i]
            if (current.sizeId === selectedSize.value) {

                copyDataDetail.map((char, i) => {
                    if (char.id === sizeData[0].productId && char.key === idName) {
                        char.size = selectedText;
                        char.currentqty = current.quantity;
                        char.productDetailId = current.productDetailId;
                        char.price = sizeData[0].price
                    }

                })

                this.setState({
                    detailProduct: copyDataDetail
                })


                detail.innerHTML = current.productDetailId
                document.getElementById(idQty).max = current.quantity;

                return;
            }
            // elemSz.insertAdjacentHTML("beforeend", "<option value=" + current.sizeId + ">" + current.size + "<option>")
        }







    }
    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    addSoldPrice(e, idName) {
        const val = e.target.value;
        const copyDataDetail = JSON.parse(JSON.stringify(this.state.detailProduct))
        copyDataDetail.map((char, i) => {
            if (char.key === idName) {
                char.sold = parseInt(val)
            }

        })
        this.setState({
            detailProduct: copyDataDetail
        })
    }
    checkMax(e, idName) {

        const copyDataDetail = JSON.parse(JSON.stringify(this.state.detailProduct))
        const val = e.target.value;
        const max = e.target.max
        if (parseInt(val) > parseInt(max)) {

            e.preventDefault()
            e.target.value = max;
            copyDataDetail.map((char, i) => {
                if (char.key === idName) {
                    char.quantity = parseInt(max)
                }

            })
            this.setState({
                detailProduct: copyDataDetail
            })
        }
        else {

            copyDataDetail.map((char, i) => {
                if (char.key === idName) {
                    char.quantity = parseInt(val)
                }

            })
            this.setState({
                detailProduct: copyDataDetail
            })
        }
        // if()
    }

    checkValidationForm() {
        const list = document.getElementsByClassName("required-input");
        for (var i = 0; i < list.length; i++) {
            const current = list[i];
            if (current.value === "" || current.value === null || current.value === undefined) {
                const textInside = current.getAttribute("name");
                this.setState({
                    loading: "none",
                    alertColor: "danger",
                    onSuccess: !this.state.onSuccess,
                    successMsg: textInside
                })
                return false;

            }
        }
        return true;
    }
    processTransaction() {
        if (this.state.detailProduct.length && this.state.detailProduct.length > 0) {

            if (this.checkValidationForm()) {
                this.setState({
                    // dataProduct: this.state.dataProduct.concat(res.data),
                    loading: "block"
                })
                const obj = {}
                obj.admin = "ope";
                obj.dataTrans = this.state.detailProduct;
                obj.transDate = new Date(document.getElementById("transactiondate").value).toISOString();

                fetch(env.url + "transaction", {
                    method: "POST",
                    body: JSON.stringify(obj),

                    headers: {
                        "Content-Type": "application/json",
                        // "Content-Type": "application/x-www-form-urlencoded",
                    }
                })
                    .then(result => {
                        // document.getElementById("closeAddProduct").click();
                        return result.json()

                    })
                    .then(res => {
                        if (res.status !== 200) {

                            alert("failed")
                            console.log(res)

                        }
                        else {
                            // alert("success")
                            this.setState({
                                loading: "none",
                                formAppend: [],
                                onSuccess: !this.state.onSuccess,
                                alertColor: "primary",
                                successMsg: "Transaksi berhasil dengan total pembayaran " + res.data.totalPriceSells
                            })
                            // window.location.href = "/product"
                            console.log(res)
                        }
                    })
                    .catch(err => {
                        this.setState({
                            loading: "none",
                            alertColor: "danger",
                            onSuccess: !this.state.onSuccess,
                            successMsg: "Terjadi kesalahan pada server "
                        })
                        console.log(err)
                    })
            }
        }

    }
    render() {
        const dropDownProduct = this.state.dataProduct.map((dt, index) =>
            <option key={index} value={dt.productId}>{dt.productName}</option>
        )

        const dataAppend = this.state.formAppend.map(dt =>
            <div key={dt} className="row mb-2" id={`${dt}rm`}>
                <p className="dp-none" id={dt}></p>
                <div className="col-sm-5 mb-2">
                    <select id={`${dt}Nm`} onChange={() => this.appendSize(`${dt}Nm`, `${dt}Sz`, `${dt}Qty`, `${dt}Prc`, dt)} className="form-control">
                        <option value="" >Pilih Produk</option>
                        {dropDownProduct}
                    </select>
                </div>
                <div className="col-sm-2 mb-2">

                    <select id={`${dt}Sz`} onChange={() => this.setMaxQty(`${dt}Nm`, `${dt}Sz`, `${dt}Qty`, dt)} className="form-control data-typed">
                        <option value=""  >Pilih Size</option>

                    </select>
                </div>
                <div className="col-sm-2 mb-2">
                    <input type="number" className="form-control data-typed" onChange={(evt) => this.checkMax(evt, `${dt}Nm`)} id={`${dt}Qty`} min="1" placeholder="Qty"></input>

                </div>
                <div className="col-sm-2 mb-2">
                    <input type="number" className="form-control data-typed" id={`${dt}Prc`} onChange={(evt) => this.addSoldPrice(evt, `${dt}Nm`)} placeholder="Harga"></input>
                </div>
                <div className="col-sm-1 mb-2">
                    <button type="button" onClick={() => this.formPrepend(dt, `${dt}Nm`)} className="btn btn-danger" > <i className="fa fa-trash"></i></button>

                </div>
            </div>
        )
        return (
            <div>
                <Navbar></Navbar>
                <div className="container">
                    <Breadcrumb title={"Home"}></Breadcrumb>
                    <Alert color={this.state.alertColor} isOpen={this.state.onSuccess} toggle={this.onDismiss} fade={true}>
                        {this.state.successMsg}
                    </Alert>
                    <div className="card mb-3">
                        <div className="card-header text-white bg-dark">
                            <div className="row">
                                <div className="col-sm-3">
                                    <i className="fa fa-calculator"></i>
                                </div>
                                <div className="col-sm-6 hidden-xs"></div>
                                <div className="col-sm-3 float-right">
                                    <input type="date" id="transactiondate" name="Tanggal transaksi harus di isi" className="form-control data-typed required-input"></input>
                                </div>
                            </div>



                        </div>
                        <div className="container">
                            <div className="mb-2 mt-2">
                                {dataAppend}
                            </div>
                            <div className="row">
                                <div className="col-md-3 col-sm-12 col-xs-6">
                                    <button type="button" onClick={this.pushAppendChart} className="btn btn-primary mb-3 mt-3" > <i className="fa fa-plus-circle"></i> Tambah Cart</button>

                                </div>
                                <div className="col-md-6 hidden-xs"></div>
                                <div className="col-md-3 col-sm-12 col-xs-6">
                                    <button type="button" onClick={this.processTransaction} className="btn btn-primary mb-3 mt-3 float-right" > <i className="fa fa-credit-card"></i> Proses</button>

                                </div>
                            </div>
                            <ModalDialog></ModalDialog>
                            {/* <Table tableHeader={this.state.tableHead} tableBody={this.props.size} /> */}

                        </div>
                    </div>
                </div>
                <Loading showloading={this.state.loading} />
            </div >
        )
    }
}
