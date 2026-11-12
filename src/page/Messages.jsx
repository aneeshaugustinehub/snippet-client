import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { io } from "socket.io-client";
import { FiSearch, FiEdit } from "react-icons/fi";
import { IoSettingsOutline, IoSendSharp } from "react-icons/io5";
import { BsEmojiSmile, BsImage } from "react-icons/bs";
import { MdOutlineGif } from "react-icons/md";

const BASE_URL = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
const authConfig = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-orange-500", "bg-pink-500", "bg-teal-500",
];
// stable color per user, based on their id
const colorFor = (id = "") => avatarColors[parseInt(id.slice(-2), 16) % avatarColors.length];

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatShort = (iso) => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? formatTime(iso)
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
};

function Avatar({ user, size = "w-12 h-12" }) {
  if (user?.profilePic) {
    // adjust this path to wherever your server serves profile images
    return (
      <img
        src={`${BASE_URL}/${user.profilePic}`}
        alt=""
        className={`${size} rounded-full object-cover`}
      />
    );
  }
  return (
    <div className={`${size} rounded-full ${colorFor(user?._id)} flex items-center justify-center text-white font-semibold text-sm`}>
      {user?.name?.[0]?.toUpperCase() ?? "?"}
    </div>
  );
}

export default function Messages() {
  const qc = useQueryClient();
  const location = useLocation();
  const bottomRef = useRef(null);

  // the open chat's user; can be pre-set from a profile page via navigate state
  const [activeUser, setActiveUser] = useState(location.state?.user ?? null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const activeId = activeUser?._id;

  // ---------- queries ----------
  const { data: convos = [] } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () =>
      (await axios.get(`${BASE_URL}/messages/conversations`, authConfig())).data,
  });

  const { data: messages = [] } = useQuery({
    queryKey: ["thread", activeId],
    enabled: !!activeId,
    queryFn: async () =>
      (await axios.get(`${BASE_URL}/messages/thread/${activeId}`, authConfig())).data,
  });

  // ---------- send ----------
  const sendMutation = useMutation({
    mutationFn: async (text) =>
      (await axios.post(`${BASE_URL}/messages/thread/${activeId}`, { text }, authConfig())).data,
    onSuccess: (msg) => {
      qc.setQueryData(["thread", msg.receiver], (old = []) => [...old, msg]);
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // ---------- live messages ----------
  const activeIdRef = useRef(activeId);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const socket = io(BASE_URL, { auth: { token: localStorage.getItem("token") } });

    socket.on("newMessage", (msg) => {
      if (msg.sender === activeIdRef.current) {
        // thread is open: refetch it (the GET marks it read), then refresh the list
        qc.invalidateQueries({ queryKey: ["thread", msg.sender] }).then(() =>
          qc.invalidateQueries({ queryKey: ["conversations"] })
        );
      } else {
        qc.invalidateQueries({ queryKey: ["conversations"] });
      }
    });

    return () => {
      socket.off("newMessage");
      socket.disconnect();
    };
  }, [qc]);

  // scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, activeId]);

  // ---------- handlers ----------
  const openConvo = (user) => {
    setActiveUser(user);
    qc.setQueryData(["conversations"], (old = []) =>
      old.map((c) => (c.user._id === user._id ? { ...c, unread: 0 } : c))
    );
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !activeId || sendMutation.isPending) return;
    sendMutation.mutate(text);
    setInput("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const q = search.toLowerCase();
  const filteredConvos = convos.filter(
    (c) =>
      c.user.name?.toLowerCase().includes(q) ||
      c.user.userId?.toLowerCase().includes(q)
  );
  const totalUnread = convos.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="flex w-full max-w-[980px] min-h-screen border-x border-gray-800">

      {/* Sidebar */}
      <div className={`flex flex-col border-r border-gray-800 ${activeId ? "hidden md:flex w-[360px]" : "flex w-full md:w-[360px]"} flex-shrink-0`}>

        {/* Header */}
        <div className="sticky top-0 z-10 dark:bg-black/80 bg-white/80 backdrop-blur-sm px-4 py-3.5 border-b border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-black dark:text-white">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-sky-500 text-black dark:text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="text-gray-400 dark:hover:text-white hover:text-black p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <IoSettingsOutline className="text-xl" />
            </button>
            <button className="text-gray-400 dark:hover:text-white hover:text-black p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
              <FiEdit className="text-xl" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-gray-800">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
            <input
              type="text"
              placeholder="Search Direct Messages"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full dark:bg-gray-900 bg-gray-200 rounded-full py-2 pl-10 pr-4 text-sm text-black dark:text-white outline-none border border-transparent focus:border-sky-500 dark:focus:bg-black focus:bg-white transition-colors placeholder-gray-500"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filteredConvos.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-12">No conversations found</p>
          ) : (
            filteredConvos.map((c) => (
              <div
                key={c.user._id}
                onClick={() => openConvo(c.user)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors dark:hover:bg-gray-900 hover:bg-gray-200 border-b border-gray-800/50 ${activeId === c.user._id ? "dark:bg-gray-900 bg-gray-200" : ""}`}
              >
                <div className="flex-shrink-0">
                  <Avatar user={c.user} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold text-black dark:text-white truncate">{c.user.name}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {formatShort(c.lastMessage.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm truncate ${c.unread > 0 ? "text-black dark:text-white font-medium" : "text-gray-500"}`}>
                      {c.lastMessage.text}
                    </p>
                    {c.unread > 0 && (
                      <span className="bg-sky-500 text-black dark:text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      {activeId ? (
        <div className="flex flex-col flex-1 min-w-0">

          {/* Chat header */}
          <div className="sticky top-0 z-10 dark:bg-black/80 bg-white/80 backdrop-blur-sm px-4 py-3 border-b border-gray-800 flex items-center gap-3">
            <button
              onClick={() => setActiveUser(null)}
              className="md:hidden text-gray-400 dark:hover:text-white hover:text-black mr-1"
            >
              ←
            </button>
            <div className="flex-shrink-0">
              <Avatar user={activeUser} size="w-10 h-10" />
            </div>
            <div>
              <p className="font-semibold text-black dark:text-white text-sm">{activeUser.name}</p>
              <p className="text-xs text-gray-500">@{activeUser.userId}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
            {messages.map((msg) => {
              const mine = msg.sender !== activeId;
              return (
                <div key={msg._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                      mine
                        ? "bg-sky-500 text-gray-50 rounded-br-sm"
                        : "bg-gray-800 text-gray-50 rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-xs text-gray-600 px-1">{formatTime(msg.createdAt)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-800 px-4 py-3">
            <div className="flex items-center gap-2 dark:bg-gray-900 bg-gray-200 rounded-2xl px-3 py-2">
              <button className="text-sky-500 hover:text-sky-400 transition-colors p-1" aria-label="Add image">
                <BsImage className="text-lg" />
              </button>
              <button className="text-sky-500 hover:text-sky-400 transition-colors p-1" aria-label="Add GIF">
                <MdOutlineGif className="text-xl" />
              </button>
              <button className="text-sky-500 hover:text-sky-400 transition-colors p-1" aria-label="Add emoji">
                <BsEmojiSmile className="text-lg" />
              </button>
              <input
                type="text"
                placeholder="Start a new message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                maxLength={1000}
                className="flex-1 bg-transparent text-black dark:text-white text-sm outline-none placeholder-gray-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || sendMutation.isPending}
                className={`p-1.5 rounded-full transition-all ${
                  input.trim()
                    ? "text-sky-500 hover:bg-sky-500/10"
                    : "text-gray-600 cursor-not-allowed"
                }`}
                aria-label="Send message"
              >
                <IoSendSharp className="text-lg" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-col flex-1 items-center justify-center text-center px-8">
          <p className="text-3xl font-bold text-black dark:text-white mb-2">Select a message</p>
          <p className="text-gray-500 text-sm max-w-xs">Choose from your existing conversations, or start a new one.</p>
        </div>
      )}
    </div>
  );
}