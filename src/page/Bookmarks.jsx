import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BiBookmark } from "react-icons/bi";
import { useUser } from "../components/UserContext";
import Loading from "../components/Loading";
import PostsAndReplay from "../components/PostsAndReplay";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";

export default function Bookmarks() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user, AddBookmark } = useUser();
  const [search, setSearch] = useState("");
  

  const bookmarkQueries = useQueries({
    queries: user?.bookmarks?.map((id) => ({
      queryKey: ["bookmarkPost", id],
      queryFn: async () => {
        const res = await axios.get(`${BASE_URL}Posts/${id}`);
        if (res.data.posts === null) {
          return id;
        }
        return res.data.posts;
      },
      enabled: !!id,
    })),
  });

  const isLoading = bookmarkQueries?.some((q) => q.isLoading);
  const bookmarkPosts = bookmarkQueries
    .filter((q) => q.isSuccess)
    .map((q) => q.data);

  const filtered = bookmarkPosts.filter((b) => {
    if (!search) return true;    
    const q = search.toLowerCase();
    return b.description?.toLowerCase().includes(q);
  });

  return (
    <div className="flex flex-col w-full max-w-[580px] min-h-screen border-x border-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-10 dark:bg-black/80 bg-white/80 backdrop-blur-sm px-4 py-3.5 border-b border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black dark:text-white">
          Bookmarks
        </h1>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-800">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
          <input
            type="text"
            placeholder="Search bookmarks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full dark:bg-gray-900 dark:hover:bg-gray-800 hover:bg-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-black dark:text-white outline-none border-2 border-transparent focus:border-sky-500 dark:focus:bg-black focus:bg-white transition-colors placeholder-gray-500"
          />
        </div>
      </div>

      {/* Tag filters */}
      {/* <div className="flex gap-2 px-4 py-3 border-b border-gray-800 overflow-x-auto">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
              activeTag === tag
                ? "dark:bg-white dark:text-black bg-black text-white"
                : "dark:bg-gray-900 bg-gray-200 text-gray-400 hover:bg-gray-800 border border-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </div> */}

      {/* Count */}
      {user.bookmarks.length > 0 && (
        <div className="px-4 py-2 border-b border-gray-800">
          <p className="text-xs text-gray-500">
            {filtered.length} bookmark{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Bookmarks list */}

      {isLoading ? (
        <Loading />
      ) : filtered.length > 0 ? (
        filtered.map((b, i) =>
          !b._id ? (
            <>
              <div className="py-5 custom-border my-2">
                <div className="flex justify-center">
                  <div className="">
                    <h1 key={i} className="text-2xl justify-center">
                      This Post was deleted.
                    </h1>
                    <p className="justify-center">This Post is unavailable.</p>
                  </div>
                </div>
                <div className="flex py-5 justify-center">
                  <button
                    className="justify-center w-24 border rounded-xl border-gray-600 text-black dark:text-white hover:border-red-500 hover:text-red-500"
                    onClick={() =>
                      AddBookmark({ userId: user._id, postId: b })
                    }
                  >
                    Delete Bookmark
                  </button>
                </div>
              </div>
            </>
          ) : (
            <PostsAndReplay key={b._id} post={b} isBookmark = {true} />
          ),
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center px-8">
          <div className="w-16 h-16 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center mb-5">
            <BiBookmark className="text-sky-400 text-3xl" />
          </div>
          <p className="text-2xl font-bold text-black dark:text-white mb-2">
            {search !== "All" ? "No results" : "Save posts for later"}
          </p>
          <p className="text-gray-500 text-sm max-w-xs">
            {search !== "All"
              ? "Try a different search or filter."
              : "Bookmark posts to easily find them again in the future."}
          </p>
        </div>
      )}
    </div>
  );
}
