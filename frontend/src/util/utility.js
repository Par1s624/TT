import { message } from 'antd';

const BASE_HOST = 'http://localhost:5005';

const defaultOptions = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

function get(url) {
  // Return Promise
  return (
    fetch(`${BASE_HOST}${url}`, {
      ...defaultOptions,
      headers: {
        ...defaultOptions.headers,
        Authorization: `Bearer ${window.localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        return data;
      })
      .catch((err) => message.error(err.message))
  );
}

function post(url, data) {

  return fetch(`${BASE_HOST}${url}`, {
    method: 'POST',
    headers: {
      ...defaultOptions.headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      return data;
    })
    .catch((err) => message.error(err.message));
}

function put(url, data) {

  return fetch(`${BASE_HOST}${url}`, {
    method: 'PUT',
    headers: {
      ...defaultOptions.headers,
      Authorization: `Bearer ${window.localStorage.getItem('token')}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.error) throw new Error(data.error);
      return data;
    })
    .catch((err) => message.error(err.message));
}

const http = {
  get,
  post,
  put,
};
export default http;

export function isLogin() {
  return !!localStorage.getItem('token');
}
  
export function fileToDataUrl(file) {
  const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }
    
  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve,reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}
