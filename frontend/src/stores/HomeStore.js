import { makeAutoObservable } from 'mobx';

class HomeStore {
  welcomeMessage = 'Welcome to the E-commerce App';

  constructor() {
    makeAutoObservable(this);
  }

  setWelcomeMessage(message) {
    this.welcomeMessage = message;
  }
}

export default new HomeStore();
