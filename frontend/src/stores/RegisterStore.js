import { makeAutoObservable } from 'mobx';

class RegisterStore {
  username = '';
  email = '';
  password = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.username = username;
  }

  setEmail(email) {
    this.email = email;
  }

  setPassword(password) {
    this.password = password;
  }
}

export default new RegisterStore();
