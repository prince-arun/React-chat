import React from "react";
import { Link } from "react-router-dom";
import { storage, auth, db } from "../../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import Img from "../../image1.jpg";

import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import logo from "../Home/assets/logo-img.png";
import { useEffect, useState } from "react";

import { getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updateEmail,
} from "firebase/auth";

import Image from "react-bootstrap/Image";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";

const Navbaar = () => {
  const navigate = useNavigate();
  // ============================================================================================
  const [img, setImg] = useState(null);
  const [user, setUser] = useState(null);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    country: "",
  });
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Fetch user data from Firestore
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUser(docSnap.data());
          setEditedUser(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Handle image upload when img state changes
    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            // await deleteDoc(doc(db, "users", auth.currentUser.uid), {
            //   avatarPath: "",
            // });
            // await deleteDoc(doc(db, "users", auth.currentUser.uid), {
            //   avatar: "",
            // });
            // await deleteDoc(doc(db, "users", auth.currentUser.uid), {
            //   updatedAvatar: serverTimestamp(),
            // });
            // await deleteDoc(doc(db, "users", auth.currentUser.uid), {
            //   updatedAt: serverTimestamp(),
            // });
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
            updatedAvatar: serverTimestamp(),
          });
          alert("image updated successfully");
          setImg(null); // Clear the img state
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img, user]);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const saveChanges = async () => {
    try {
      // Reauthentication code similar to the deleteAccount function
      const user = auth.currentUser;
      const currentPassword = prompt("Please enter your current password:");

      if (currentPassword === null) {
        return; // User cancelled password prompt
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);
      // Update user data in Firestore
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        ...editedUser,
        updatedAt: serverTimestamp(),
      });

      // Update the user's email in Firebase Authentication
      await updateEmail(user, editedUser.email);
      // Exit editing mode
      setShow(false);
      alert("Details Updated successfully");
    } catch (error) {
      console.error("Error saving changes: ", error);
    }
  };

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
          updatedAvatar: serverTimestamp(),
        });
        alert("profile image Deleted");
        navigate("/home");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const deleteAccount = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete your account?"
      );

      if (confirmDelete) {
        const user = auth.currentUser;

        if (user) {
          // Reauthenticate the user before deleting the account
          let currentPassword = prompt(
            "Please enter your password to confirm account deletion:"
          );

          if (currentPassword === null) {
            return; // User cancelled password prompt
          }

          let credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
          );

          await reauthenticateWithCredential(user, credential);

          // Delete user data from Firestore
          const docRef = doc(db, "users", auth.currentUser.uid);
          await deleteDoc(docRef);

          // Delete the user's account
          await user.delete();

          // Sign out the user before navigating
          await auth.signOut();
          alert("account Deleted successfully");
          // Navigate to the home page
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error deleting account: ", error);
    }
  };

  if (!user) {
    return null;
  }
  // =============================================================================================

  const handleSignout = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      isOnline: false,
    });
    await signOut(auth);
    alert("Account signed Out!");
    navigate("/signIn");
  };

  return (
    <div>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <h3>
              <Link to="/home">
                {" "}
                <img src={logo} alt="home logo" width={200} />
              </Link>
            </h3>
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {/* **************************** */}
              <div>
                {/* ======================================================== */}
                <Image
                  className="ms-5 me-3 shadow bg-white"
                  onClick={handleShow}
                  src={user.avatar || Img}
                  roundedCircle
                  width={60}
                  height={60}
                  style={{ cursor: "pointer" }}
                />

                <Offcanvas show={show} onHide={handleClose} placement="end">
                  <Offcanvas.Header
                    closeButton
                    className="bg-dark text-warning text-center"
                  >
                    <Offcanvas.Title>Edit Profile</Offcanvas.Title>
                  </Offcanvas.Header>
                  <Offcanvas.Body className="bg-dark">
                    <div className="text-center">
                      <img
                        src={user.avatar || Img}
                        alt="Profile"
                        className="mb-3"
                        width={100}
                        height={100}
                      />
                    </div>
                    <Form>
                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedUser.name}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              name: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={editedUser.email}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              email: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Age</Form.Label>
                        <Form.Control
                          type="number"
                          value={editedUser.age}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              age: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedUser.gender}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              gender: e.target.value,
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Country</Form.Label>
                        <Form.Control
                          type="text"
                          value={editedUser.country}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              country: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                      <Form.Group className="mb-3 text-white">
                        <Form.Label>Profile Picture</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImg(e.target.files[0])} // Updated to set img state
                        />
                      </Form.Group>

                      {user.avatar && (
                        <Button
                          variant="danger"
                          onClick={deleteImage}
                          className="me-2"
                        >
                          Delete Image
                        </Button>
                      )}

                      <Button variant="success" onClick={saveChanges}>
                        Save
                      </Button>
                      <Button
                        variant="danger"
                        onClick={deleteAccount}
                        className="ms-3"
                      >
                        Delete Account
                      </Button>
                    </Form>
                  </Offcanvas.Body>
                </Offcanvas>
                {/* ======================================================== */}

                <Button variant="danger" onClick={handleSignout}>
                  {" "}
                  Logout
                </Button>
              </div>
              {/* **************************** */}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Navbaar;
