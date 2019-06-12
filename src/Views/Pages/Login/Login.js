import React, { Component } from 'react';
import env from '../../../env';
import { Alert } from 'reactstrap';
import Loading from '../../../Component/Loading/Loading';
export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: "Rai rizki",
                password: "Raieizkigebleg"
            },
            onSuccess: false,
            successMsg: "",
            loading: "none",
            alertColor: "primary",
            isSend: false,
            auth: "",
            username: "",
            btnText: "kirim password ke email"
        }

        this.login = this.login.bind(this)
        this.onDismiss = this.onDismiss.bind(this)
        this.makeid = this.makeid.bind(this)
        this.checkValidity = this.checkValidity.bind(this)
        this.sendEmail = this.sendEmail.bind(this)

    }
    login() {
        const password = document.getElementById("password");
        if (password.checkValidity()) {
            if (password.value == this.state.auth) {
                localStorage.setItem('lastLoginPolosan', new Date())
                localStorage.setItem('polos', this.state.auth)
                localStorage.setItem('polosanSign', true)
                localStorage.setItem('username', this.state.username)
                this.setState({
                    loading: "none"
                }, () => { window.location.href = "/" })
            }

        }
        else {
            this.setState({
                onSuccess: true,
                successMsg: password.validationMessage,
                alertColor: "danger"

            })
            // alert(email.validationMessage)
        }
    }
    makeid(mail, length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return this.setState({
            auth: result
        }, () => this.sendEmail(mail))

    }
    onDismiss() {
        this.setState({
            onSuccess: false
        })
    }
    sendEmail(mail) {
        let data = {}
        data.email = mail;
        data.password = this.state.auth;
        console.log(data)
        fetch(env.url + "login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
            }
        })
            .then(result => {
                // document.getElementById("closeAddSize").click();
                return result.json()

            })
            .then(res => {

                if (res.status === 200) {
                    this.setState({
                        onSuccess: true,
                        loading: "none",
                        successMsg: "Password di kirim ke " + mail,
                        alertColor: "primary",
                        btnText: "Login",
                        isSend: true,
                        username: res.doc[0].username
                    }


                    )
                }
                else {
                    this.setState({
                        onSuccess: true,
                        loading: "none",
                        successMsg: "email tidak terdaftar",
                        alertColor: "danger"

                    })
                }


            })
            .catch(err => {
                this.setState({
                    onSuccess: true,
                    loading: "none",
                    successMsg: "terjadi kesalahan pada server",
                    alertColor: "danger"

                })
                console.log(err)
            })

    }
    checkValidity(e) {
        e.preventDefault()
        const email = document.getElementById("emailtxt");

        if (this.state.isSend) {
            this.login()
        }
        else {
            if (email.checkValidity()) {

                this.setState({
                    loading: "block",

                }, this.makeid(email.value, 7))
            }
            else {
                this.setState({
                    onSuccess: true,
                    successMsg: email.validationMessage,
                    alertColor: "danger"

                })
                // alert(email.validationMessage)
            }
        }

    }
    render() {
        return (
            <div>
                <div className="container mt-5">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <Alert color={this.state.alertColor} isOpen={this.state.onSuccess} toggle={this.onDismiss} fade={true}>
                                {this.state.successMsg}
                            </Alert>
                            <div className="card mb-3 mt-3">
                                <div className="card-header text-white bg-dark">Polosan geh admin login</div>
                                <div className="container mt-3">
                                    <form id="formLogin" className="mb-5">
                                        <div className="form-row">
                                            <div className="col-sm-12 mb-2">
                                                <label htmlFor="username">username</label>
                                                <input autoComplete="off" type="email" className="form-control" id="emailtxt" required></input>
                                            </div>
                                            <div className="col-sm-12 mb-2">
                                                <label htmlFor="username">password</label>
                                                <input autoComplete="off" type="password" className="form-control" id="password" required></input>
                                            </div>
                                            <button type="submit" onClick={this.checkValidity} className="btn btn-primary btn-block mt-2">{this.state.btnText}</button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                    <Loading showloading={this.state.loading} />
                </div>


            </div>
        )

    }
}