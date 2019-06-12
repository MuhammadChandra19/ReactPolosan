import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Component/Navbar/Navbar';
import Home from '../src/Views/Pages/Home/Home';
import Product from '../src/Views/Pages/Product/Product';
import Transaction from '../src/Views/Pages/Transaction/Transaction';
import Login from '../src/Views/Pages/Login/Login';
import { HashRouter, Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';


class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      polos: "",
      isSignup: false,
      username: "",
      lastLogin: null
    }
    this.changeState = this.changeState.bind(this)
  }

  componentDidMount() {
    this.setState({
      polos: localStorage.getItem('polos'),
      isSignup: localStorage.getItem('polosanSign'),
      username: localStorage.getItem('username'),
      lastLogin: localStorage.getItem('lastLoginPolosan')
    }, () => {
      let datenow = new Date()
      let hours = Math.floor(Math.abs(datenow - this.state.lastLogin) / 36e5)
      if (this.state.lastLogin == null || hours >= 1) {
        if (window.location.href.includes('login')) {
          return;
        } else {
          window.location.href = '/login';
        }
      }

      if (this.state.polos == null || !this.state.isSignup) {
        console.log(this.state.polos)
        if (window.location.href.includes('login')) {
          return;
        } else {
          window.location.href = '/login';
        }
      }
    })
  }
  changeState() {
    this.setState({
      polos: localStorage.getItem('polos'),
      isSignup: localStorage.getItem('isSignup'),
      username: localStorage.getItem('username')
    }, () => window.location.href = "/product")
  }
  render() {

    return (
      <BrowserRouter>
        <Switch>

          {/* <Route exact path="/register" name="Register Page" component={Register} /> */}
          {/* <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} /> */}
          <Route exact path="/login" name="Transaction" component={Login} />
          <Route exact path="/transaction" name="Transaction" component={Transaction} />
          <Route exact path="/product" name="Product" component={Product} />
          <Route path="/" name="Home" component={Home} />


        </Switch>
      </BrowserRouter>
    );
  }

}

export default App;
