import 'whatwg-fetch';
import AuthService from './AuthService'
import CONFIG from './generated/ConfigProvider.js'

const API_URL = CONFIG.API_URL;

function parseJSON (response) {
   
  let jsonResponse;

  try {
      jsonResponse = response.json();
  } catch (err) {
      console.warn("jsonResponse could not be parsed")
  }
  

  return jsonResponse;
}

const StActions = {
  activateTask(taskId, cb) {
        fetch(API_URL + '/task/' + taskId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
          body: JSON.stringify({ status: 0 })
      }).then(parseJSON).then( result => {
          cb(result);
      }).catch(err => {
        console.error(err);
      });
  },
  deactivateTask(taskId, cb) {
        fetch(API_URL + '/task/' + taskId, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
          body: JSON.stringify({ status: 103 })
      }).then(parseJSON).then( result => {
          cb(result);
      }).catch(err => {
        console.error(err);
      });
 },
  checkIfEmailExists(email, cb) {
      fetch(API_URL + '/user/check-if-exists?email='+email, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
      }).then(parseJSON).then( result => {
          cb(result);
      }).catch(err => {
        console.error(err);
      });
  },
  signup: (data, cb) => {
      fetch(API_URL + '/signup/email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      }).then(parseJSON).then(result => {
        cb(result);
      }).catch( err => {
        console.error(err);
      });
  },
  login: (data, cb) => {
      fetch(API_URL + '/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch( err => {
        console.error(parseJSON(err));
      });
  },
  getProfile: (userId, cb) => {
      fetch(API_URL + '/user/details/' + userId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch( err => {
      
      });
  },
  getTask: (taskId, cb) => {
      fetch(API_URL + '/task/details/' + taskId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          }
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch(err => console.error(err));
  },
  getOffers: (params, cb) => {
      let queryParams = '?status=ACTIVE&';

      if (params.lat) {
          queryParams += `lat=${params.lat}&`;
      }

      if (params.lng) {
          queryParams += `lng=${params.lng}&`;
      }

      fetch(API_URL + `/task${queryParams}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
      }).then(parseJSON).then(result => {
           cb(result);
      }).catch(err => {
      
      });
  },
  getTasks: cb => {
      fetch(API_URL + '/app/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          }
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch(err => {
      
      });
  },
  sendApplication: (application, cb) => {
      fetch(API_URL + "/task/apply", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
          body: JSON.stringify(application)
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch(err => {
      
      });
  },
  loginAndSendApplication: (application, cb) => {
      // "/task/instant-apply"
      fetch(API_URL + "/task/instant-apply", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
          body: JSON.stringify(application)
      }).then(parseJSON).then(result => {
          cb(result);
      }).catch(err => {
      
      });
  },
 uploadImage: (file, cb) => {

     const data = new FormData()

     data.append('file', file, file.name);

    fetch(API_URL + '/upload/image?json=true', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-Auth-Token': AuthService.getAuthToken()
          },
          body: data
      }).then(parseJSON).then( result => {
          cb(result);
      }).catch( err => {
        console.error(err);
      });
  }
};

export default StActions;