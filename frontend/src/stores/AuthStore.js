import { makeAutoObservable } from 'mobx';

class AuthStore {
  isLoggedIn = false;
  role = null;

  constructor() {
    makeAutoObservable(this);
    this.checkAuthState();
    window.addEventListener('storage', this.checkAuthState);
  }

  checkAuthState = () => {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    if (token) {
      fetch('/api/users/validate-token', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          this.role = data.role;
        })
        .catch(() => {
          this.role = null;
        });
    } else {
      this.role = null;
    }
  };

  logout = () => {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.role = null;
  };
}

const authStore = new AuthStore();
export default authStore;
