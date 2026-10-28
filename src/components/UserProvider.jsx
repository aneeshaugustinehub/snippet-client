import { UserContext } from "./UserContext";
import axios from "axios";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

export const UserProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const USER_URL = BASE_URL + "users/";
  const USER_ID_URL = BASE_URL + "users/id/";

  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading: usersIsLoading,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(USER_URL);
      return res.data;
    },
    retry: false,
  });
  const token = localStorage.getItem("token");
  const {
    data: user,
    isLoading: userIsLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    enabled: !!token,

    queryFn: async () => {
      try {
        const res = await axios.get(USER_URL + "getMe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return res.data.user;
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token"); // expired or invalid token
        }
        throw err;
      }
    },
  });

  const GetUserByUsername = (username) => {
    return useQuery({
      queryKey: ["userByUsername", username],
      queryFn: async () => {
        const res = await axios.get(USER_URL + username);
        return res.data;
      },
    });
  };

  const GetUserById = (id) => {
    // console.log(id);

    return useQuery({
      queryKey: ["GetUserById", id],
      queryFn: async () => {
        const res = await axios.get(USER_ID_URL + id);
        return res.data;
      },
    });
  };

  const EditUserProfile = async (
    userId,
    name,
    bio,
    location,
    website,
    dob,
    profilePic,
    bannerPic,
  ) => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("name", name);
    formData.append("bio", bio ?? "");
    formData.append("location", location ?? "");
    formData.append("website", website ?? "");
    formData.append("dob", dob);

    if (profilePic) formData.append("profilePic", profilePic);
    if (bannerPic) formData.append("bannerPic", bannerPic);
    console.log(bannerPic, profilePic);

    try {
      await axios.put(USER_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      if (error.code === 409) {
        let userExcited = true;
        return userExcited;
      }
      console.error("EditUserProfile error", error.code);
    }
  };

  const Signup = async (email, name, userId, password, birthday) => {
    console.log("sign up start");

    if (!email.trim() || !name || !userId || !password || !birthday) return;
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    try {
      const res = await axios.post(USER_URL + "register", {
        email: email,
        name: name,
        userId: userId,
        password: password,
        dob: birthday,
        withCredentials: true,
      });
      console.log("Signup", res.data.token);
      localStorage.setItem("token", res.data.token);
      queryClient.setQueryData(["user"], res.data.user);
      return res.data;
    } catch (error) {
      if (error) {
        console.log(error.message, "signup error");

        return "signup error";
      }
    }
  };

  const Login = async (userId, password) => {
    try {
      const res = await axios.post(USER_URL + "login", { userId, password });
      console.log("login", res.data.token);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error); // shows the real cause
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    // setUser(null);
  };

  const { mutate: AddBookmark } = useMutation({
    mutationFn: async ({ postId }) => {
      await axios.put(
        USER_URL + "bookmark/",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const { mutate: onClickFollow } = useMutation({
    mutationFn: async (Id) => {
      await axios.put(
        USER_URL + "follow/",
        { Id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({
        queryKey: ["userByUsername"],
      });
    },
  });

  return (
    <UserContext.Provider
      value={{
        users,
        usersError,
        usersIsLoading,
        user,
        userError,
        userIsLoading,
        Login,
        logout,
        Signup,
        AddBookmark,
        EditUserProfile,
        GetUserById,
        onClickFollow,
        GetUserByUsername,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// useEffect(() => {
//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get(USER_URL);
//       setUsers(res.data);
//     } catch (error) {
//     }
//   };
//   fetchUsers();
// }, [USER_URL]);

// useEffect(() => {
//   const fetchUser = async () => {
//     try {
//       const localUser = JSON.parse(localStorage.getItem("user"));
//       if (localUser) {
//         const res = await axios.get(USER_URL + localUser.userId);
//         setUser(res.data);
//       }
//     } catch (error) {
//     }
//   };
//   fetchUser();
// }, [USER_URL]);

// const GetUserById = async (id) => {
//   try {
//     if (id) {
//       const res = await axios.get(USER_ID_URL + id);
//       return (res.data);
//     }
//   } catch (error) {
//   }
// };

//   const { mutate: CreatePost } = useMutation({
//   mutationFn: async ({ Description, postImage }) => {
//     const formData = new FormData();
//     formData.append("Description", Description);
//     formData.append("postImage", postImage);
//     await axios.post(POST_URL + user._id, formData);
//   },
//   onSuccess: () => {
//     queryClient.invalidateQueries({
//       queryKey: ["posts"],
//     });
//   },
// });
