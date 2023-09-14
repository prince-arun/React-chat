import React from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
// import { AuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import logo from "../Home/assets/logo-img.png";

const Navbar = () => {
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    navigate("/signIn");
  };
  return (
    <nav>
      <h3>
        <Link to="/home">
          {" "}
          <img src={logo} alt="home logo" width={200} />
        </Link>
      </h3>

      <div>
        <Link to="/profile">
          {" "}
          <Button variant="warning" className="px-3 py-2">
            Profile
          </Button>
        </Link>

        <Button variant="danger" onClick={handleSignout}>
          {" "}
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
