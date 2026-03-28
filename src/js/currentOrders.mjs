function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function orderItemTemplate(order) {
  return `
    <tr>
      <td>${order.id || order._id || ""}</td>
      <td>${order.fname || ""} ${order.lname || ""}</td>
      <td>${formatDate(order.orderDate)}</td>
      <td>$${Number(order.orderTotal).toFixed(2)}</td>
      <td>${order.items?.length || 0}</td>
    </tr>
  `;
}

export function renderOrderList(selector, orders) {
  const element = document.querySelector(selector);

  if (!orders || !orders.length) {
    element.innerHTML = `<p>No current orders found.</p>`;
    return;
  }

  const rows = orders.map(orderItemTemplate).join("");

  element.innerHTML = `
    <table class="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Customer</th>
          <th>Date</th>
          <th>Total</th>
          <th>Items</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}