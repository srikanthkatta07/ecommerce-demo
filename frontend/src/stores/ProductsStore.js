import { makeAutoObservable } from 'mobx';

class ProductsStore {
  products = [];

  constructor() {
    makeAutoObservable(this);
  }

  setProducts(products) {
    this.products = products;
  }
}

export default new ProductsStore();
