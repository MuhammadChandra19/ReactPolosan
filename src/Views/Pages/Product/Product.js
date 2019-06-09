import React, { Component } from 'react';
import Navbar from '../../../Component/Navbar/Navbar';
import Table from '../../../Component/Table/Table';
import Category from '../../../Component/Category/Category';
import Size from '../../../Component/Size/Size';
import env from '../../../env';
import ModalDialog from '../../../Component/ModalDialog/ModalDIalog';
import Breadcrumb from '../../../Component/Breadcrumb/Breadcrumb';
import { Alert } from 'reactstrap';
import Loading from '../../../Component/Loading/Loading';
import Pagination from '../../../Component/Pagination/Pagination';

export default class Product extends Component {

    constructor(props) {
        super(props)
        this.state = {
            category: [],
            size: [],
            appendSize: [],
            productDetail: [],
            productDetail2: [],
            dataHeader: ["Nama Produk", "Kategori", "Jumlah Produk", "Update"],
            dataProduct: [],
            dataUpdate: {},
            singleProduct: {},
            availsize: {},
            currentPage: 1,
            totalPage: 5,
            pageSize: 5,
            totalItems: 0,
            pagination: "",
            onSuccess: false,
            successMsg: "",
            loading: "block",
            alertColor: "primary"
        }
        this.loadCategory = this.loadCategory.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.makeInputRequired = this.makeInputRequired.bind(this);
        this.loadSize = this.loadSize.bind(this);
        this.loadProduct = this.loadProduct.bind(this);
        this.$ = this.$.bind(this);
        this.onChangeStock = this.onChangeStock.bind(this)
        this.postProduct = this.postProduct.bind(this)
        this.loadProductById = this.loadProductById.bind(this)
        this.addSize = this.addSize.bind(this)
        this.onUpdateStock = this.onUpdateStock.bind(this)
        this.nextPage = this.nextPage.bind(this)
        this.countProduct = this.countProduct.bind(this)
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidMount() {
        console.log("enter product")
        this.loadCategory()
        this.loadSize()
        this.loadProduct()
        this.countProduct()
    }
    $(val) {
        const x = document.getElementById(val).value;
        return x;
    }
    onDismiss() {
        this.setState({
            onSuccess: false
        }, () => window.location.href = "/product")
    }
    postProduct(e) {
        e.preventDefault();
        let data = {}
        let prodName = document.getElementById("productName").value

        let catId = document.getElementById("category").value
        let prc = document.getElementById("price").value
        // console.log(requireinput)

        if (prodName.length < 1 || prodName === "" || prodName === null) {
            alert("masukan nama produk")
            return;
        }
        if (catId.length < 1 || catId === "" || catId === null) {
            alert("masukan kategori")
            return;
        }
        if (prc.length < 1 || prc === "" || prc === null) {
            alert("masukan harga")
            return;
        }
        let requireinput = document.getElementsByClassName("req-input");
        for (var i = 0; i < requireinput.length; i++) {
            if (requireinput[i].value === "" || requireinput[i].value === 0 || requireinput[i].value === null) {
                alert(requireinput[i].name);
                return;
            }
        }

        data.productName = prodName
        data.categoryId = catId
        data.adminName = "ope"
        data.price = prc
        data.productDetail = this.state.productDetail
        console.log(data)

        fetch(env.url + "product", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(result => {
                document.getElementById("closeAddProduct").click();
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
                        onSuccess: !this.state.onSuccess,
                        successMsg: data.productName + " Berhasil di tambahkan"
                    })

                    console.log(res)
                }
            })
            .catch(err => {
                this.setState({
                    loading: "none",
                    onSuccess: !this.state.onSuccess,
                    successMsg: data.productName + "Terjadi kesalahan"
                })
                console.log(err)
            })


    }

    loadProductById(id) {
        this.setState({
            appendSize: [],
            availsize: {},
            productDetail: [],
            productDetail2: [],
            dataUpdate: {},
        }, () =>
                fetch(env.url + "product/" + id)
                    .then(response => {
                        return response.json()
                    })
                    .then(res => {

                        console.log(res.data[0])
                        this.setState({
                            dataUpdate: res.data[0]
                        })

                        for (var i = 0; i < res.data[0].sizes.length; i++) {
                            var current = res.data[0].sizes[i].size;
                            res.data[0].productDetail[i].currentQuantity = res.data[0].productDetail[i].quantity;
                            res.data[0].productDetail[i].quantity = 0
                            this.setState({
                                availsize: {
                                    ...this.state.availsize,
                                    [current]: true
                                },
                                productDetail2: res.data[0].productDetail
                            })

                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
        )


    }
    countProduct() {
        fetch(env.url + "productCount")
            .then(response => {
                return response.json()
            })
            .then(res => {

                console.log(res.count)
                this.setState({
                    totalItems: res.count,
                    totalPage: Math.ceil(res.count / this.state.pageSize),
                    pagination: (<Pagination callParent={this.loadProduct} pageFunction={this.nextPage} maxPages={Math.ceil(res.count / this.state.pageSize)} pageSize={this.state.pageSize} totalItems={res.count} currentPage={this.state.currentPage}></Pagination>)
                })



            })
            .catch(err => {
                console.log(err)
            })
    }
    loadProduct() {
        let current = this.state.currentPage
        let page = current -= 1;
        console.log(page)
        this.setState({

            loading: "block"
        })
        fetch(env.url + "product?skip=" + page * this.state.pageSize + "&limit=" + this.state.pageSize)
            .then(response => {
                return response.json()
            })
            .then(res => {
                console.log(res)
                let productobj = [];
                let waiters = res.data.length
                for (var i = 0; i < res.data.length; i++) {

                    let current = res.data[i];
                    console.log(current)
                    let productdata = {};

                    productdata.id = current.productId;
                    productdata.productName = current.productName;
                    productdata.categoryName = current.categoryId[0].categoryName;
                    productdata.stock = current.stock;
                    productdata.button = (<button className="btn btn-warning" data-toggle="modal" data-target="#updateProductModal" onClick={() => this.loadProductById(current.productId)}>
                        <i className="fa fa-edit"></i>
                    </button>);
                    // productdata.button.push({
                    //     action: (<button className="btn btn-primary" data-toggle="modal" data-target="#updateProduct" onClick={() => this.updateProduct("pjfaefibef")}>
                    //         <i className="fa fa-edit"></i>
                    //     </button>)
                    // })

                    productobj.push(productdata);
                    waiters--;
                    if (waiters === 0) {
                        this.setState({
                            dataProduct: productobj,
                            loading: "none"
                        })
                    }



                }

            })
            .catch(err => {
                console.log(err)
                this.setState({

                    loading: "none"
                })
            })
    }
    makeInputRequired(index, id, idinput) {
        console.log(index)
        let value = this.$(id);
        let item = {
            sizeId: value,
            quantity: 0,
            index: index.idx
        }
        document.getElementById(idinput)
        if (document.getElementById(id).checked) {
            document.getElementById(idinput).classList.add("req-input");
            document.getElementById(idinput).removeAttribute("disabled")
            console.log(document.getElementById(idinput).attributes)
            this.setState({
                productDetail: [
                    ...this.state.productDetail,
                    item
                ]
            })
        }
        else {
            document.getElementById(idinput).value = 0;
            document.getElementById(idinput).classList.remove("req-input");
            document.getElementById(idinput).setAttribute("disabled", "");
            this.setState({
                productDetail: this.state.productDetail.filter((char, i) => {
                    return char.index !== index.idx
                })
            })
        }

    }
    onChangeStock(index, id) {
        let value = this.$(id);

        if (value.length > 0) {
            const copyData = JSON.parse(JSON.stringify(this.state.productDetail))
            copyData.map((char, i) => {

                if (char.index === index.idx) {

                    copyData[i].quantity = parseInt(value)

                }
            })

            this.setState({
                productDetail: copyData
            })


        }

    }
    onUpdateStock(idDetail, id) {
        let value = this.$(id);
        if (value.length > 0) {
            const copyData = JSON.parse(JSON.stringify(this.state.productDetail2))
            copyData.map((char, i) => {

                if (char.productDetailId === idDetail) {

                    copyData[i].quantity = parseInt(value)

                }
            })

            this.setState({
                productDetail2: copyData
            })


        }
    }

    loadSize() {
        fetch(env.url + "size")
            .then(response => {
                return response.json()
            })
            .then(res => {
                console.log(res)
                this.setState({
                    size: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    loadCategory() {
        fetch(env.url + "category")
            .then(response => {
                return response.json()
            })
            .then(res => {
                console.log(res)
                this.setState({
                    category: res.data
                })
            })
            .catch(err => {
                console.log(err)
            })
    }
    deleteProduct = (id) => {
        console.log(id)
    }
    updateProduct = (e) => {

        e.preventDefault()
        let data = {};
        let value = this.$("newprice");
        data.productDetail = this.state.productDetail2;
        data.newData = this.state.productDetail
        console.log(this.$("newprice"))
        if (value.length > 0) {
            data.price = this.$("newprice")
        }
        else {
            data.price = this.state.dataUpdate.price
        }
        let requireinput = document.getElementsByClassName("req-input");
        for (var i = 0; i < requireinput.length; i++) {
            if (requireinput[i].value === "" || requireinput[i].value === 0 || requireinput[i].value === null) {
                alert(requireinput[i].name);
                return;
            }
        }

        this.setState({
            loading: "block"
        })
        fetch(env.url + "product/" + this.state.dataUpdate.productId, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        }).then(response => {
            return response.json()
        })
            .then(res => {
                console.log(data)
                document.getElementById("appendSize").selectedIndex = 0;
                document.getElementById("newprice").value = ""
                document.getElementById("closeUpdateProduct").click();
                if (res.status !== 200) {

                    alert("failed")
                    console.log(res)

                }
                else {
                    // alert("success")
                    console.log(res)
                    // window.location.href = "/product"
                    this.setState({
                        loading: "none",
                        onSuccess: !this.state.onSuccess,
                        successMsg: "Berhasil update produk",
                        alertColor: "primary"
                    })
                }
            })
            .catch(err => {
                console.log(err)
                this.setState({
                    loading: "none",
                    onSuccess: !this.state.onSuccess,
                    successMsg: data.productName + "Terjadi kesalahan",
                    alertColor: "danger"
                })
            })
    }

    addSize = (id) => {
        let keys = document.getElementById(id).value;
        let obj = this.state.size[keys]
        console.log("ini object", obj)
        this.setState({
            appendSize: [...this.state.appendSize, obj]
        })
    }

    nextPage(page, callback) {
        this.setState({
            currentPage: page
        }, () => callback(this.state.totalItems, this.state.currentPage, this.state.pageSize, this.state.totalPage, this.loadProduct))


    }

    render() {
        const category = this.state.category.map((data, idx) =>
            <option value={data.categoryId}>{data.categoryName}</option>
        )
        const sizeUpdate = this.state.appendSize.map((data, idx) =>
            <div className="mb-2" key={idx}>
                <div className="row">
                    <div className="col-sm-4">
                        <div class="form-check">
                            <input class="form-check-input data-check" type="checkbox" name={`${data.size}Size`} id={`${data.size}Sizeupdate`} onChange={() => this.makeInputRequired({ idx }, `${data.size}Sizeupdate`, `${data.size}qtyupdate`)} value={data.sizeId}></input>
                            <label class="form-check-label" htmlFor={`${data.size}Sizeupdate`}>
                                {data.size}
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id={data.sizeId} value={data.upsizePrice} style={{ display: "none" }}></input>
                        <input type="number" className="form-control check-required data-typed" id={`${data.size}qtyupdate`} name={`Jumlah produk ukuran ${data.size} harus di isi`} placeholder="Jumlah produk" autoComplete="off" onChange={() => this.onChangeStock({ idx }, `${data.size}qtyupdate`)} disabled ></input>
                    </div>
                </div>
            </div>
        )
        const sizesInput = this.state.size.map((data, idx) =>
            <div className="mb-2" key={idx}>
                <div className="row">
                    <div className="col-sm-4">
                        <div class="form-check">
                            <input class="form-check-input data-check" type="checkbox" name={`${data.size}Size`} id={`${data.size}Size`} onChange={() => this.makeInputRequired({ idx }, `${data.size}Size`, `${data.size}qty`)} value={data.sizeId}></input>
                            <label class="form-check-label" htmlFor={`${data.size}Size`}>
                                {data.size}
                            </label>
                        </div>
                    </div>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" id={data.sizeId} value={data.upsizePrice} style={{ display: "none" }}></input>
                        <input type="number" className="form-control check-required data-typed" id={`${data.size}qty`} name={`Jumlah produk ukuran ${data.size} harus di isi`} placeholder="Jumlah produk" autoComplete="off" onChange={() => this.onChangeStock({ idx }, `${data.size}qty`)} disabled ></input>
                    </div>
                </div>
            </div>
        )

        const updateSize = (this.state.dataUpdate.productDetail ? (this.state.dataUpdate.productDetail.map((data, idx) =>
            <div className="mb-2" key={idx}>

                <div className="row">
                    <div className="col-sm-6">
                        <label>ukuran {this.state.dataUpdate.sizes[idx].size} tersedia:</label>
                    </div>
                    <div className="col-sm-3">
                        <label>{data.currentQuantity} pcs</label>
                        {/* <input type="number" className="form-control check-required data-typed" value={`stock awal ${data.quantity}`} id={`${data.size}qty`} placeholder={`stock awal ${data.quantity}`} autoComplete="off" onChange={() => this.onChangeStock({ idx }, `${this.state.dataUpdate.sizes[idx].size}qty`)} disabled ></input> */}
                    </div>
                    <div className="col-sm-3">
                        <input type="number" className="form-control check-required data-typed" id={`${this.state.dataUpdate.sizes[idx].sizeId}qtyupdatenm`} placeholder="tambah produk" autoComplete="off" onChange={() => this.onUpdateStock(`${data.productDetailId}`, `${this.state.dataUpdate.sizes[idx].sizeId}qtyupdatenm`)} ></input>

                    </div>
                </div>
            </div>
        )) : (<div></div>))


        return (
            <div>
                <Navbar></Navbar>

                <div className="container">
                    <Breadcrumb title={"Produk"}></Breadcrumb>
                    <Alert color={this.state.alertColor} isOpen={this.state.onSuccess} toggle={this.onDismiss} fade={true}>
                        {this.state.successMsg}
                    </Alert>
                    <div class="card mb-3 mt-3">
                        <div class="card-header text-white bg-dark">Daftar produk polosan</div>
                        <div className="container">
                            <div className="mb-5 mt-5">
                                <button type="button" data-toggle="modal" data-target="#addProduct" className="btn btn-primary"> <i className="fa fa-plus-circle"></i> Tambah Produk</button>

                            </div>
                            <Table tableHeader={this.state.dataHeader} tableBody={this.state.dataProduct} actionRemove={this.deleteProduct} actionUpdate={this.updateProduct} />

                        </div>
                        <div class="card-footer">
                            {this.state.pagination}
                            {/* <Pagination pageFunction={this.nextPage} maxPages={3} pageSize={5} totalItems={12} currentPage={1}></Pagination> */}

                            {
                                /* <Pagination pageFunction={this.nextPage} maxPages={this.state.totalPage} pageSize={this.state.pageSize} totalItems={this.state.totalItems} currentPage={this.state.currentPage}></Pagination> */}
                        </div>
                    </div>
                    <div className="row mt-5">
                        <div className="col-sm-4">
                            <Category category={this.state.category}></Category>
                        </div>
                        <div className="col-sm-4">
                            <Size size={this.state.size}></Size>
                        </div>
                        <div className="col-sm-4">

                        </div>

                    </div>
                </div>

                <ModalDialog id={"addProduct"} title={"Masukan Produk Baru"} idClose={"closeAddProduct"}>
                    <form id="dataProdukBaru">
                        <div className="form-row">
                            <div className="col-sm-6 mb-2">
                                <label htmlFor="validationCustom01">Nama produk</label>
                                <input autoComplete="off" type="text" className="form-control" id="productName" placeholder="Masukan nama produk" required></input>
                            </div>
                            <div className="col-sm-3 mb-2">
                                <label htmlFor="category">Kategori</label>
                                <select id="category" className="form-control" required>
                                    <option value="" disabled selected>pilih kategori</option>
                                    {category}
                                </select>
                            </div>
                            <div className="col-sm-3 mb-2">
                                <label htmlFor="price">Harga</label>
                                <input autoComplete="off" type="number" className="form-control" id="price" placeholder="Masukan harga" required></input>

                            </div>
                            <div className="col-sm-12 mb-5">
                                <label htmlFor="validationCustom0">Tambah size dan jumlah stok</label>
                                <div className="row" id="validationCustom0">
                                    <div className="col-sm-12">
                                        {sizesInput}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-primary ml-auto" onClick={this.postProduct} type="submit"><i className="fa fa-plus-circle"></i> Tambah Produk</button>
                    </form>
                </ModalDialog>
                <ModalDialog id={"updateProductModal"} title={"Update Product"} idClose={"closeUpdateProduct"}>
                    <form id="updateProduct">
                        <div className="form-row">

                            <div className="col-sm-6 mb-2">
                                <label htmlFor="validationCustom01">Nama produk</label>
                                <input autoComplete="off" type="text" className="form-control" id="updateproductName" placeholder="Masukan nama produk" value={this.state.dataUpdate.productName} disabled></input>
                            </div>
                            <div className="col-sm-3 mb-2">
                                <label htmlFor="category">Kategori</label>
                                <select id="cupdateategory" className="form-control" disabled>
                                    <option value="" disabled selected>{this.state.dataUpdate.category}</option>

                                </select>
                            </div>
                            <div className="col-sm-3 mb-2">
                                <label htmlFor="price">Harga awal</label>
                                <input autoComplete="off" type="number" className="form-control" id="oldPrice" placeholder="Masukan harga" value={this.state.dataUpdate.price} disabled></input>

                            </div>
                            <div className="col-sm-4 mb-2">
                                <label htmlFor="price">Harga baru</label>
                                <input autoComplete="off" type="number" className="form-control" id="newprice" placeholder="Masukan harga" required></input>

                            </div>
                            <div className="col-sm-12 mb-5">
                                <label htmlFor="stckdef">Stock Tersedia </label>
                                <div className="row" id="stckdef">
                                    <div className="col-sm-12">
                                        {updateSize}
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 mb-5">
                                <label htmlFor="validationCustom0">Update atau tambah size baru</label>
                                <select id="validationCustom0" id="appendSize" onChange={() => this.addSize("appendSize")} className="form-control">
                                    <option value="" disabled selected>Tambah size baru</option>
                                    {this.state.size.map((data, idx) => {
                                        return !this.state.availsize[data.size] ? (<option thisindex={idx} key={idx} value={idx}>{data.size}</option>) : (<option thisindex={idx} key={idx} value={idx} disabled>{data.size}</option>)
                                    }
                                        // <option thisindex={idx} key={idx} value={idx}>{data.size}</option>

                                    )}
                                </select>
                            </div>
                            <div className="col-sm-12 mb-5">

                                <div className="row" id="validationCustom0">
                                    <div className="col-sm-12">
                                        {sizeUpdate}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-warning ml-auto" onClick={this.updateProduct} type="submit"><i className="fa fa-edit"></i> Update Produk</button>
                    </form>
                </ModalDialog>
                <Loading showloading={this.state.loading} />

            </div >
        )
    }
}