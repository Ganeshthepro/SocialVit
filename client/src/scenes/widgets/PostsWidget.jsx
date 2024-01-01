import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts } from '../../state'
import PostWidget from './PostWidget'
import React from 'react'

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts)
  const token = useSelector((state) => state.token)
  const [loading, setLoading] = React.useState(true)

  const getPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/post', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }))
    } catch (error) {
      console.error('Error fetching posts:', error.message)
    }
  }

  const getUserPosts = async () => {
    try {
      const response = await fetch(`http://localhost:3001/post/${userId}/post`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user posts')
      }

      const data = await response.json()
      dispatch(setPosts({ posts: Array.isArray(data) ? data : [] }))
    } catch (error) {
      console.error('Error fetching user posts:', error.message)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        if (isProfile) {
          await getUserPosts()
        } else {
          await getPosts()
        }

        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error.message)
        setLoading(false)
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfile])

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  )
}

export default PostsWidget
