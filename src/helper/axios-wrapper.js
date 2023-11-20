import { useAuthStore } from '@/stores/auth.store.js';
import axios from 'axios';
import { toast } from 'vue3-toastify';

export const axiosWrapper = {
  get: request('GET'),
  post: request('POST'),
  put: request('PUT'),
  delete: request('DELETE'),
};

function request(method) {
  return (url, body, notification = false, contentType = 'application/json') => {
    const requestOptions = {
      url,
      method,
      headers: authHeader(url),
    };

    if (body) {
      if (contentType == 'application/json') {
        requestOptions.headers['Content-Type'] = 'application/json';
        requestOptions.data = JSON.stringify(body);
      } else {
        requestOptions.headers['Content-Type'] = contentType;
        requestOptions.data = body;
      }
    }

    return axios(requestOptions)
      .then((response) => {
        if(notification){
          toast(response.data.message, {
            autoClose: 2000,
            type: 'success',
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }

        response.data.status = response.status;

        return response.data

      }, (error) => {
        return errorHandler(error);
      });
  };
}

function authHeader(url) {
  const { user } = useAuthStore();
  const isLoggedIn = !!user?.token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_BASE_URL);
  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
}

function errorHandler(error) {
  let response  = error.response
  let data = response.data

  const { user, logout } = useAuthStore();

  let message = ''

  if ([401, 403].includes(response.status) && user) {
    logout();
  }else if ([422].includes(response.status)) {
    data.errors.forEach((element, index) => {
      if(index < data.errors.length - 1){
        message += element.message + ', '
      }else{
        message += element.message
      }
    });
  }else{
    if(data.message){
      message = data.message
    }else{
      message = error.message
    }
  }

  toast(message, {
    autoClose: 2000,
    type: 'error',
    position: toast.POSITION.BOTTOM_RIGHT,
  });

  return false;
}



