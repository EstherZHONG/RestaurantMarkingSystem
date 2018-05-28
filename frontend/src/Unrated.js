import React, { Component } from 'react';
import UnratedOrder from './UnratedOrder';

// function Message(props) {
//   const message = props.message;
//   if (message !== '') {
//     return(<p> {message} </p>);
//   }
//   return null;
// }

// function OrderList(props) {
//   if (props.orders.length === 0) {
//     return (<p>No unrated order</p>);
//   }
//   const OrderList = props.orders.map((order) => {
//     if (props.orders.length === 0) {
//       return (<p>No unrated order</p>);
//     }
//     return(
//       <UnratedOrder
//         key={order.id.toString()}
//         category={props.category}
//         value={order}
//         onRedirect={(id, category, page) => props.onRedirect(id, category, page)}
//       />
//     );
//   });
//   return (
//     <div>
//       {OrderList}
//     </div>
//   );
// }

function sqlToJsDateTime(dateStr) {
  const a=dateStr.slice(0, -5).split("T");
  const d=a[0].split("-");
  const t=a[1].split(":");
  const formatedDate = new Date(d[0],(d[1]-1),d[2],t[0],t[1],t[2]);
  return formatedDate;
}

class Unrated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      category: '',
      orders: [],
      selected: 'unrated',
    };
    this.handleRedirect = this.handleRedirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    await this.setState({[name]: value});
    switch(this.state.selected) {
      case 'unrated':
      this.sortByUnrated();
      break;
      case 'rated':
      this.sortByRated();
      break;
      case 'rate0':
      this.sortByRate0();
      break;
      case 'rate1':
      this.sortByRate1();
      break;
      case 'price':
      this.sortByPrice();
      break;
      case 'time':
      this.sortByTime();
      break;
      default:
      this.sortByUnrated();
      break;
    }
  }


  sortByUnrated() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (a.rate0 != null && a.rate1 != null && (b.rate0 == null || b.rate1 == null));
      }),
    });
  }
  sortByRated() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (b.rate0 != null && b.rate1 != null && (a.rate0 == null || a.rate1 == null));
      }),
    });
  }
  sortByRate0() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (b.rate0 - a.rate0);
      }),
    });
  }
  sortByRate1() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (b.rate1 - a.rate1);
      }),
    });
  }
  sortByPrice() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (b.totalPrice - a.totalPrice);
      }),
    });
  }
  sortByTime() {
    this.setState({
      orders: this.state.orders.sort((a, b) => {
        return (sqlToJsDateTime(b.orderTime) > sqlToJsDateTime(a.orderTime));
      }),
    });
  }

  async componentDidMount() {
    try {
      await this.getUnrated();
      // const res = await this.getUser();
      // this.setState({ response: res.express });
    } catch(err) {
      console.log(err);
    }
  }

  async getUnrated() {
    const response = await fetch('/unrated', {
        method: 'GET',
        credentials: 'include',
      });
    if (response.status === 200) {
      const body = await response.json();
        this.setState({
          id: body.id,
          category: body.category,
          orders: body.orders,
        });
        this.sortByUnrated();
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
        <UnratedOrder
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
          <select name='selected' value={this.state.selected} onChange={this.handleChange}>
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
      </div>
    );
  }
}

export default Unrated;
