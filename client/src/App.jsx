import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", age: "" });
  const [userBtn, setUserBtn] = useState("Add User");
  const [userVariant, setUserVariant] = useState({ bool: true, id: "" });
  
  // API URI's
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
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
      setUserBtn("Add User");
    } else {
      const getUser = `${BASE_URL}/users/${userVariant.id.toString()}`;
      try {
        await axios.put(getUser, newUser);
        fetchUsers();
        setNewUser({ name: "", email: "", age: "" });
        setUserVariant({ bool: true, id: "" });
        setUserBtn("Add User");
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
    if (findUser) {
      setNewUser({
        name: findUser.name,
        email: findUser.email,
        age: findUser.age,
      });
      setUserBtn("Update User");
      setUserVariant({ bool: false, id });
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* 頂部標題列 */}
        <header className="p-4 mb-4 bg-primary text-white rounded-3 shadow-sm d-flex align-items-center">
          <h3 className="m-0 fs-4 fw-bold">
            <i className="bi bi-people-fill me-2"></i>MERN Stack CRUD Application
          </h3>
        </header>

        {/* 左右雙欄主容器 (使用 Bootstrap Grid) */}
        <div className="row g-4 align-items-start">
          
          {/* 左側：Manage Users 列表區塊 (佔 8 欄) */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden">
              <div className="card-header bg-dark text-white py-3">
                <h5 className="mb-0 fw-semibold">
                  <i className="bi bi-table me-2"></i>Manage Users
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: "500px", overflowY: "auto" }}>
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light sticky-top">
                      <tr>
                        <th className="py-3 px-3"># ID</th>
                        <th className="py-3">Name</th>
                        <th className="py-3">Email</th>
                        <th className="py-3">Age</th>
                        <th className="py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users && users.length > 0 ? (
                        users.map((user, key) => (
                          <tr key={key}>
                            <td className="text-truncate px-3 text-muted small" style={{ maxWidth: "100px" }}>
                              {user._id}
                            </td>
                            <td className="fw-medium">{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.age} Years</td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-primary me-2 px-2 py-1"
                                onClick={() => handleUpdateUser(user._id)}
                                title="Edit"
                              >
                                <i className="bi bi-pencil-square"></i> Edit
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger px-2 py-1"
                                onClick={() => handleDeleteUser(user._id)}
                                title="Delete"
                              >
                                <i className="bi bi-trash"></i> Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center py-4 text-muted">
                            No users found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 右側：Add / Update User 表單區塊 (佔 4 欄) */}
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 p-2">
              <div className="card-body">
                <h5 className="card-title fw-bold text-dark mb-4">
                  <i className={`bi ${userVariant.bool ? 'bi-person-plus-fill' : 'bi-person-gear'} me-2 text-primary`}></i>
                  {userVariant.bool ? "Add New User" : "Update User"}
                </h5>
                <form onSubmit={handleAddUser} className="d-flex flex-column gap-3">
                  <div>
                    <label className="form-label text-muted small fw-semibold">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter the name"
                      autoComplete="off"
                      name="name"
                      value={newUser.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label text-muted small fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter the email"
                      autoComplete="off"
                      name="email"
                      value={newUser.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="form-label text-muted small fw-semibold">Age</label>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="Enter the age"
                      autoComplete="off"
                      name="age"
                      value={newUser.age}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary mt-2 py-2 fw-semibold shadow-sm">
                    <i className={`bi ${userVariant.bool ? 'bi-plus-lg' : 'bi-check-lg'} me-1`}></i>
                    {userBtn}
                  </button>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;