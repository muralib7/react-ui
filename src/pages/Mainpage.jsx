import React, { useState, useEffect } from "react";
import "../css/Common.css";
import IPLocationFetcher from "../components/Locationfetcher";
import { toast } from "react-toastify";
import Commonmodal from "../components/Commonmodal";

const Mainpage = () => {
  const [expenses, setExpenses] = useState([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState(null);
  const [inputBalance, setInputBalance] = useState("");
  const [userName, setUserName] = useState("");
  const [inputName, setInputName] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (expense) => {
    setSelectedExpense({ ...expense });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedExpense(null);
  };

  const handleSave = () => {
    setExpenses((prev) =>
      prev.map((exp) =>
        exp.id === selectedExpense.id ? selectedExpense : exp
      )
    );
    localStorage.setItem("expenses", JSON.stringify(expenses));
    setShowModal(false);
  };

  // Load data from storage on mount
  useEffect(() => {
    const savedExpenses =
      JSON.parse(localStorage.getItem("expenses")) || [];
    const savedBalance = localStorage.getItem("balance");
    const savedName = localStorage.getItem("userName");

    setExpenses(savedExpenses);
    if (savedBalance !== null) setBalance(parseFloat(savedBalance));
    if (savedName) setUserName(savedName);
  }, []);

  // Save balance and name in localStorage
  useEffect(() => {
    if (balance !== null) {
      localStorage.setItem("balance", balance.toString());
    }
    if (userName) {
      localStorage.setItem("userName", userName.toString());
    }
if (expenses.length > 0) {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }   
  }, [balance, userName, expenses]);

  // Handle initial balance + name submit
  const handleSetBalance = (e) => {
    e.preventDefault();
    if (!inputBalance || parseFloat(inputBalance) <= 0 || !inputName.trim()) {
      toast.error("Please enter valid name and balance!");
      return;
    }
    setBalance(parseFloat(inputBalance));
    setUserName(inputName.trim());
    setInputBalance("");
    setInputName("");
  };

  // Handle Add Expense
  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) {
      toast.error("Please enter valid title and amount!");
      return;
    }

    const amt = parseFloat(amount);
    if (amt <= 0) {
      toast.error("Amount must be greater than 0!");
      return;
    }
    if (amt > availableBalance) {
      toast.error("Expense exceeds available balance!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      title,
      amount: amt,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    const updatedExpenses = [...expenses, newExpense];
    setExpenses(updatedExpenses);

    // Save in localStorage
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

    setTitle("");
    setAmount("");
  };

  // Handle Delete Expense
  const handleDelete = (id) => {
    const updatedExpenses = expenses.filter((exp) => exp.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
  };

  // Calculate total spent
  const totalSpending = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const availableBalance = balance - totalSpending;

  const resetDetails = () => {
    setBalance(null);
    setUserName(null);
    localStorage.removeItem("balance");
    localStorage.removeItem("userName");
  };

  // ✅ Filtered expenses based on search
  const filteredExpenses = expenses.filter((exp) =>
    exp.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // if(filteredExpenses.length === 0){
  //   toast.error("No expenses found for the search query!");
  // }
  // If no balance set → show initial balance + name screen
  if (balance === null || !userName) {
    return (
      <section className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark">
        <div className="p-4 bg-secondary rounded shadow text-center">
          <h3 className="text-white mb-3">Enter Your Details</h3>
          <form onSubmit={handleSetBalance} className="d-flex flex-column gap-2">
            <input
              type="text"
              placeholder="Enter your name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              className="form-control"
            />
            <input
              type="number"
              placeholder="Enter initial balance"
              value={inputBalance}
              onChange={(e) => setInputBalance(e.target.value)}
              className="form-control"
            />
            <button type="submit" className="btn btn-success mt-2">
              Save
            </button>
          </form>
        </div>
      </section>
    );
  }

  // Main expense calculator UI
  return (
    <section className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-dark">
      <div className="main-page p-4 rounded shadow bg-secondary w-75">
        <div className="main-content">
          <h3 className="text-center text-white header-title">Murali's Expense Calculator</h3>
          <div className="d-flex justify-content-between text-white fw-bold mb-3 flex-wrap gap-3">
            <span>Welcome: {userName}</span>
            <IPLocationFetcher />
            <span>Balance: ₹ {balance}</span>
            <span>Total Spent: ₹ {totalSpending}</span>
            <span>Available Balance: ₹ {availableBalance}</span>
          </div>

          {/* Add Expense Form */}
          <form onSubmit={handleAddExpense} className="d-flex justify-content-center align-items-center flex-column ">
            <div className="text-white "> 
              <label htmlFor="title">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="text-white">
              <label htmlFor="amount">Amount</label>
              <input
                type="number"
                placeholder="Enter amount"
                id="amount"
                className="form-control"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
              Add Expense
            </button>
          </form>

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by title"
              className="form-control mt-3"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Expense Table */}
          <div className="table-responsive">
            <table className="table text-white table-striped mt-4">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="table-rows">
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center">
                      No Expenses Found
                      <br />
                      <span className="me-2">or</span>
                      <span>
                        <button
                          className="btn btn-link p-0 text-decoration-underline"
                          onClick={resetDetails}
                        >
                          Want to add More Balance?
                        </button>
                      </span>
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp,index) => (
                    <tr key={exp.id} >
                      <td>{index + 1}</td> 
                      <td>{exp.title}</td>
                      <td>₹ {exp.amount}</td>
                      <td>{exp.date}</td>
                      <td>{exp.time}</td>
                      <td>
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="btn btn-danger btn-sm"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className="btn btn-warning btn-sm ms-2"
                          onClick={() => handleEdit(exp)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {showModal && (
            <Commonmodal
              show={showModal}
              handleClose={handleClose}
              title="Edit Expense"
              onSave={handleSave}
            >
              <div className="mb-3">
                <label className="form-label text-dark">Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedExpense?.title || ""}
                  onChange={(e) =>
                    setSelectedExpense((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label text-dark">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedExpense?.amount || ""}
                  onChange={(e) =>
                    setSelectedExpense((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </Commonmodal>
          )}
        </div>
      </div>
    </section>
  );
};

export default Mainpage;
