import { FiCamera } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineClose } from "react-icons/md";
import { IoSparkles } from "react-icons/io5";

import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useUser } from "../components/UserContext";

export default function EditProfile() {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "profilesImage/";
  const navigate = useNavigate();
  const { EditUserProfile, user } = useUser();
  const [fullname, setFullname] = useState(user.name);
  const [user_id, setUser_id] = useState(user.userId);
  const [bio, setBio] = useState(user.bio);
  const [location, setLocation] = useState(user.location);
  const [website, setWebsite] = useState(user.website);
  const [dob, setDob] = useState(user.dob);
  const [ProfilePreview, setProfilePreview] = useState(BASE_URL+user.profilePic);
  const [BannerPreview, setBannerPreview] = useState(BASE_URL+user.bannerPic);
  const [BannerImage, setBannerImage] = useState();
  const [ProfileImage, setProfileImage] = useState();
  // const [Status,setStatus] = useState("")
  const BannerRef = useRef();
  const ProfileRef = useRef();

  const handleBannerImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      // setStatus('Please select a file first.');

      return;
    }
    const url = URL.createObjectURL(file);
    setBannerPreview(url);
    setBannerImage(file);
  };
  const RemoveImage = () => {
    setBannerPreview("");
    setBannerImage("BannerImage");
  };

  const handleProfileImage = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const url = URL.createObjectURL(file);
    setProfileImage(file);
    setProfilePreview(url);
  };
  const updateProfile = async () => {
    if (
      !user_id &&
      !name &&
      !bio &&
      !location &&
      !website &&
      !dob &&
      !ProfileImage &&
      !BannerImage
    ) {
      return ("no data");
    }
     await EditUserProfile(
      user_id,
      fullname,
      bio,
      location,
      website,
      dob,
      ProfileImage,
      BannerImage,
    );
    navigate(`/${user_id}`);
  };
  return (
    <div className="flex flex-col md:w-[580px] w-full rounded-2xl overflow-hidden">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Link
            aria-label="Close"
            className="text-black dark:text-white hover:bg-gray-800 rounded-full p-1"
            to={`/${user_id}`}
          >
            <MdOutlineClose size={20} />
          </Link>
          <span className="font-semibold text-black dark:text-white">
            Edit profile
          </span>
        </div>
        <button
          className="color-btn font-semibold text-sm px-4 py-1.5 rounded-full"
          onClick={() => updateProfile()}
        >
          Save
        </button>
      </div>

      <div className="relative h-36 bg-gray-700 ">
        <img
          src={BannerPreview}
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <div
            aria-label="Edit banner photo"
            className="bg-black/60 rounded-full p-2 text-black dark:text-white"
          >
            <div>
              <input
                className="hidden"
                type="file"
                accept="image/*"
                ref={BannerRef}
                onChange={handleBannerImage}
              />
            </div>
            <FiCamera
              onClick={() => {
                BannerRef.current.click();
              }}
              size={18}
            />
          </div>
          <button
            aria-label="Remove banner photo"
            className="bg-black/60 rounded-full p-2 text-black dark:text-white"
          >
            <RxCross1 onClick={RemoveImage} size={18} />
          </button>
        </div>
        <div className="absolute">
          <div className="grid place-items-center h-24 w-24 -mt-10 z-1">
            <div className="border flex items-center justify-center col-start-1 row-start-1 rounded-full">
              <img
                src={ProfilePreview || "https://placehold.co/50x50"}
                alt="profile image"
                className="rounded-full h-24 w-24 object-cover flex items-center justify-center"
              />
            </div>
            <div
              className="flex items-center justify-center col-start-1 row-start-1 h-10 w-10 rounded-full bg-gray-900/55"
              aria-label="Edit profile photo"
            >
              <input
                className="hidden"
                type="file"
                accept="image/*"
                ref={ProfileRef}
                onChange={handleProfileImage}
              />
              <FiCamera
                onClick={() => {
                  ProfileRef.current.click();
                }}
                size={16}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="ml-40 mx-4 mt-3 flex items-center justify-between dark:bg-gray-900 bg-gray-200 rounded-xl px-4 py-2.5">
        <div className=" flex items-center gap-2 text-sm">
          <IoSparkles size={16} />
          Customize yourself in seconds
        </div>
        <span className="text-xs">›</span>
      </div>
      <div className="flex flex-col px-4 pb-6 mt-2">
        <div className="border-b border-gray-800 py-3">
          <label className="text-xs text-gray-500 block mb-1">Name</label>
          <input
            type="text"
            value={fullname}
            onChange={(e) => {
              setFullname(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none border-1  "
          />
        </div>
        <div className="border-b border-gray-800 py-3">
          <label className="text-xs text-gray-500 block mb-1">user_id</label>
          <input
            type="text"
            value={user_id}
            onChange={(e) => {
              setUser_id(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none border-1  "
          />
        </div>
        <div className="border-b border-gray-800 py-3">
          <label className="text-xs text-gray-500 block mb-1">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none placeholder-gray-600 resize-none border-1  "
          />
        </div>
        <div className="py-3">
          <label className="text-xs text-gray-500 block mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none placeholder-gray-600 border-1  
            "
          />
        </div>
        <div className="py-3">
          <label className="text-xs text-gray-500 block mb-1">Website</label>
          <input
            type="text"
            value={website}
            onChange={(e) => {
              setWebsite(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none placeholder-gray-600 border-1  
            "
          />
        </div>
        <div className="py-3">
          <label className="text-xs text-gray-500 block mb-1">dob</label>
          <input
            type="text"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
            }}
            className="w-full dark:bg-gray-900 bg-gray-200 text-black dark:text-white text-sm outline-none placeholder-gray-600 border-1  
            "
          />
        </div>
      </div>
    </div>
  );
}
