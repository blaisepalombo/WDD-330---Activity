const baseURL = "/api/";

async function convertToJson(res) {
  if (res.ok) {
    return res.json();
  }
  throw new Error("Bad Response");
}

async function getProductsByCategory(category = "tents") {
  const url = `${baseURL}products/search/${category}`;
  const response = await fetch(url);
  const data = await convertToJson(response);
  return data.Result;
}

async function findProductById(id) {
  const url = `${baseURL}product/${id}`;
  const response = await fetch(url);
  const data = await convertToJson(response);
  return data.Result;
}

async function checkout(payload) {
  const url = `${baseURL}checkout`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };

  const response = await fetch(url, options);
  return convertToJson(response);
}

export default {
  getProductsByCategory,
  findProductById,
  checkout
};