import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "./assets/logo-img.png";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const NavBar = () => {
  // ------------------------------Bootstrap states-----------------
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // ---------------------------------------------------------------
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    country: "",
    termsAccepted: false,
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const {
    name,
    email,
    password,
    age,
    gender,
    termsAccepted,
    error,
    country,
    loading,
  } = data;

  // const handleChange = (e) => {
  //   setData({ ...data, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setData({ ...data, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !age ||
      !termsAccepted ||
      !country
    ) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        age,
        gender,
        country,
        termsAccepted,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      setData({
        name: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        country: "",
        termsAccepted: false,
        error: null,
        loading: false,
      });
      navigate("/signIn");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  //-------------------------------------------------------------------------------------------------------------------------------

  return (
    <div className="navBar position-relative z-index-5 top-0 left-0">
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img src={logo} alt="home logo" width={200} />
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* --------------------------Login Button---------- */}
              <Button
                variant="primary"
                onClick={handleShow}
                className="px-5 py-2"
              >
                Register
              </Button>

              <Modal show={show} onHide={handleClose} className="mx-4">
                <div className="text-center mt-3">
                  <h2>Register</h2>
                </div>
                <Modal.Body className="mx-5">
                  {/* ------------------------------------- */}
                  <form className="form" onSubmit={handleSubmit}>
                    <div className="input_container">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input_container">
                      <label htmlFor="age">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={age}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input_container">
                      <label>Gender</label>
                      <div>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={gender === "male"}
                            onChange={handleChange}
                          />
                          Male
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={gender === "female"}
                            onChange={handleChange}
                          />
                          Female
                        </label>
                        {/* You can add more gender options as needed */}
                      </div>
                    </div>
                    <div className="input_container">
                      <label htmlFor="email">Email</label>
                      <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input_container">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input_container">
                      <label htmlFor="country">Country</label>
                      <p>
                        <select
                          name="country"
                          value={country}
                          onChange={handleChange}
                        >
                          <option value="USA">USA</option>
                          <option value="Canada">Canada</option>
                          <option value="UK">UK</option>
                          {/* Add more country options as needed */}
                        </select>
                      </p>
                    </div>
                    <div>
                      <p>
                        <input
                          type="checkbox"
                          label="Accept the terms & Conditions"
                          name="termsAccepted"
                          checked={termsAccepted}
                          onChange={handleChange}
                        />
                        <span>Accept the terms&Conditions</span>
                      </p>
                    </div>
                    {error ? <p className="error">{error}</p> : null}
                    <div className="btn_container">
                      {/* <button className="btn" disabled={loading}> */}
                      <Button variant="success" type="submit">
                        {loading ? "Signing Up ..." : "Register"}
                      </Button>
                      {/* </button> */}
                    </div>
                  </form>
                </Modal.Body>
                <Form.Label className="text-center mt-3">
                  Already Have an account <Link to="/signIn">Login</Link>
                </Form.Label>
              </Modal>

              {/* ---------------------------------------------------------------------------- */}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
