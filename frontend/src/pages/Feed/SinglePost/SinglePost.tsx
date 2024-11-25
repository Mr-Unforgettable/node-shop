import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Image from '../../../components/Image/Image';
import './SinglePost.css';

interface SinglePostPageProps {
  userId: string | null;
  token: string | null;
}

const SinglePost: React.FC<SinglePostPageProps> = ({ userId, token }) => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:8080/feed/post/${postId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch post');
        }
        
        const resData = await response.json();
        setPost(resData.post);
        console.log(resData.post);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, [postId, token]);

  if (!post) {
    return <p>Loading...</p>
  }

  return (
    <section className="single-post-page">
      <h1>{post.title}</h1>
      <h2>Created by {post.creator.name} on {new Date(post.createdAt).toLocaleDateString('en-US')}</h2>
      <div className="single-post-page__image">
        <Image contain imageUrl={`http://localhost:8080/${post.imageUrl}`} />
      </div>
      <p>{post.content}</p>
    </section>
  );
};

export default SinglePost;
