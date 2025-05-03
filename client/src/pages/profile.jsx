/* eslint-disable react/jsx-no-duplicate-props */
import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import { Link } from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOut,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(null);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const filePickerRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);

  const uploadImage = async () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(progress.toFixed(0));
      },
      (error) => {
        setImageError("Image size should be less than 5mb");
        console.error("Upload error:", error);
        setImagePercent(null);
        setImage(null);
        setImageFileUrl(null);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
        } catch (error) {
          console.error("Error getting download URL:", error);
          setImageError("Error uploading image");
          setImagePercent(null);
          setImage(null);
          setImageFileUrl(null);
        }
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Log form data
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setUpdateUserError(data.message);
        setUpdateSuccess(null);
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess("User profile updated successfully");
      setUpdateUserError(null);
    } catch (error) {
      dispatch(updateUserFailure(error));
      setUpdateUserError(error.message);
      setUpdateSuccess(null);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure());
        return;
      }
      dispatch(deleteUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getProfileHeader = () => {
    if (currentUser?.isAdmin) return "Admin Profile";

    return "Profile";
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full mt-20 pb-10">
      <h1 className="my-7 text-center font-semibold text-3xl text-dark">
        {getProfileHeader()}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <section className="hero-section"></section>
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imagePercent > 0 && imagePercent < 100 && (
            <CircularProgressbar
              value={imagePercent}
              text={`${imagePercent}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${imagePercent / 100})`,
                },
              }}
              aria-label="Uploading Image"
            />
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full border-8 border-[lightgray] ${
              imagePercent && imagePercent < 100 ? "opacity-60" : ""
            }`}
            aria-label="User Profile Image"
          />
        </div>
        {imageError && <Alert color="failure">{imageError}</Alert>}

        <h1>Username</h1>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser?.username}
          onChange={handleChange}
        />
        <h1>Email</h1>
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={handleChange}
        />
        <h1>First Name</h1>
        <TextInput
          type="text"
          id="firstName"
          placeholder="First Name"
          defaultValue={currentUser?.firstName}
          onChange={handleChange}
        />
        <h1>Last Name</h1>
        <TextInput
          type="text"
          id="lastName"
          placeholder="Last Name"
          defaultValue={currentUser?.lastName}
          onChange={handleChange}
        />

        <h1>Phone</h1>
        <TextInput
          type="number"
          id="mobile"
          placeholder="Mobile"
          defaultValue={currentUser?.mobile}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="bg-gradient-to-r from-[#6A0DAD] to-[#8A2BE2] text-white"
          disabled={loading}
        >
          {loading ? "Loading.." : "Update Account"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span onClick={() => setShowModel(true)} className="cursor-pointer">
          <Button className="bg-gradient-to-r from-red-800 to-red-900">
            Delete Account
          </Button>
        </span>
        <span onClick={handleSignOut} className="cursor-pointer">
          <Button className="border-red-700 text-black hover:bg-gradient-to-r from-red-800 to-red-900 hover:text-white">
            Sign Out
          </Button>
        </span>
      </div>
      <div className="text-purple-600">
        {updateSuccess && (
          <Alert color="success" className="mt-5">
            {updateSuccess}
          </Alert>
        )}
      </div>

      <div className="text-red-600">
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
      </div>

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-200">
              Are you sure you want to Delete your Account
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              color="failure"
              onClick={handleDeleteUser}
              className="bg-red-600"
            >
              Yes, I am sure
            </Button>
            <Button
              color="gray"
              onClick={() => setShowModel(false)}
              className="bg-green-600"
            >
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
