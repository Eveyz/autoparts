import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";

import LoginForm from './users/LoginForm'
import BrandList from './Brand/BrandList'
import PartListContainer from './Brand/PartListContainer'
import OrderListContainer from './order/OrderListContainer'
import LogContainer from './log/LogContainer'
import CartListContainer from './cart/CartListContainer'
import Order from './order/Order'
import OrderPrint from './order/OrderPrint'
import CompanyListContainer from './company/CompanyListContainer'
import CompanyContainer from './company/CompanyContainer'
import ProfitDashboard from './profit/ProfitDashboard'

class Routes extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={LoginForm} />
        <Route exact path="/cart" component={CartListContainer} />
        <Route exact path="/logs" render={(props) => <LogContainer {...props} />} />
        <Route exact path="/companies" render={(props) => <CompanyListContainer {...props} />} />
        <Route exact path="/companies/:_id" render={(props) => <CompanyContainer {...props} />} />
        <Route exact path="/profit" render={(props) => <ProfitDashboard {...props} />} />
        <Route exact path="/orders" render={(props) => <OrderListContainer {...props} />} />
        <Route exact path="/orders/:_id/print" render={(props) => <OrderPrint {...props} />} />
        <Route exact path="/orders/:_id" render={(props) => <Order {...props} />} />
        <Route exact path="/brands" component={BrandList} />
        <Route exact path="/brands/toyota" render={(props) => <PartListContainer {...props} brand="toyota" />} />
        <Route exact path="/brands/nissan" render={(props) => <PartListContainer {...props} brand="nissan" />} />
        <Route exact path="/brands/mitsubishi" render={(props) => <PartListContainer {...props} brand="mitsubishi" />} />
        <Route exact path="/brands/honda" render={(props) => <PartListContainer {...props} brand="honda" />} />
      </Switch>
    );
  }
}

export default Routes;
