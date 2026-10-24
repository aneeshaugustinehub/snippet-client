import { GoHome } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import { MdNotificationsNone } from "react-icons/md";
import { BsChat, BsThreeDots } from "react-icons/bs";
import { FaRegBookmark } from "react-icons/fa6";
import { CiUser } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoLogoOctocat } from "react-icons/io5";
import { Link } from "react-router-dom";
// import { useEffect } from "react";
import { useUser } from "../components/UserContext";
import CreatePost from "../components/CreatePost";
import { PostsProvider } from "../components/PostsProvider";
import { useState } from "react";

export default function NavBar() {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "profilesImage/";

  const { logout, user } = useUser();
  const userdata = user;
  const ProfileImage = user?.profilePic
    ? BASE_URL + user?.profilePic
    : "/favicon.svg";
  const [navMore, setNavMore] = useState(null);
  const [navAcc, setNavAcc] = useState(null);
  const [navPost, setNavPost] = useState(null);

  const handleLogout = () => {
    logout();
    window.location.reload()
  };

  return (
    <>
      <div className="navbar">
        <div className="nav-item">
          <Link to="home" className="nav-link">
            <IoLogoOctocat />
          </Link>
        </div>
        <div className={`${user ? `h-full flex flex-col` : `hidden`}`}>
          <div>
            <ul className="" id="menu">
              <li className="nav-item">
                <Link to="/home" className="nav-link">
                  <GoHome />
                  <span className="nav-title">Home</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/explore" className="nav-link ">
                  <IoSearch />
                  <span className="nav-title">Explore</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Notifications" className="nav-link ">
                  <MdNotificationsNone />
                  <span className="nav-title">Notifications</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/chat" className="nav-link ">
                  <BsChat /> <span className="nav-title">chat</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Gork" className="nav-link ">
                  <IoMdAddCircleOutline /> <span className="nav-title">AI</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Bookmarks" className="nav-link ">
                  <FaRegBookmark />
                  <span className="nav-title">Bookmarks</span>
                </Link>
              </li>
              <li className="nav-item">
                {userdata && userdata.userId && (
                  <Link to={`/${userdata?.userId}`} className="nav-link ">
                    <CiUser />
                    <span className="nav-title">Profile</span>
                  </Link>
                )}
              </li>
              <li className="nav-item hidden">
                <button
                  className="nav-link"
                  aria-expanded="false"
                  onClick={() => {
                    setNavMore(!navMore);
                  }}
                >
                  <CiCircleMore />
                  <span className="nav-title">More</span>
                </button>
              </li>
            </ul>
            <dialog
              className={`dropdown ${navMore ? "flex " : ""}`}
              closedby="any"
              id="nav-more-menu"
            >
              <ul className=" bottom-24 left-0 right-0 m-auto px-2 rounded-lg">
                <li className="dropdown-item">
                  <Link to="" className="box-link ">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Communities</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link ">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">list</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link ">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Communities</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link ">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Monetization</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Pro</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Ads</span>
                  </Link>
                </li>
                <li className="dropdown-item">
                  <Link to="" className="box-link ">
                    <IoMdAddCircleOutline />
                    <span className="nav-title">Settings and privacy</span>
                  </Link>
                </li>
              </ul>
            </dialog>
          </div>
          <div className="">
            <button
              className=""
              onClick={() => {
                setNavPost(!navPost);
              }}
            >
              <IoMdAddCircleOutline className="rounded-full xl:hidden flex text-4xl  bg-gray-100 hover:bg-slate-200 text-gray-900" />
              <span className="color-btn rounded-full xl:py-3 xl:px-24 justify-center items-center xl:flex hidden font-black text-lg">
                Post
              </span>
            </button>
          </div>
          <div className="py-2 cursor-pointer mt-auto">
            <div
              onClick={() => {
                setNavAcc(!navAcc);
              }}
              className="inline-flex py-5"
            >
              <img
                src={ProfileImage}
                alt={userdata?.fullname}
                width="50"
                height="50"
                className="rounded-full h-12 w-12 object-cover"
              />
              <div className="username px-4 hidden xl:block">
                <span className="text-md font-bold p-0">{userdata?.name}</span>{" "}
                <br />
                <span className="font-light text-gray-500">
                  @{userdata?.userId}
                </span>
              </div>
              <BsThreeDots className=" hidden xl:block" />
            </div>{" "}
            {navAcc && (
              <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
                onClick={() => setNavAcc(false)}
              >
                <dialog
                  className={`dropdown flex flex-col`}
                  closedby="any"
                  id="account-menu"
                >
                  <button
                    onClick={handleLogout}
                    className="dropdown-item py-2 px-2 my-1"
                  >
                    <div>Log out{userdata?.user_id}</div>
                  </button>
                  <button className="dropdown-item py-2 px-2 my-1 ">
                    <div className="">Add an existing account</div>
                  </button>
                </dialog>
              </div>
            )}
          </div>
        </div>
      </div>
      {navPost && (
      <div
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
        // onClick={() => setNavPost(false)}
      >
        <dialog
          className={"flex color-popup color  p-4 pb-3 min-w-96"}
          closedby="any"
        >
          <div className="block ">
            <div>
              <span
                className="px-2 hover:bg-slate-700 rounded-full"
                onClick={() => {
                  setNavPost(!navPost);
                }}
              >
                x
              </span>
              <span className=" flex-row ml-auto text-sky-500">Drafts</span>
            </div>
            <PostsProvider>
              <CreatePost onPostCreated={() => setNavPost(null)}/>
            </PostsProvider>
          </div>
        </dialog>
      </div>)}
    </>
  );
}
