import { makeAutoObservable } from 'mobx';

class CartStore {
  cartItems = [];

  constructor() {
    makeAutoObservable(this);
  }

  addItem(item) {
    this.cartItems.push(item);
  }

  removeItem(itemId) {
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
  }

  clearCart() {
    this.cartItems = [];
  }

  get totalItems() {
    return this.cartItems.length;
  }
}

const cartStore = new CartStore();
export default cartStore;
