import React, { useState, useEffect, Fragment } from "react";

import Post from "../../components/Feed/Post/Post";
import Button from "../../components/Button/Button";
import FeedEdit from "../../components/Feed/FeedEdit/FeedEdit";
import Input from "../../components/Form/Input/Input";
import Paginator from "../../components/Paginator/Paginator";
import Loader from "../../components/Loader/Loader";
import ErrorHandler from "../../components/ErrorHandler/ErrorHandler";
import "./Feed.css";

interface FeedPageProps {
  userId: string | null;
  token: string | null;
}

const Feed: React.FC<FeedPageProps> = ({ userId, token }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [editPost, setEditPost] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [postPage, setPostPage] = useState(1);
  const [postsLoading, setPostsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch("URL", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.status !== 200) {
          throw new Error("Failed to fetch user status.");
        }
        const resData = await response.json();
        setStatus(resData.status);
      } catch (err) {
        catchError(
          err instanceof Error ? err : new Error("An unknown error occured.")
        );
      }
    };

    fetchStatus();
    loadPosts();
  }, []);

  const loadPosts = async (direction?: "next" | "previous") => {
    if (direction) {
      setPostsLoading(true);
      setPosts([]);
    }
    let page = postPage;
    if (direction === "next") {
      page++;
      setPostPage(page);
    }
    if (direction === "previous") {
      page--;
      setPostPage(page);
    }

    try {
      const response = await fetch("http://localhost:8080/feed/posts");
      if (response.status !== 200) {
        throw new Error("Failed to fetch posts.");
      }
      const resData = await response.json();
      setPosts(resData.posts);
      setTotalPosts(resData.totalItems);
      setPostsLoading(false);
    } catch (err) {
      catchError(
        err instanceof Error ? err : new Error("An unknown error occured.")
      );
    }
  };

  const statusUpdateHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("URL");
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Can't update status!");
      }
      await response.json();
    } catch (err) {
      catchError(
        err instanceof Error ? err : new Error("An unknown error occured.")
      );
    }
  };

  const newPostHandler = () => {
    setIsEditing(true);
  };

  const startEditPostHandler = (postId: string) => {
    const loadedPost = posts.find((p) => p._id === postId);
    if (loadedPost) {
      setIsEditing(true);
      setEditPost(loadedPost);
    }
  };

  const cancelEditHandler = () => {
    setIsEditing(false);
    setEditPost(null);
  };

  const finishEditHandler = async (postData: any) => {
    setEditLoading(true);
    let url = "http://localhost:8080/feed/post";
    let method = "POST";
    if (editPost) {
      url = "URL";
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: postData.title,
          content: postData.content,
        })
      });
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Creating or editing a post failed!");
      }
      const resData = await response.json();
      // Testing resData
      console.log(resData);
      const post = {
        _id: resData.post._id,
        title: resData.post.title,
        content: resData.post.content,
        creator: resData.post.creator,
        createdAt: resData.post.createdAt,
      };

      setPosts((prevPosts) => {
        const updatedPosts = [...prevPosts];
        if (editPost) {
          const postIndex = prevPosts.findIndex((p) => p._id === editPost._id);
          updatedPosts[postIndex] = post;
        } else if (prevPosts.length < 2) {
          updatedPosts.push(post);
        }
        return updatedPosts;
      });

      setIsEditing(false);
      setEditPost(null);
    } catch (err) {
      console.log(err);
      setIsEditing(false);
      setEditPost(null);
      setEditLoading(false);
      setError(err as Error);
    } finally {
      setEditLoading(false);
    }
  };

  const statusInputChangeHandler = (input: string, value: string) => {
    setStatus(value);
  };

  const deletePostHandler = async (postId: string) => {
    setPostsLoading(true);
    try {
      const response = await fetch("URL");
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Deleting a post failed!");
      }
      await response.json();
      setPosts((prevPosts) => prevPosts.filter((p) => p._id !== postId));
    } catch (err) {
      console.log(err);
      catchError(
        err instanceof Error ? err : new Error("An unknown error occurred.")
      );
    } finally {
      setPostsLoading(false);
    }
  };

  const errorHandler = () => {
    setError(null);
  };

  const catchError = (error: Error) => {
    setError(error);
  };

  return (
    <Fragment>
      <ErrorHandler error={error} onHandle={errorHandler} />
      <FeedEdit
        editing={isEditing}
        selectedPost={editPost}
        loading={editLoading}
        onCancelEdit={cancelEditHandler}
        onFinishEdit={finishEditHandler}
      />
      <section className="feed__status">
        <form onSubmit={statusUpdateHandler}>
          <Input
            type="text"
            placeholder="Your status"
            control="input"
            onChange={statusInputChangeHandler}
            value={status}
          />
          <Button mode="flat" type="submit">
            Update
          </Button>
        </form>
      </section>
      <section className="feed__control">
        <Button mode="raised" design="accent" onClick={newPostHandler}>
          New Post
        </Button>
      </section>
      <section className="feed">
        {postsLoading && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Loader />
          </div>
        )}
        {posts.length <= 0 && !postsLoading && (
          <p style={{ textAlign: "center" }}>No posts found.</p>
        )}
        {!postsLoading && (
          <Paginator
            onPrevious={() => loadPosts("previous")}
            onNext={() => loadPosts("next")}
            lastPage={Math.ceil(totalPosts / 2)}
            currentPage={postPage}
          >
            {posts.map((post) => (
              <Post
                key={post._id}
                id={post._id}
                author={post.creator.name}
                date={new Date(post.createdAt).toLocaleDateString("en-US")}
                title={post.title}
                image={post.imageUrl}
                content={post.content}
                onStartEdit={() => startEditPostHandler(post._id)}
                onDelete={() => deletePostHandler(post._id)}
              />
            ))}
          </Paginator>
        )}
      </section>
    </Fragment>
  );
};

export default Feed;
