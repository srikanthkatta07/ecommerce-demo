import { makeAutoObservable } from 'mobx';

class LoginStore {
  username = '';
  password = '';

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username) {
    this.username = username;
  }

  setPassword(password) {
    this.password = password;
  }
}

export default new LoginStore();
