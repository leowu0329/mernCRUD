import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", age: "" });
  const [userBtn, setUserBtn] = useState("Add user");
  const [userVariant, setUserVariant] = useState({ bool: true, id: "" });
  
  // API URI's
  const BASE_URL = "http://localhost:3000/api";
  const getUsers = `${BASE_URL}/users`;
  const postUser = `${BASE_URL}/addUser`;

  // 取得所有使用者資料
  const fetchUsers = async () => {
    try {
      const response = await axios.get(getUsers);
      setUsers(response.data.reverse());
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 新增或更新使用者
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (userVariant.bool) {
      try {
        const emailExists = users.some((user) => user.email === newUser.email);
        if (emailExists) {
          alert("Email already exists. Please use a different email.");
        } else if (newUser.name && newUser.email && newUser.age) {
          const response = await axios.post(postUser, newUser);
          setUsers([response.data, ...users]);
          setNewUser({ name: "", email: "", age: "" });
        } else {
          alert("Please fill in all fields");
        }
      } catch (error) {
        console.error("Error adding user:", error);
      }
      setUserBtn("Add user");
    } else {
      const getUser = `${BASE_URL}/users/${userVariant.id.toString()}`;
      try {
        await axios.put(getUser, newUser);
        fetchUsers();
        setNewUser({ name: "", email: "", age: "" });
        setUserVariant({ bool: true, id: "" });
        setUserBtn("Add user");
      } catch (error) {
        console.log(`Error: ${error}`);
      }
    }
  };

  // 輸入框變更處理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // 刪除使用者
  const handleDeleteUser = async (id) => {
    const getUser = `${BASE_URL}/users/${id}`;
    try {
      await axios.delete(getUser);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  // 點擊編輯按鈕，將資料載入表單準備更新
  const handleUpdateUser = (id) => {
    const findUser = users.find((user) => user._id === id);
    setNewUser({
      name: findUser.name,
      email: findUser.email,
      age: findUser.age,
    });
    setUserBtn("Update user");
    setUserVariant({ bool: false, id });
  };

  return (
    <div className="page-wrapper">
      <header className="main-title">
        <h1>MERN Stack Project (CRUD) - Hayyan shaikh</h1>
      </header>

      {/* 左右雙欄主容器 */}
      <div className="main-layout">
        
        {/* 左側：Manage Users 列表區塊 */}
        <div className="left-column">
          <div className="header">
            <h3>Manage Users</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map((user, key) => (
                    <tr key={key}>
                      <td>{user._id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.age} Year's</td>
                      <td>
                        <button
                          className="edit_btn action-btn"
                          onClick={() => handleUpdateUser(user._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete_btn action-btn"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右側：Add / Update User 表單區塊 */}
        <div className="right-column">
          <div className="form-card">
            <h3>{userVariant.bool ? "Add New User" : "Update User"}</h3>
            <form onSubmit={handleAddUser}>
              <input
                type="text"
                placeholder="Enter the name"
                autoComplete="off"
                name="name"
                value={newUser.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                placeholder="Enter the email"
                autoComplete="off"
                name="email"
                value={newUser.email}
                onChange={handleInputChange}
              />
              <input
                type="number"
                placeholder="Enter the age"
                autoComplete="off"
                name="age"
                value={newUser.age}
                onChange={handleInputChange}
              />
              <button type="submit">{userBtn}</button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;