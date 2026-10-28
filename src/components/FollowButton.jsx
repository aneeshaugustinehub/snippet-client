import { useUser } from "./UserContext";

export default function FollowButton({ id }) {
  const { user, onClickFollow } = useUser();

  const following = !!user?.following?.some((f) => f.toString() === id);
  const handleFollow = () => {
    if (!user) {
      return;
    } else {
      onClickFollow(id);
    }
  };
  return (
    <button
      onClick={handleFollow}
      className={`rounded-full px-4 py-1.5 text-sm font-semibold flex-shrink-0 transition-colors ${
        following
          ? "border border-gray-600 text-black dark:text-white hover:border-red-500 hover:text-red-500"
          : "color-btn"
      }`}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
