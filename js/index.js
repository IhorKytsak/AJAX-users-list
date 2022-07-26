let url = 'https://jsonplaceholder.typicode.com/users';
const userList = document.querySelector('.userList');
const hundred = 100;

(async () => {
  let response = await fetch(url);

  let commits = await response.json();

  for (let obj of commits) {
    userList.insertAdjacentHTML(
      'beforeend',
      `
        <div class='item item${obj.id}'>
          <h3>${obj.name}</h3> 
          <p>Email: ${obj.email}</p> 
          <p>Username: ${obj.username}</p>
          <p>Address: ${obj.address.street}, ${obj.address.city}</p>
          <p>Phone: ${obj.phone}</p>
          <p>Website: ${obj.website}</p>
          <p>Company: ${obj.company.name}</p>
          <p>Id: ${obj.id}</p>
          <button id='${obj.id}' class='edit'>
          <span class="submit-spinner submit-spinner_hide"></span>Edit</button>
          <button id='${obj.id + hundred}' class='delete'>
          <span class="submit-spinner submit-spinner_hide"></span>Delete</button>
        </div>
      `
    );
  }
})();

function editServer(id, newName, newEmail) {
  document.querySelector(`.item${id} .edit`).disabled = true;
  document
    .querySelector(`.item${id} .edit .submit-spinner`)
    .classList.remove('submit-spinner_hide');

  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      name: newName,
      email: newEmail,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      mode: 'no-cors',
    },
  })
    .then((response) => response.json())
    .then((obj) => {
      document.querySelector(`.item${id} .edit`).disabled = false;
      document
        .querySelector(`.item${id} .edit .submit-spinner`)
        .classList.add('submit-spinner_hide');

      let editItem = document.querySelector(`.item${id}`);
      editItem.innerHTML = `
            <h3>${obj.name}</h3> 
            <p>Email: ${obj.email}</p> 
            <p>Username: ${obj.username}</p>
            <p>Address: ${obj.address.street}, ${obj.address.city}</p>
            <p>Phone: ${obj.phone}</p>
            <p>Website: ${obj.website}</p>
            <p>Company: ${obj.company.name}</p>
            <p>Id: ${obj.id}</p>
            <button id='${obj.id}' class='edit'>
            <span class="submit-spinner submit-spinner_hide"></span>Edit</button>
            <button id='${obj.id + hundred}' class='delete'>
            <span class="submit-spinner submit-spinner_hide"></span>Delete</button>
        `;
    });
}

function deleteItem(id) {
  document.querySelector(`.item${id} .delete`).disabled = true;
  document
    .querySelector(`.item${id} .delete .submit-spinner`)
    .classList.remove('submit-spinner_hide');

  fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
    method: 'DELETE',
  }).then((res) => {
    if (res.status) {
      document.querySelector(`.item${id} .delete`).disabled = false;
      document
        .querySelector(`.item${id} .delete .submit-spinner`)
        .classList.add('submit-spinner_hide');

      const deleteItem = document.querySelector(`.item${id}`);
      deleteItem.remove();
    }
  });
}

userList.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.className === 'edit') {
    const changeName = prompt('Enter new name', '');
    const changeEmail = prompt('Enter new email', '');
    editServer(e.target.id, changeName, changeEmail);
  }
  if (e.target.className === 'delete') {
    deleteItem(e.target.id - hundred);
  }
  return;
});
