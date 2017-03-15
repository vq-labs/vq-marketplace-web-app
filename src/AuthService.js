class AuthServiceFactory {
  constructor() {
    this.authToken = this.getAuthToken();
    this.userId = this.getUserId();

    this.isAuth = this.isAuth.bind(this);
    this.logout = this.logout.bind(this);
    this.putAuthToken = this.putAuthToken.bind(this);
    this.getAuthToken = this.getAuthToken.bind(this);
    this.putUserId = this.putUserId.bind(this);
  }
  
  isAuth() {
    return this.getAuthToken();
  }

  logout() {
    this.authToken = '';
    this.userId = '';
    this.putAuthToken('');
    this.putUserId('');
  }

  putAuthToken (token) {
    localStorage.setItem('ST_AUTH_TOKEN', token);
  }

  putUserId (userId) {
    localStorage.setItem('ST_AUTH_USERID', userId);
  }
  getUserId () {
      return localStorage.getItem('ST_AUTH_USERID');
  }
  getAuthToken() {
    return localStorage.getItem('ST_AUTH_TOKEN');
  }
}


let AuthService;

if ( !AuthService ) {
    AuthService =  new AuthServiceFactory();
}


export default AuthService;