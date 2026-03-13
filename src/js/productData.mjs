function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error('Bad Response');
}

export function getData(category = 'tents') {
  return fetch(`/json/${category}.json`)
    .then(convertToJson)
    .then((data) => data.Result || data);
}

export async function findProductById(id) {
  const products = await getData();
  return products.find((item) => item.Id === id);
}