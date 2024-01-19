const adminForm = document.getElementById('adminForm');
const userIdInput = document.getElementById('userId');
const passwordInput = document.getElementById('password');
const userTableBody = document.getElementById('userTable');

let userData = [
  { id: 5644, password: '5644' },
  { id: 5645, password: '5645' },
];

adminForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const newUser = {
    id: userIdInput.value,
    password: passwordInput.value,
  };
  userData.push(newUser);
  renderUserTable();
  adminForm.reset();
});

function renderUserTable() {
  userTableBody.innerHTML = '';
  userData.forEach((user) => {
    const row = `
      <tr>
        <td>${user.id}</td>
        <td>${user.password}</td>
      </tr>
    `;
    userTableBody.innerHTML += row;
  });
}