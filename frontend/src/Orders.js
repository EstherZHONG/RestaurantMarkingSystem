import React, { Component } from 'react';
import Order from './Order';

class PageSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      pre: props.page>0,
      next: props.next,
    };
    console.log(props.count);
    this.updatePage = this.updatePage.bind(this);
  }
  componentWillReceiveProps(props) {
    this.setState({
      page: props.page,
      pre: props.page>0,
      next: props.next,
    });
  }
  updatePage(newPage) {
    this.props.updatePage(newPage>0?newPage:0);
  }

  render() {
    if (this.state.pre && this.state.next) {
      return (
        <div>
          <button onClick={()=>this.updatePage(this.state.page-1)}> Previous Page </button>
          <button onClick={()=>this.updatePage(this.state.page+1)}> Next Page </button>
        </div>
      );
    } else if (this.state.pre) {
      return (
        <div>
          <button onClick={()=>this.updatePage(this.state.page-1)}> Previous Page </button>
        </div>
      );
    } else if (this.state.next) {
      return (
        <div>
          <button onClick={()=>this.updatePage(this.state.page+1)}> Next Page </button>
        </div>
      );
    } else {return (<div></div>);}
  }
}

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      category: '',
      orders: [],
      sort: 'unrated',
      page: 0,
      ordersPerPage: 1,
      next: false,
    };
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }

  async updatePage(newPage) {
    await this.setState({ page: newPage > 0 ? newPage : 0, });
    await this.getOrders();
  }

  async handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    await this.setState({[name]: value, page: 0,});
    await this.getOrders();
}


 async componentDidMount() {
    try {
      await this.getOrders();
    } catch(err) {
      console.log(err);
    }
  }

  async getOrders() {
    const response = await fetch('/orders', {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          sort: this.state.sort,
          limitHead: this.state.page*this.state.ordersPerPage,
          limitTail: (this.state.page+1)*this.state.ordersPerPage+1,
        }),
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      });
    if (response.status === 200) {
      const body = await response.json();
      await this.setState({
        id: body.id,
        category: body.category,
        next: body.orders.length > this.state.ordersPerPage,
        orders: body.orders.slice(0,this.state.ordersPerPage),
      });
    } else if (response.status === 401) {
      this.props.handleRedirect('', '', 'login');
    } else {
      this.props.handleRedirect('', '', 'error');
    }
  }

  handleRedirect(id, category, page) {
    this.props.onRedirect(id, category, page);
  }

  render() {
    const categories = ['Client', 'Restaurant', 'Deliverer'];
    const OrderList = this.state.orders.map((order) => {
      if (this.state.orders.length === 0) {
        return (<p>No unrated order</p>);
      }
      return(
        <Order
          key={order.id.toString()}
          category={this.state.category}
          value={order}
          onRedirect={(id, category, page) => this.handleRedirect(id, category, page)}
        />
      );
    });
    return (
      <div>
        <label>
          Sort By:
          <select name='sort' value={this.state.sort} onChange={this.handleChange}>
            <option value='unrated'> unrated </option>
            <option value='rated'> rated </option>
            <option value='rate0'> {categories[(this.state.category+1)%3]} rate </option>
            <option value='rate1'> {categories[(this.state.category+2)%3]} rate </option>
            <option value='price'> price </option>
            <option value='time'> time </option>
          </select>
        </label>
        <p>Orders: </p>
        <div>{OrderList}</div>
        <PageSelect page={this.state.page} next={this.state.next} updatePage={this.updatePage} />
      </div>
    );
  }
}

export default Orders;


  // sortByUnrated() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (a.rate0 != null && a.rate1 != null && (b.rate0 == null || b.rate1 == null));
  //     }),
  //   });
  // }
  // sortByRated() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (b.rate0 != null && b.rate1 != null && (a.rate0 == null || a.rate1 == null));
  //     }),
  //   });
  // }
  // sortByRate0() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (b.rate0 - a.rate0);
  //     }),
  //   });
  // }
  // sortByRate1() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (b.rate1 - a.rate1);
  //     }),
  //   });
  // }
  // sortByPrice() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (b.totalPrice - a.totalPrice);
  //     }),
  //   });
  // }
  // sortByTime() {
  //   this.setState({
  //     orders: this.state.orders.sort((a, b) => {
  //       return (sqlToJsDateTime(b.orderTime) > sqlToJsDateTime(a.orderTime));
  //     }),
  //   });
  // }

 