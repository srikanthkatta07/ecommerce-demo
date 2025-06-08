import { makeAutoObservable } from 'mobx';

class AdminStore {
  productName = '';
  productPrice = '';
  productImage = null;

  constructor() {
    makeAutoObservable(this);
  }

  setProductName(name) {
    this.productName = name;
  }

  setProductPrice(price) {
    this.productPrice = price;
  }

  setProductImage(image) {
    this.productImage = image;
  }
}

export default new AdminStore();
