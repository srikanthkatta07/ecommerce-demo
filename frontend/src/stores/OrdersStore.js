import { makeAutoObservable } from 'mobx';

class OrdersStore {
  orders = [];

  constructor() {
    makeAutoObservable(this);
  }

  setOrders(orders) {
    this.orders = orders;
  }
}

export default new OrdersStore();
