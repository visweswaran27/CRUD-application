import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", age: "", city: "" });

  // Replace 'http://localhost:8000' with your Render backend URL
  const backendUrl = "https://crud-application-j56x.onrender.com";

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/users`);
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const handleSearchChange = (e) => {
    const searchTxt = e.target.value.toLowerCase();
    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTxt) ||
        user.city.toLowerCase().includes(searchTxt) ||
        user.age.toString().toLowerCase().includes(searchTxt)
    );
    setFilteredUsers(filteredUsers);
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure want to delete this user?"
    );
    if (isConfirmed) {
      try {
        const res = await axios.delete(`${backendUrl}/users/${id}`);
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const handleAddRecord = () => {
    setUserData({ name: "", age: "", city: "" });
    setIsModelOpen(true);
  };

  const modelClose = () => {
    setIsModelOpen(false);
  };

  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userData.id) {
      await axios
        .patch(`${backendUrl}/users/${userData.id}`, userData)
        .then((res) => {
          console.log(res);
        });
      alert("Successfully Edited!");
      setIsModelOpen(false);
      getAllUsers();
    } else {
      await axios.post(`${backendUrl}/users`, userData).then((res) => {
        console.log(res);
      });
      alert("Successfully added!");
      setIsModelOpen(false);
      getAllUsers();
    }
    modelClose();
    setUserData({ name: "", age: "", city: "" });
  };

  const handleEdit = (user) => {
    setUserData(user);
    setIsModelOpen(true);
  };

  return (
    <>
      <div className="container">
        <h2>CRUD Application with React.js FrontEnd and Node.js as BackEnd</h2>
        <div className="input-search">
          <input
            type="search"
            placeholder="Search Here"
            onChange={handleSearchChange}
          />
          <button onClick={handleAddRecord} className="btn blue">
            Add Record
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers &&
              filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td>
                    <button
                      onClick={() => handleEdit(user)}
                      className="btn green"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn red"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {isModelOpen && (
          <div className="model">
            <div className="modelcontent">
              <span onClick={modelClose} className="close">
                &times;
              </span>
              <h3>{userData.id ? "Update Record" : "Add Record"}</h3>
              <div className="input-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={userData.name}
                  onChange={handleData}
                />
                <label htmlFor="age">Age:</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  value={userData.age}
                  onChange={handleData}
                />
                <label htmlFor="city">City:</label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={userData.city}
                  onChange={handleData}
                />
              </div>
              <button onClick={handleSubmit} className="btn green">
                {userData.id ? "Update User" : "Add User"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
