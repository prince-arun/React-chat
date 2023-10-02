import React, { useState, useEffect } from "react";
import Camera from "../svg/Camera";
import Img from "../../image1.jpg";
import { storage, db, auth } from "../../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import Delete from "../svg/Delete";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { TbArrowBackUpDouble } from "react-icons/tb";

const Profile = () => {
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  // ----------------------------
  const [isEditing, setIsEditing] = useState(false); // Add a state to track editing mode
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    country: "",
  });
  // ----------------------------
  const navigate = useNavigate("");

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
        // --------------
        setEditedUser(docSnap.data());
        // --------------
      }
    });

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [user, img]);

  // ------------------------
  const saveChanges = async () => {
    try {
      // Update Firestore with the edited user data
      await updateDoc(doc(db, "users", auth.currentUser.uid), editedUser);
      setIsEditing(false); // Exit editing mode
    } catch (err) {
      console.log(err.message);
    }
  };
  // ------------------------

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/home");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteAccount = async () => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete your account?"
      );
      if (confirm) {
        const user = auth.currentUser;

        if (user) {
          // Reauthenticate the user before deleting the account
          let currentPassword = prompt(
            "Please enter your password to confirm account deletion:"
          );
          console.log(currentPassword);
          if (currentPassword === null) {
            return; // User cancelled password prompt
          }

          let credential = EmailAuthProvider.credential(
            user.email,
            currentPassword
          );
          console.log(credential);

          // Reauthenticate the user with their password
          await reauthenticateWithCredential(user, credential)
            .then((success) => {
              console.log(success);
            })
            .catch((error) => {
              console.log(error);
            });

          // Delete user's avatar from Firebase Storage
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }

          // Delete user's data from Firestore
          await deleteDoc(doc(db, "users", auth.currentUser.uid));

          // Delete the user's account
          await user.delete();

          // Sign out the user before navigating
          await auth.signOut();

          // Navigate to the home page
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const gBack = () => {
    navigate(-1);
  };

  //----------------------------------------
  return user ? (
    // <div>
    //   <div className="back" onClick={gBack}>
    //     <h3>
    //       {" "}
    //       <TbArrowBackUpDouble />
    //       Back...
    //     </h3>
    //   </div>

    //   <div className="prof-con">
    //     <div className="profile_container">
    //       <div className="img_container">
    //         <img src={user.avatar || Img} alt="avatar" />
    //         <div className="overlay">
    //           <div>
    //             <label htmlFor="photo">
    //               <Camera />
    //             </label>
    //             {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
    //             <input
    //               type="file"
    //               accept="image/*"
    //               style={{ display: "none" }}
    //               id="photo"
    //               onChange={(e) => setImg(e.target.files[0])}
    //             />
    //           </div>
    //         </div>
    //       </div>
    //       <div className="text_container">
    //         <h3 className="p-cen">{user.name}</h3>
    //         <p>{user.email}</p>
    //         <hr />
    //         <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
    //       </div>

    //       <Button onClick={deleteAccount} variant="outline-danger">
    //         Delete Account
    //       </Button>
    //     </div>
    //   </div>
    // </div>

    // -------------------------------------------------------
    <div>
      <div className="back" onClick={gBack}>
        <h3>
          {" "}
          <TbArrowBackUpDouble />
          Back...
        </h3>
      </div>

      <div className="prof-con">
        <div className="profile_container">
          <div className="img_container">
            <img src={user.avatar || Img} alt="avatar" />
            <div className="overlay">
              <div>
                <label htmlFor="photo">
                  <Camera />
                </label>
                {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="photo"
                  onChange={(e) => setImg(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div className="text_container">
            {/* Editable input fields */}
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ user, name: e.target.value })}
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setUser({ user, email: e.target.value })}
                />
                <input
                  type="number"
                  value={user.age}
                  onChange={(e) => setUser({ user, age: e.target.value })}
                />
                <input
                  type="text"
                  value={user.gender}
                  onChange={(e) => setUser({ user, gender: e.target.value })}
                />
                <input
                  type="text"
                  value={user.country}
                  onChange={(e) => setUser({ user, country: e.target.value })}
                />
              </>
            ) : (
              <>
                <h3 className="p-cen">{user.name}</h3>
                <p>{user.email}</p>
                <p>Age: {user.age}</p>
                <p>Gender: {user.gender}</p>
                <p>Country: {user.country}</p>
              </>
            )}
            <hr />
            <small>
              Joined on:{" "}
              {user.createdAt ? user.createdAt.toDate().toDateString() : "N/A"}
            </small>
          </div>

          {/* Save Changes and Edit button */}
          {isEditing ? (
            <Button onClick={saveChanges} variant="outline-success">
              Save Changes
            </Button>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline-primary"
            >
              Edit Profile
            </Button>
          )}

          <Button onClick={deleteAccount} variant="outline-danger">
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  ) : // -------------------------------------------------------
  null;
};

export default Profile;
