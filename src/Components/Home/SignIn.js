import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { updateDoc, doc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const SignIn = () => {
  //---------------------------------------
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const navigate = useNavigate();

  const { email, password, error, loading } = data;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      alert("User LoggedIn Successfully");
      navigate("/home");
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  //---------------------------------------------------------
  return (
    <div className="signIn d-flex justify-content-center">
      <div className="signIn-box ">
        <Card>
          <Card.Body>
            <div className="text-center mt-1">
              <h2>Login</h2>
            </div>
            <div className="mx-5">
              {/* ----------------------------- */}
              <form className="form" onSubmit={handleSubmit}>
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
                {error ? <p className="error">{error}</p> : null}
                <div className="btn_container">
                  {/* <button className="btn" disabled={loading}> */}
                  <Button variant="primary" type="submit">
                    {loading ? "Logging in ..." : "Login"}
                  </Button>
                  {/* </button> */}
                </div>
              </form>
              <Form.Label className="text-center mt-3 ms-5  ">
                Don't have an account <Link to="/">Register</Link>
              </Form.Label>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
