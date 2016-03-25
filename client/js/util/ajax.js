import { extend, mapValues } from './obj';
import { api as router } from "abyssa";

/* Our internal ajax util returning a native Promise.

-- By default,
it will consider that the request body is JSON.
It will only return the response body, parsed as JSON.


-- To get the response headers, define a Set 'responseHeaders' in parameter 'options' (Set is defined in util/obj.js).
E.g. to get headers 'Location' and 'Content-Type', use :
   options = { responseHeaders: Set('Content-Language', 'Content-Type') }

The result returned by ajax.js will be, for instance :
  {
    headers: {
      Content-Language: 'en',
      Content-type: 'text/plain'
    },
    body: 'the reponse body'
  }


-- To parse the response body as a type different from JSON, define property 'parseResponseAs' in parameter 'options'.
E.g. options = { parseResponseAs: 'text'}

-- To send a body that is not JSON, define the header 'Content-Type'.
For example, to send binary data :
    let options = { headers: { 'Content-Type': 'application/octet-stream' } };
    post(url, body, options)

*/


export function get(url, options) {
  return ajax(extend(options || {}, { method: 'GET', url }));
}

export function post(url, body, options) {
  return ajax(extend(options || {}, { method: 'POST', url, body }));
}

export function put(url, body, options) {
  return ajax(extend(options || {}, { method: 'PUT', url, body }));
}

export function del(url, body, options) {
  return ajax(extend(options || {}, { method: 'DELETE', url, body }));
}

function ajax(options) {
  let { method, url, body, headers, responseHeaders, parseResponseAs } = options;
  headers = headers || {};

  const isFormData = body instanceof FormData;

  if (body !== undefined && !isFormData) {
    if (!('Content-Type' in headers)) {
      headers['Content-Type'] = 'application/json';
    }
    if (headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body);
    }
  }

  return new Promise(function(resolve, reject) {
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        try {
          if (xhr.status && isOkStatus(xhr.status)) {
            let responseBody = parseResponse(xhr, parseResponseAs);

            if (responseHeaders) {
              let resHeaders = mapValues(responseHeaders, header => xhr.getResponseHeader(header));
              resolve({
                headers: resHeaders,
                body: responseBody
              });
            }
            else {
              resolve(responseBody);
            }
          }
          // this case can occur mainly when xhr.abort() has been called.
          else {
            reject(rejected(xhr, parseResponseAs));
          }
        }
        catch (e) {
          reject(rejected(xhr, parseResponseAs)); // IE can throw an error accessing the status
        }
      }
    };

    xhr.open(method, url, true);
    if (!isFormData) Object.keys(headers).forEach(name => xhr.setRequestHeader(name, headers[name]));

    if (body !== undefined) xhr.send(body);
    else xhr.send();
  }).then(
    success => success,
    error => {
      if (error.status === 401) {
        router.transitionTo('app.login')
      } else return error;
    }
  );
}

function isOkStatus(s) {
  return s >= 200 && s < 300 || s === 304;
}

function rejected(xhr, type) {
  return {
    status: xhr.status,
    text: xhr.responseText,
    data: parseResponse(xhr, type)
  };
}

function parseResponse(xhr, type) {
  if (type == 'text') return xhr.responseText;
  else return tryJsonParse(xhr);
}

function tryJsonParse(xhr) {
  try { return JSON.parse(xhr.responseText) }
  catch (e) { return {} }
}
