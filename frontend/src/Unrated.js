import React, { Component } from 'react';
import UnratedOrder from './UnratedOrder';

// function Message(props) {
//   const message = props.message;
//   if (message !== '') {
//     return(<p> {message} </p>);
//   }
//   return null;
// }

function OrderList(props) {
  const OrderList = props.orders.map((order) =>
    // Correct! Key should be specified inside the array.
    <UnratedOrder key={order.id.toString()} value={order} />

  );
  return (
    <div>
      {OrderList}
    </div>
  );
}

class Unrated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      category: '',
      orders: [],
    };

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
        console.log(body.orders);
    } else if (response.status === 401) {
      this.props.handleRedirect('', '', 'login');
    } else {
      this.props.handleRedirect('', '', 'error');
    }
  }

  render() {
    return (
      <div>
        <p>Orders: </p>
        <OrderList orders={this.state.orders} />
      </div>
    );
  }
}

export default Unrated;
