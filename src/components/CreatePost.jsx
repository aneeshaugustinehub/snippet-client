import { FiImage } from "react-icons/fi";
import { useRef, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { useUser } from "./UserContext";
import { usePosts } from "./PostsContext";

export default function CreatePost({ onPostCreated }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "profilesImage/";

  const { CreatePost } = usePosts();
  const { user } = useUser();
  const [Description, setDescription] = useState("");
  const [PostImage, setPostImage] = useState();
  const [PostImagePreview, setPostImagePreview] = useState();
  const ProfileImage = user?.profilePic
    ? BASE_URL + user?.profilePic
    : "/favicon.svg";
  const PostImageRef = useRef();
  const PostImages = [];

  const PostImagePreviewHandel = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    const newPostImages = [...PostImages, url];
    setPostImagePreview(newPostImages);
    setPostImage(file);
  };

  const PostHandle = async () => {
    if (!Description && !PostImage) return;
    await CreatePost({ Description, PostImage });
    setDescription("");
    setPostImagePreview(null);
    onPostCreated?.();
  };

  return (
    <div className="flex px-4 py-2  w-full h-full">
      <div className="shrink-0">
        <img
          src={ProfileImage}
          alt="img"
          className="rounded-full h-10 w-10 object-cover"
        />
      </div>

      <div className="block items-center w-full mx-2">
        <textarea
          className="border-none focus:outline-none focus:ring-0 w-full min-w-full bg-transparent text-xl py-2"
          type="text"
          value={Description}
          placeholder="what's happening?"
          onChange={(value) => setDescription(value.target.value)}
        />
        <img
          src={PostImagePreview || null}
          alt=""
          className="max-h-80 object-cover"
        />

        <div className="flex items-center">
          {" "}
          <FiImage
            className="text-2xl text-gray-600 mr-2 cursor-pointer"
            onClick={() => {
              PostImageRef.current.click();
            }}
          />
          <input
            type="file"
            accept="image/*"
            ref={PostImageRef}
            encType="multipart/form-data"
            onChange={PostImagePreviewHandel}
            className="hidden"
          />
          {/* <FiImage className="text-2xl text-gray-600 mx-2" /> */}
          <FaRegSmile className="text-2xl text-gray-600 mx-2 cursor-pointer" />
          <button
            className="color-btn px-4 py-1 rounded-2xl ml-auto font-bold"
            onClick={PostHandle}
          >
            post
          </button>
        </div>
      </div>
    </div>
  );
}
