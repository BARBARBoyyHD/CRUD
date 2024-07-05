document.addEventListener('DOMContentLoaded', () => {
  const itemsList = document.getElementById('itemsList');
  const createForm = document.getElementById('createForm');
  const updateForm = document.getElementById('updateForm');

  // Fetch and display items
  if (itemsList) {
    fetch('/api/items')
      .then(response => response.json())
      .then(items => {
        items.forEach(item => {
          const li = document.createElement('li');
          li.innerHTML = `
            ${item.name}
            <a href="/update?id=${item.id}">Edit</a>
            <button onclick="deleteItem(${item.id})">Delete</button>
          `;
          itemsList.appendChild(li);
        });
      });
  }

  // Create item
  if (createForm) {
    createForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(createForm);
      const data = Object.fromEntries(formData);
      fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(() => {
          window.location.href = '/';
        });
    });
  }

  // Update item
  if (updateForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    fetch(`/api/items/${itemId}`)
      .then(response => response.json())
      .then(item => {
        document.getElementById('name').value = item.name;
      });

    updateForm.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(updateForm);
      const data = Object.fromEntries(formData);
      fetch(`/api/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(() => {
          window.location.href = '/';
        });
    });
  }
});

// Delete item
function deleteItem(id) {
  fetch(`/api/items/${id}`, {
    method: 'DELETE'
  })
    .then(() => {
      window.location.reload();
    });
}
