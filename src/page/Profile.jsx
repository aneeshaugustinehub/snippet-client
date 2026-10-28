import { CiLocationOn } from "react-icons/ci";
import { Link, useParams } from "react-router-dom";
import Posts from "../components/Posts";
import { usePosts } from "../components/PostsContext";
// import axios from "axios";
// import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import FollowButton from "../components/FollowButton";
import { GoArrowLeft } from "react-icons/go";
import Loading from "../components/Loading";

export default function Profile() {
  const { user, GetUserByUsername } = useUser();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  // const [profile, setProfile] = useState();
  const { username } = useParams();
  const { usePostsByUser } = usePosts();

  // useEffect(() => {
  //   async function fetchUser(id) {
  //     const res = await axios.get(BASE_URL + "users/" + id);
  //     setProfile(res.data);
  //   }
  //   fetchUser(username);
  // }, [username, BASE_URL]);
  
  const {
    data: userData = [],
    isLoading: userLoading,
    error: errorUser,
  } = GetUserByUsername(username);
  
  // console.log("userdata",userData,"user",user);
  const {
    data: postsByUser = [],
    isLoading: postLoading,
    error: postError,
  } = usePostsByUser(userData?._id);

  const bannerImage = userData?.bannerPic
    ? BASE_URL + "profilesImage/" + userData?.bannerPic
    : "https://placehold.co/240x240";
  const ProfileImage = userData?.profilePic
    ? BASE_URL + "profilesImage/" + userData.profilePic
    : "https://placehold.co/60x60";

  if (userLoading) {
    return (
      <div className="flex flex-col md:w-[580px] ">
        <Loading />
      </div>
    );
  }
  if (errorUser) {
    return (
      <div className="md:w-[580px] pt-20 flex justify-center">
        <div className="">
          <h1 className="text-3xl font-black ">
            This account doesn’t <br /> exist
          </h1>
          <p className="text-gray-600">Try searching for another.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col md:w-[580px] ">
        <div className="inline-flex text-xl font-bold p-2 fixed bg-slate-950/70 w-full">
          <Link to="/home">
            <GoArrowLeft />{" "}
          </Link>
          <h1 className="pl-6">{userData?.name}</h1>
        </div>
        <div className="mt-11">
          <div className={`${userData ? "" : "hidden"}`}>
            {/* Banner */}
            <img
              src={bannerImage}
              className="w-full h-48 md:h-60 object-cover"
              alt="banner"
              height=""
            />
            {/* Profile info */}
            <div className="border-b border-gray-700 p-3">
              <div className="flex flex-col">
                {/* Avatar + Edit button row */}
                <div className="flex justify-between items-start">
                  <img
                    src={ProfileImage}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-black object-cover -mt-14 "
                    alt="profile"
                  />
                  {username === user?.userId ? (
                    <Link to="/EditProfile" className="nav-link text-4xl ">
                      <button
                        type="button"
                        className="border dark:border-white border-black text-black dark:text-white text-sm font-bold px-4 py-1 rounded-full hover:bg-white hover:text-black transition"
                      >
                        Edit profile
                      </button>
                    </Link>
                  ) : (
                    <FollowButton id = {userData._id}/>
                  )}
                </div>

                {/* Details */}
                <div className="pt-3">
                  <h5 className="font-bold text-black dark:text-white text-lg m-0">
                    {userData?.name}
                  </h5>
                  <p className="font-light text-gray-500">
                    @{userData?.userId}
                  </p>
                  <p className="text-black dark:text-white">{userData?.bio}</p>

                  {/* Meta info */}
                  <div className="text-gray-500 flex flex-wrap gap-2 text-sm">
                    <span>💼 {userData?.tag}</span>
                    <span className="inline-flex">
                      <CiLocationOn /> {userData?.location}
                    </span>
                    <span>
                      🔗
                      <a
                        href={userData?.website}
                        className="text-blue-400 hover:underline"
                      >
                        {userData?.website}
                      </a>
                    </span>
                    <span>
                      🎈 Born{" "}
                      {new Date(userData?.dob).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span style={{ color: "#888", fontSize: "14spanx" }}>
                      📅 Joined{" "}
                      {new Date(userData?.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>{" "}
                  </div>
                  {/* Following / Followers */}
                  <div className="flex gap-4 mt-2 text-sm text-black dark:text-white">
                    <span>
                      <span className="font-bold">
                        {userData?.following?.length}
                      </span>
                      <span className="text-gray-500"> Following</span>
                    </span>
                    <span>
                      <span className="font-bold">
                        {userData?.followers?.length}
                      </span>
                      <span className="text-gray-500"> Followers</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {postLoading && <Loading />}
            {postError && (
              <>
                <div className="flex justify-center items-center py-4">
                  <h1>no posts </h1>
                </div>
              </>
            )}
            {!postLoading &&
              !postError &&
              postsByUser?.map((post) => <Posts key={post._id} post={post} />)}
          </div>
        </div>
      </div>
    </>
  );
}
