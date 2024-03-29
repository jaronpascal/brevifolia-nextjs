import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import React, { useEffect, useState, useRef } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

const BlogList = (props) => {
  const { allBlogs, travel } = props

  const blogsToViewCalculator = (numberOfPages) => {
    let size = 5 * numberOfPages
    if (size >= allBlogs.length) {
      size = allBlogs.length
    }
    return allBlogs.slice(0, size)
  }
  const [page, setPage] = useState(1)
  const [postList, setPostList] = useState(blogsToViewCalculator(1))

  const loader = useRef(null)

  useEffect(() => {
    setPostList(blogsToViewCalculator(1))
  }, [props])

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    }
    // initialize IntersectionObserver
    // and attaching to Load More div
    const observer = new IntersectionObserver(handleObserver, options)
    if (loader.current) {
      observer.observe(loader.current)
    }
  }, [])

  useEffect(() => {
    setPostList(blogsToViewCalculator(page))
  }, [page])

  const handleObserver = (entities) => {
    console.log('JA')
    const target = entities[0]

    if (target.isIntersecting) {
      setPage((page) => page + 1)
      console.log(target)
    }
  }

  function truncateSummary(content) {
    return content.slice(0, 200).trimEnd()
  }

  function reformatDate(fullDate) {
    const date = new Date(fullDate)
    return date.toDateString().slice(4)
  }

  return (
    <>
      <p>{travel}</p>
      <ul className="list">
        {postList.length >= 1 &&
          postList.map((post) => (
            <Link
              key={post.slug}
              href={{ pathname: `/${post.travel}/${post.slug}` }}
            >
              <a>
                <li>
                  <div className="hero_image">
                    <img
                      src={post.frontmatter.hero_image}
                      alt={post.frontmatter.hero_image}
                    />
                  </div>
                  <div className="blog__info">
                    <h2>{post.frontmatter.title}</h2>
                    <h3>
                      {post.travel}
                      {' - '}
                      {reformatDate(post.frontmatter.date)}
                    </h3>
                    <p>
                      <ReactMarkdown
                        source={truncateSummary(post.markdownBody)}
                      />
                    </p>
                  </div>
                </li>
              </a>
            </Link>
          ))}
      </ul>
      <div
        className={
          postList.length === allBlogs.length ? 'hide loading' : 'loading'
        }
        ref={loader}
      >
        <CircularProgress />
      </div>
      <style jsx>
        {`
          margin-bottom: 0;
          a:hover {
            opacity: 1;
          }
          a:hover li div.hero_image img {
            opacity: 0.8;
            transition: opacity 0.3s ease;
          }
          a:hover li .blog__info h2,
          a:hover li .blog__info h3,
          a:hover li .blog__info p {
            transform: translateX(10px);
            transition: transform 0.5s ease-out;
          }
          .loading {
            height: 70px;
            text-align: center;
            padding: 15px;
          }
          .hide {
            display: none;
          }
          .hero_image {
            width: 100%;
            height: 33vh;
            overflow: hidden;
            background-color: #000;
          }
          .hero_image img {
            object-fit: cover;
            object-position: 50% 50%;
            opacity: 1;
            transition: opacity 0.3s ease;
            min-height: 100%;
          }
          .blog__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem 1.25rem;
            transform: translateX(0px);
            transition: transform 0.3s ease-in;
            border-bottom: 1px solid #ebebeb;
          }
          .blog__info h2,
          .blog__info h3,
          .blog__info p {
            transform: translateX(0px);
            transition: transform 0.5s ease-out;
          }
          li {
            opacity: inherit;
            display: flex;
            justify-content: center;
            flex-direction: column;
            min-height: 38vh;
            margin-bottom: 0;
          }
          h2 {
            margin-bottom: 0.5rem;
          }
          h3 {
            margin-bottom: 1rem;
          }
          p {
            max-width: 900px;
          }
          @media (min-width: 768px) {
            li {
              min-height: 250px;
              height: 33.333vh;
              flex-direction: row;
            }
            .hero_image {
              height: 100%;
            }
            .hero_image img {
              min-width: 100%;
              height: 100%;
              width: auto;
              min-height: 0;
            }
            .blog__info {
              min-width: 70%;
            }
          }
          @media (min-width: 1280px) {
            .blog__info {
              padding: 3rem;
            }
            h3 {
              margin-bottom: 1.2rem;
            }
          }
        `}
      </style>
    </>
  )
}

export default BlogList
