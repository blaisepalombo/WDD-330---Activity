// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// get a url parameter value
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export async function renderWithTemplate(
  templateFn,
  parentElement,
  data = {},
  callback,
  position = 'afterbegin',
  clear = true,
) {
  const template = await templateFn(data);

  if (clear) {
    parentElement.innerHTML = '';
  }

  parentElement.insertAdjacentHTML(position, template);

  if (callback) {
    callback(data);
  }
}

export function loadTemplate(path) {
  return async function () {
    const res = await fetch(path);
    if (res.ok) {
      const html = await res.text();
      return html;
    }
    throw new Error(`Template not found: ${path}`);
  };
}

export async function loadHeaderFooter() {
  const headerTemplate = loadTemplate('/partials/header.html');
  const footerTemplate = loadTemplate('/partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  if (headerElement) {
    await renderWithTemplate(headerTemplate, headerElement);
  }

  if (footerElement) {
    await renderWithTemplate(footerTemplate, footerElement);
  }
}