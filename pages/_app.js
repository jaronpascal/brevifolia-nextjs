import React from 'react'
import App from 'next/app'
import Layout from '../components/Layout'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <Layout>
        <Component {...pageProps} />
      </Layout>
    )
  }
}

export default MyApp

export async function getStaticProps({ ...ctx }) {
  const { travel } = ctx.params
  console.log(`../posts/${travel}`)
  const siteConfig = await import(`../data/config.json`)
  //get posts & context from folder
  const posts = ((context) => {
    let keys = context.keys()
    const values = keys.map(context)
    const data = keys.map((key, index) => {
      // Create slug from filename
      const slug = key
        .replace(/^.*[\\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')
      const travel = key.split('/')[1].replace(/ /g, '-').trim()
      const value = values[index]
      // Parse yaml metadata & markdownbody in document
      const document = matter(value.default)
      return {
        frontmatter: document.data,
        markdownBody: document.content,
        slug,
        travel,
      }
    })
    return data
  })(require.context('../posts/', true, /\.md$/))

  const travels = readdirSync('./posts')

  console.log(travel)
  console.log(travels)

  return {
    props: {
      allBlogs: posts,
      title: siteConfig.default.title,
      description: siteConfig.default.description,
      travels,
      currentTravel: travel,
    },
  }
}
