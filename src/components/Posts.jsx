import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaBookmark,FaRegBookmark } from "react-icons/fa";
import {  } from "react-icons/fa";
import { BiRepost, BiMessageRounded } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";
import moment from "moment";
import { usePosts } from "./PostsContext";
import { useUser } from "./UserContext";
import { CopyLinkButton } from "./Elements";
import CreatePost from "./CreatePost";

export function PostImage({ posts }) {
  const POST_IMAGE_URL = import.meta.env.VITE_BASE_URL + "postsImage/";
  return (
    <Link to={`/full/${posts?._id}`}>
      {posts?.imagePath && (
        <img
          className="max-h-dvh object-contain cursor-pointer justify-center items-center"
          src={POST_IMAGE_URL + posts?.imagePath}
          width={1500}
          height={1500}
          alt=""
        />
      )}
    </Link>
  );
}
export function PostProfile({ post }) {
  const { GetUserById } = useUser();
  
  const { data: postUser = [] } = GetUserById(post?.postedBy);

  const BASE_URL = import.meta.env.VITE_BASE_URL + "profilesImage/";

  return (
    <>
      <img
        src={BASE_URL + postUser?.profilePic}
        alt=""
        width={30}
        height={30}
        className="flex rounded-full justify-center h-10 w-10 object-cover"
      />
      <Link
        to={`/${postUser?.userId}`}
        className="flex justify-center font-bold mx-2"
      >
        {postUser?.name}
        <p className="font-thin text-sm text-gray-500 mx-2">
          @{postUser?.userId}
        </p>{" "}
        <p className="font-thin text-sm text-gray-500">
          {moment(post?.createdAt).fromNow()}{" "}
        </p>
      </Link>
    </>
  );
}

export function ActionBtn({ posts }) {
  const { user, AddBookmark } = useUser();
  const [RepostPopUp, setRepostPopUp] = useState(false);
  const onLike = (id) => {
    console.log(id);
    
  };
  const onClickBookmark = (postId) => {
    AddBookmark({ userId: user._id, postId: postId });
  };
  const isBookmarked = user.bookmarks.some(
    (id) => id.toString() === posts?._id,
  );

  function formatCount(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "K";
    return n?.toString();
  }

  return (
    <div className="flex items-center gap-16 my-1">
      {RepostPopUp && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => {
            setRepostPopUp(false);
          }}
        >
          <div className="z-10">
            <ReplayPopup />
          </div>
        </div>
      )}
      <button
        onClick={() => {
          setRepostPopUp(true);
        }}
        className="flex items-center text-gray-500 hover:text-sky-400 group/btn transition-colors"
      >
        <span
          className="p-1.5 round
      <button
        onClick={() => {ed-full group-hover/btn:bg-sky-400/10 transition-colors"
        >
          <BiMessageRounded className="text-base" />
        </span>
        <span className="">{formatCount(posts?.commentCount)}</span>
      </button>
      <button className="flex items-center text-gray-500 hover:text-green-400 group/btn transition-colors">
        <span className="p-1.5 rounded-full group-hover/btn:bg-green-400/10 transition-colors">
          <BiRepost className="text-lg" />
        </span>
        <span className="">{formatCount(posts?.repostCount)}</span>
      </button>
      <button
        onClick={() => onLike(posts?._id)}
        className={`flex items-center group/btn transition-colors ${posts?.liked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"}`}
      >
        <span className="p-1.5 rounded-full group-hover/btn:bg-pink-500/10 transition-colors">
          {posts?.liked ? (
            <AiFillHeart className="text-base" />
          ) : (
            <AiOutlineHeart className="text-base" />
          )}
        </span>
        <span className="">
          {formatCount(posts?.likeCount + (posts?.liked ? 0 : 0))}
        </span>
      </button>
      <div className="ml-auto flex">
        <CopyLinkButton
          url={`${window.location.origin}/comment/${posts?._id}`}
        />
        <button
          onClick={() => onClickBookmark(posts?._id)}
          className="flex items-center  text-gray-500 hover:text-sky-400 group/btn transition-colors"
          aria-label="Remove bookmark"
        >
          <span className="p-1.5 rounded-full group-hover/btn:bg-sky-400/10 transition-colors">
            {isBookmarked ? (
              <FaBookmark className="text-base text-blue-500" />
            ) : (
              <FaRegBookmark className="text-base" />
            )}
          </span>
        </button>
      </div>
    </div>
  );
}
export function ReplayPopup() {
  return (
    <>
      <div className="color">
        <CreatePost />
      </div>
    </>
  );
}

export default function Posts({ post }) {
  const { user, GetUserById } = useUser();
  const { deletePost } = usePosts();
  const [PostMenu, setPostMenu] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: postUser = [] } = GetUserById(post?.postedBy);

  const handleDelete = () => {
    deletePost.mutateAsync(post?._id);
  };
  const profileAction = (value, id) => {
    console.log(value,id);
    
  };

  return (
    <>
      <div className="custom-border pt-2">
        <div className="flex gap-3">
          <div className="shrink-0"></div>
          {PostMenu && (
            <div
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
              onClick={() => setPostMenu(false)}
            >
              <dialog
                closedby="any"
                className={`color dark:bg-gray-900 bg-gray-200  m-auto rounded-lg flex`}
              >
                {postUser?._id === user._id ? (
                  <ul className="rounded-lg">
                    <li className="dropdown-item inline-flex ">
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold text-red-600"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Delete
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Pin to your profile{" "}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Highlight on your profile{" "}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Add/remove from Lists{" "}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Mute this conversation{" "}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Change who can reply{" "}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      {" "}
                      <button
                        onClick={() => setShowConfirm(true)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        View post activity{" "}
                      </button>
                    </li>
                  </ul>
                ) : (
                  <ul className="mt-2 rounded-lg ">
                    <li className="dropdown-item inline-flex ">
                      <button
                        onClick={() =>
                          profileAction("Unfollow", postUser?._id)
                        }
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" /> Unfollow @
                        {postUser?.name}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      <button
                        onClick={() =>
                          profileAction("Unfollow", postUser?._id)
                        }
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" />
                        Add/remove from Lists
                      </button>
                    </li>
                    <li className="dropdown-item">
                      <button
                        onClick={() => profileAction("Mute", postUser?._id)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" /> Mute @
                        {postUser?.name}
                      </button>
                    </li>
                    <li className="dropdown-item">
                      <button
                        onClick={() => profileAction("Block", postUser?._id)}
                        className="p-3 inline-flex hover:bg-slate-700 w-full font-bold"
                      >
                        <FiTrash2 className="mr-3 text-xl" /> Block @
                        {postUser?.name}
                      </button>
                    </li>
                  </ul>
                )}
              </dialog>
            </div>
          )}
          <div className="flex flex-col flex-1">
            {/* postName row */}
            <div className="flex justify-center align-top py-2">
              <PostProfile key={post?._id} post={post} />
              <div
                onClick={() => setPostMenu(!PostMenu)}
                className="ml-auto rounded-full hover:bg-gray-800 hover:text-sky-400 justify-start"
              >
                <BsThreeDots />
              </div>
            </div>
            {/* Post content */}
            <div className="ml-12 -mt-5">
              <Link to={`/comment/${post?._id}`}>
                <p className="mt-1 font-thin pb-2 text-[15px]">
                  {post?.description}
                </p>
              </Link>
              <PostImage key={post?._id} posts={post} />
            </div>
            {/* Action buttons */}
            <div className="ml-11">
              <ActionBtn
                key={post?._id}
                posts={post}
                postUserID={postUser?._id}
              />
            </div>
          </div>
        </div>
      </div>
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-black border border-gray-700 rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-black dark:text-white mb-2">
              Delete post?
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              This can’t be undone and it will be removed from your profile, the
              timeline of any accounts that follow you, and from search results.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleDelete(post?._id)}
                className="w-full py-3 bg-red-500 hover:bg-red-400 text-black dark:text-white font-semibold rounded-full transition-colors text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 border border-gray-600 dark:hover:bg-gray-900 hover:bg-gray-200 text-black dark:text-white font-semibold rounded-full transition-colors text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
