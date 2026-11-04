import { IoSettingsOutline } from "react-icons/io5";
import { AiOutlineHeart } from "react-icons/ai";
import { BiRepost, BiMessageRounded } from "react-icons/bi";
import { HiOutlineAtSymbol } from "react-icons/hi";
import { RiUserFollowLine } from "react-icons/ri";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../components/UserContext";
import axios from "axios";

// import { notifications } from "../components/DemoData";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const avatarColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-yellow-500",
];

const iconMap = {
  like: { Icon: AiOutlineHeart, color: "text-pink-500", bg: "bg-pink-500/10" },
  follow: {
    Icon: RiUserFollowLine,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  repost: { Icon: BiRepost, color: "text-green-500", bg: "bg-green-500/10" },
  comment: {
    Icon: BiMessageRounded,
    color: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  mention: {
    Icon: HiOutlineAtSymbol,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
};

const TABS = ["All", "Mentions"];

const textMap = {
  like: "liked your post",
  follow: "followed you",
  comment: "commented on your post",
  repost: "reposed your post",
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function NotifItem({ n, onRead }) {
  const { GetUserById } = useUser();

  const { Icon, color, bg } = iconMap[n.type] ?? iconMap.like;
  const { data: user = [] } = GetUserById(n.from._id);
  

  return (
    <div
      onClick={() => !n.read && onRead(n._id)}
      className={`flex gap-3 px-4 py-3.5 border-b border-gray-800 cursor-pointer items-start ${!n.read ? "bg-sky-500/[0.03]" : ""}`}
    >
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div
          className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center`}
        >
          <Icon className={`${color} text-lg`} />
        </div>
        {user?.profileImg ? (
          <img src={user.profileImg} className="w-10 h-10 rounded-full" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-semibold">
            {user?.username?.[0]?.toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex justify-between items-start gap-2">
          <p className="text-sm leading-snug">
            <span className="font-semibold text-black dark:text-white">
              {user?.name}
            </span>
            <span className="text-gray-400"> {textMap[n.type]}</span>
          </p>
          <span className="text-xs text-gray-500">{timeAgo(n.createdAt)}</span>
        </div>
        {!n.read && <div className="w-2 h-2 rounded-full bg-sky-500 mt-2" />}
      </div>
    </div>
  );
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("All");
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await axios.get(BASE_URL + "notifications", {
        headers: authHeaders(),
      });
      return res.data;
    },
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["notifications"] });

  const markRead = useMutation({
    mutationFn: (id) =>
      axios.patch(`${BASE_URL}notifications/${id}/read`, null, {
        headers: authHeaders(),
      }),
    onSuccess: refresh,
  });

  const markAllRead = useMutation({
    mutationFn: () =>
      axios.patch(`${BASE_URL}notifications/read-all`, null, {
        headers: authHeaders(),
      }),
    onSuccess: refresh,
  });

  const list =
    activeTab === "Mentions"
      ? notifications.filter((n) => n.type === "comment")
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col w-full max-w-[580px] min-h-screen border-x border-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-10 dark:bg-black/80 bg-white/80 backdrop-blur-sm px-4 py-3.5 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-black dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="bg-sky-500 text-black dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <button className="text-gray-400 dark:hover:text-white hover:text-black transition-colors p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800">
          <IoSettingsOutline className="text-xl" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-sm font-medium transition-colors dark:hover:bg-gray-900 hover:bg-gray-200 ${
              activeTab === tab
                ? "text-black dark:text-white border-b-2 border-sky-500"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mark all read */}
      {activeTab === "All" && unreadCount > 0 && (
        <div className="flex justify-between items-center px-4 py-2.5 border-b border-gray-800">
          <p className="text-sm font-medium text-black dark:text-white">
            New notifications
          </p>
          <button
            onClick={() => markAllRead.mutate()}
            className="text-sm text-sky-500 hover:underline"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notification list */}
      {list.length > 0 ? (
        list.map((n) => (
          <NotifItem key={n._id} n={n} onRead={(id) => markRead.mutate(id)} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center px-8">
          <p className="text-2xl font-bold text-black dark:text-white mb-2">
            Nothing here yet
          </p>
          <p className="text-gray-500 text-sm">
            {activeTab === "Mentions"
              ? "When someone mentions you, it'll show up here."
              : "When you get notifications, they'll show up here."}
          </p>
        </div>
      )}
    </div>
  );
}
