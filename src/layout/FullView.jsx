import Posts, {
  ActionBtn,
  PostImage,
} from "../components/Posts";
import { useParams } from "react-router-dom";
import { usePosts } from "../components/PostsContext";
import Loading from "../components/Loading";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { Link } from "react-router-dom";
import { FiImage } from "react-icons/fi";
import { useRef, useState } from "react";
import { FaRegSmile } from "react-icons/fa";
import { useUser } from "../components/UserContext";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";

export default function FullView() {
  const { user, GetUserById } = useUser();

  const [sidebar, setSidebar] = useState(true);
  const BASE_URL = import.meta.env.VITE_BASE_URL + "profilesImage/";
  const { CreateReplay, PostByID, useGetReplay } = usePosts();
  const CommentImageRef = useRef();
  const [CommentImagePreview, setCommentImagePreview] = useState();
  const [CommentImage, setCommentImage] = useState();
  const [Comment, setComment] = useState("");
  const { id } = useParams();

  const { data: posts = [], isLoading, error } = PostByID(id);
  const { data: replay = [] } = useGetReplay(id);
  const { data: postUser = [] } = GetUserById(posts.postedBy);

  // console.log(replay,id,"post use and replay id");
  

  const ImagePreviewHandle = (e) => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setCommentImagePreview(url);
    setCommentImage(file);
  };

  const CommentHandle = () => {
    if (!posts._id) return;
    if (!Comment && !CommentImage) return;
    CreateReplay({
      postId: posts._id,
      ReplayText: Comment,
      ReplayImage: CommentImage,
    });
    setComment("");
    setCommentImagePreview(null);
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!posts) return <div>no post: </div>;
  // if(posts.replayId){
  // }

  return (
    <>
      <div className="w-full h-full flex">
        {/* Button */}
        <div className="inline-flex text-xl font-bold fixed w-full">
          <Link
            className="bg-slate-800/70 custom-border rounded-full m-3 p-2"
            onClick={()=>history.back()}
          >
            <GoArrowLeft />
          </Link>
          <div
            onClick={() => {
              setSidebar(!sidebar);
            }}
            className="bg-slate-800/70 cursor-pointer custom-border rounded-full m-3 p-2 ml-[410px]"
          >
            <GoArrowRight />
          </div>
        </div>
        {/* Image */}
        <div className="w-full flex h-dvh ">
          <div className="flex h-full w-full justify-center items-center">
            <PostImage key={posts._id} posts={posts} />
          </div>
        </div>
      </div>
      {sidebar && (
        <div className="w-[410px] max-w-[410px] border-l border-gray-800 ">
          <div className="flex py-4 custom-border">
            <div className="items-center w-full">
              {/* post info */}
              <div className="custom-border my-2 inline-block">
                <div className="flex justify-center p-2">
                  <img
                    src={BASE_URL + postUser?.profilePic}
                    alt=""
                    width={30}
                    height={30}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                  <Link
                    to={`/${postUser?.userId}`}
                    className="flex justify-center font-bold p-2"
                  >
                    {postUser?.name}
                    <p className="font-thin text-sm text-gray-500 mx-2">
                      @{postUser?.userId}
                    </p>{" "}
                  </Link>
                  <button
                    // onClick={() => setPostMenu(!PostMenu)}
                    className="ml-auto rounded-full hover:bg-gray-800 hover:text-sky-400 px-2"
                  >
                    <BsThreeDots />
                  </button>
                </div>
                <div>
                  {" "}
                  <Link to={`/comment/${posts._id}`}>
                    {/* posts text */}
                    <p className="font-thin text-[15px]">
                      {posts.description}
                    </p>
                  </Link>
                </div>
                <p className="font-thin text-sm text-gray-500 my-3 px-2">
                  {moment(posts.createdAt).calendar()}{" "}
                </p>

                {/* action button */}
                <div>
                  <ActionBtn key={posts._id} posts={posts} />
                </div>
              </div>
              {/* replay */}
              <div className="custom-border">
                <div className="flex px-2">
                  <img
                    src={BASE_URL + user.profilePic}
                    alt="img"
                    className="rounded-full h-10 w-10 object-cover shrink-0 "
                  />
                  <input
                    className="border-none focus:outline-none focus:ring-0 w-full min-w-full bg-transparent text-xl px-2 py-2"
                    type="text"
                    value={Comment}
                    placeholder="what's happening?"
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
                <img
                  src={CommentImagePreview || null}
                  alt=""
                  className="object-cover"
                />
                <div className="flex items-center m-2">
                  <FiImage
                    className="text-2xl text-gray-600 mr-2 cursor-pointer"
                    onClick={() => {
                      CommentImageRef.current.click();
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={CommentImageRef}
                    encType="multipart/form-data"
                    onChange={ImagePreviewHandle}
                    className="hidden"
                  />
                  {/* <FiImage className="text-2xl text-gray-600 mx-2" /> */}
                  <FaRegSmile className="text-2xl text-gray-600 mx-2 cursor-pointer" />
                  <button
                    className="color-btn px-4 py-1 rounded-2xl ml-auto font-bold"
                    onClick={CommentHandle}
                  >
                    post
                  </button>
                </div>
              </div>
              <div className="w-24">
                {replay?.map((replay) => (
                  <div className="">
                    <Posts key={replay._id} post={replay} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
