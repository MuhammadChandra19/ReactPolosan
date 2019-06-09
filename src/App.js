import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Navbar from './Component/Navbar/Navbar';
import Home from '../src/Views/Pages/Home/Home';
import Product from '../src/Views/Pages/Product/Product';
import Transaction from '../src/Views/Pages/Transaction/Transaction';
import { HashRouter, Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';


class App extends Component {

  constructor(props) {
    super(props)
  }
  render() {
    return (
      <BrowserRouter>
        <Switch>

          {/* <Route exact path="/register" name="Register Page" component={Register} /> */}
          {/* <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} /> */}
          <Route exact path="/transaction" name="Transaction" component={Transaction} />
          <Route exact path="/product" name="Product" component={Product} />
          <Route path="/" name="Home" component={Home} />


        </Switch>
      </BrowserRouter>
    );
  }

}

export default App;
