const baseURL = import.meta.env.VITE_SERVER_URL;
console.log('baseURL:', baseURL);

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error('Bad Response');
}

export async function getData(category = 'tents') {
  const url = baseURL + `products/search/${category}`;
  console.log('fetching:', url);

  const response = await fetch(url);
  const data = await convertToJson(response);
  return data.Result;
}

export async function findProductById(id) {
  const url = baseURL + `product/${id}`;
  console.log('fetching:', url);

  const response = await fetch(url);
  const data = await convertToJson(response);
  return data.Result;
}