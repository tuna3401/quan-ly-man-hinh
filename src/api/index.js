import { store, history } from '../redux/store';
import axios from 'axios';
import auth_actions from '../redux/auth/actions';
import {
  clearToken,
  getInfoFromToken,
  getToken,
  getTokenDecode,
} from '../helpers/utility';
import { message, Modal } from 'antd';
import Constants, { SECRETKEY } from '../settings/constants';
import moment from 'moment';

const user = () => {
  return store.getState().Auth;
};

const refreshToken = async () => {
  try {
    clearToken();
    store.dispatch({
      type: auth_actions.LOGOUT,
    });
    history.replace('/signin');
  } catch (err) { }
};

const checkRefreshToken = () => {
  let refresh = 0;
  const userObjCheck = getInfoFromToken();
  refresh = 0;
  if (userObjCheck && userObjCheck.ExpiresAt) {
    let expires_at = moment(userObjCheck.ExpiresAt).format('YYYY-MM-DD HH:m:s');
    let today = moment().format('YYYY-MM-DD HH:m:s');
    if (today > expires_at) {
      refresh = 1;
    }
  } else {
    refresh = 1;
  }
  // if (userObjCheck && userObjCheck.ExpiresAt) {
  //   let ExpiresAt = moment(userObjCheck.ExpiresAt).format('YYYY-MM-DD HH:m:s');
  //   let today = moment().format('YYYY-MM-DD HH:m:s');
  //   if (today > ExpiresAt) {
  //     refresh = 1;
  //   }
  // } else {
  //   refresh = 1;
  // }
  return refresh;
};

const getConfig = async (headers = {}) => {
  // Suspend request if we are in the middle of refreshing access token
  // if (user().is_refreshing) {
  //   await new Promise((resolve, reject) => {
  //     store.subscribe(() => {
  //       if (!user().is_refreshing) {
  //         if (user().user) {
  //           resolve();
  //         } else {
  //           auth_actions.logout();
  //           reject('error');
  //         }
  //       }
  //     });
  //   });
  // } else {
  //   if (!user().idToken) {
  //     auth_actions.logout();
  //   }
  // }
  const user_data = getInfoFromToken();
  const token = getTokenDecode();
  if (user_data && user_data.NguoiDung) {
    //check token expires

    const refresh = checkRefreshToken();
    if (refresh === 1) {
      await refreshToken();
    }
    if (user_data.ExpiresAt) {
      let expires_at = moment(user_data.ExpiresAt).format('YYYY-MM-DD');
      let today = moment().format('YYYY-MM-DD');
      if (today > expires_at) {
        await refreshToken();
      }
    }

    // if (user_data.user.ExpiresAt) {
    //   let ExpiresAt = moment(user_data.user.ExpiresAt).format('YYYY-MM-DD');
    //   let today = moment().format('YYYY-MM-DD');
    //   if (today > ExpiresAt) {
    //     await refreshToken();
    //   }
    // }

    if (!headers) headers = {};
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  } else {
    //await refreshToken();
    auth_actions.logout();
  }
};

const getConfigKey = async (headers = {}) => {
  return {
    ...headers,
    Authorization: `Bearer ${SECRETKEY}`,
  };
};

export { getConfig };

const callApi = (
  url,
  data = null,
  headers = {},
  method = 'GET',
  responseType = 'json',
) => {
  if (!headers) headers = {};

  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  let params = {};
  if (typeof data === 'object') {
    if (data instanceof FormData) {
      let key;
      for (key of data.keys()) {
        if (data.get(key) === 'null' || data.get(key) === 'undefined') {
          data.set(key, '');
        }
      }
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      let prop_name;
      for (prop_name in data) {
        if (data[prop_name] === null || data[prop_name] === undefined) {
          data[prop_name] = '';
        }
      }
    }
  }

  if (!(method === 'PUT' || method === 'POST' || method === 'PATCH')) {
    params = data;
    data = {};
  }

  // Validate URL before calling axios
  if (!url || typeof url !== 'string') {
    console.error('Invalid URL:', url);
    return Promise.reject({
      message: 'URL không hợp lệ',
      data: { Status: -1, Message: 'URL không hợp lệ' }
    });
  }

  return axios({
    method,
    url,
    data,
    params,
    headers,
    responseType: responseType,
  })
    .then(function (response) {
      // if(response.data.Status && response.data.Status === -1 && headers.Authorization){ //het han token
      //   clearToken();
      //   store.dispatch({type: auth_actions.LOGOUT});
      //   history.replace('/signin');
      // }
      return response;
    })
    .catch(function (error) {
      try {
        if (error.response) {
          const statusText = error.response.Message
            ? error.response.Message
            : 'Lỗi hệ thống';
          // The request was made and the server responded with a status code
          const status = error?.response?.status;
          if (status === 401) {
            auth_actions.logout();
            message.error(statusText);
            return error.response;
            // return;
          }
          // environment should not be used
          if (status === 403) {
            message.error(statusText);
            return error.response;
            // history.push('404');
            // return error.response;
          }
          if (status <= 504 && status >= 500) {
            message.error(statusText);
            return error.response;
            // router.push('/exception/500');
            // return;
          }
          if (status >= 404 && status < 422) {
            message.error(statusText);
            return error.response;
            // history.push('404');
            // return;
          }
          // Default: return error response for any other status codes
          message.error(statusText);
          return error.response;
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
          console.error('Network Error:', error.request);
          return {
            data: {
              Status: -1,
              Message: 'Lỗi kết nối mạng',
            },
          };
        } else {
          // Something happened in setting up the request that triggered an Error
          const errorMsg = error?.message || error?.toString() || 'Lỗi không xác định';
          message.error('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.');
          console.error('Request Setup Error:', errorMsg, error);
          return {
            data: {
              Status: -1,
              Message: errorMsg,
            },
          };
        }
      } catch (catchError) {
        // Fallback nếu xử lý error bị lỗi
        console.error('Error in error handler:', catchError);
        return {
          data: {
            Status: -1,
            Message: 'Lỗi hệ thống',
          },
        };
      }
      //Error config
    });
};

export const apiGet = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, 'GET', 'json');
};

export const apiPost = async (
  url,
  params = null,
  headers = {},
  type = 'json',
) => {
  return await callApi(url, params, headers, 'POST', type);
};

export const apiPut = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, 'PUT', 'json');
};

export const apiPatch = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, 'PATCH', 'json');
};

export const apiDelete = async (url, params = null, headers = {}) => {
  return await callApi(url, params, headers, 'DELETE', 'json');
};

export const apiDownloadAuth = async (url, params = null, headers = {}) => {
  const _headers = {
    ...headers,
    Authorization: `Bearer ${params.Token}`,
  };
  await callApi(url, params, _headers, 'GET', 'json')
    .then((response) => {
      if (response.data.Status > 0) {
        //dowload file
        const base64 = response.data.Data.Base64String;
        const blob = b64toBlob(base64); //new Blob([base64], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = response.data.Data.TenFileGoc;
        link.click();
      } else {
        Modal.error({
          title: 'Lỗi',
          content: response.data.Message,
        });
      }
    })
    .catch((error) => {
      Modal.error({
        title: 'Lỗi',
        content: 'Đã có lỗi xảy ra!',
      });
    });
};

function b64toBlob(dataURI) {
  let fileType = dataURI.split(';')[0].replace('data:', '');
  let byteString = atob(dataURI.split(',')[1]);
  let ab = new ArrayBuffer(byteString.length);
  let ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: fileType }); //eg: image/jpg
}

export const apiGetUser = async (url, params = null, headers = {}) => {
  //check token expires
  const refresh = checkRefreshToken();
  if (refresh === 1) {
    await refreshToken();
    return apiGet(url); //need a result
  } else {
    const _headers = {
      ...headers,
      Authorization: `Bearer ${params.Token}`,
    };
    return apiGet(url, { NguoiDungID: params.NguoiDungID }, _headers);
  }
};

export const apiGetAuth = async (url, params = null, headers = {}) => {
  const _headers = await getConfig(headers);
  return apiGet(url, params, _headers);
};

export const apiGetByKey = async (url, params = null, headers = {}) => {
  const _headers = await getConfigKey(headers);
  return apiGet(url, params, _headers);
};

export const apiPostAuth = async (url, params = null, headers = {}, type) => {
  const _headers = await getConfig(headers);
  return apiPost(url, params, _headers, type);
};

export const apiPutAuth = async (url, params = null, headers = {}) => {
  const _headers = await getConfig(headers);
  return apiPut(url, params, _headers);
};

export const apiPatchAuth = async (url, params = null, headers = {}) => {
  const _headers = await getConfig(headers);
  return apiPatch(url, params, _headers);
};

export const apiPostPatchAuth = async (
  url,
  id = null,
  params = null,
  headers = {},
) => {
  const _headers = await getConfig(headers);
  let _url = id ? url + '/' + id : url;
  if (id) {
    return apiPatchAuth(_url, params, _headers);
  } else {
    return apiPostAuth(_url, params, _headers);
  }
};

export const apiDeleteAuth = async (url, params = null, headers = {}) => {
  const _headers = await getConfig(headers);
  return apiDelete(url, params, _headers);
};

export const setFieldValue = (form, response_data) => {
  form.validateFields((error, values) => {
    if (!error) {
      let _arr_err = {};
      let key;
      for (key in response_data) {
        if (values[key] !== undefined) {
          _arr_err[key] = {
            value: values[key],
            errors: [new Error(response_data[key])],
          };
        }
      }
      form.setFields(_arr_err);
    }
  });
};

export const checkValidationSubmit = (form, response) => {
  if (response.status === -4 || response.status === -2) {
    setFieldValue(form, response.data);
  }
};

export const genFilterQuery = (filter) => {
  let filterArr = [];
  let filterQuery = '';
  if (filter && typeof filter === 'object') {
    let property;
    for (property in filter) {
      if (
        filter[property] !== undefined &&
        filter[property] !== null &&
        filter[property].toString().trim() !== ''
      ) {
        filterArr.push(`${property}(${filter[property]})`);
      }
    }
  }
  if (filterArr) {
    filterQuery = filterArr.join('.');
  }
  return filterQuery;
};
