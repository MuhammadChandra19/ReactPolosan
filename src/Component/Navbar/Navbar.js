import React, { Component } from 'react';
import NavLink from './NavLink';

export default class Navbar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            link: [{
                href: "/",
                title: "Home",
                active: (<span className="sr-only">(current)</span>),
                className: "nav-item active"
            },
            {
                href: "/product",
                title: "Produk",
                active: "",
                className: "nav-item active"
            },
            {
                href: "/transaction",
                title: "Transaksi",
                active: "",
                className: "nav-item active"
            }
                ,
            {
                href: "/",
                title: "Audit",
                active: "",
                className: "nav-item active"
            }
            ]


        }
        // this.checkActive = this.checkActive.bind(this);


    }

    render() {
        const navigation = this.state.link.map((nav, i) =>
            <li key={i} className={nav.className}>
                {/* <NavLink to={nav.href}>

                    {nav.title}
                </NavLink> */}
                <a className="nav-link" dt={i} href={nav.href}>{nav.title} {nav.active}</a>
            </li>

        )
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand" href="/">Polosan Geh</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav ml-auto">
                        {/* <li className="nav-item active">
                            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/product">Product</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Transaction</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Audit</a>
                        </li> */}
                        {navigation}
                    </ul>
                </div>
            </nav>
        )
    }

}