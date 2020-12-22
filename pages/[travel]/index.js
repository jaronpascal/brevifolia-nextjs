import matter from 'gray-matter'
import Layout from '../../components/Layout'
import BlogList from '../../components/BlogList'
const { readdirSync } = require('fs')

const glob = require('glob')

const Index = props => {
  const allBlogs = props.allBlogs.filter(blog => blog.travel === props.currentTravel)
  return (
      <Layout
        pathname="/"
        siteTitle={props.title}
        siteDescription={props.description}
        travels={props.travels}
      >
        <section>
          <BlogList allBlogs={allBlogs} travel={props.currentTravel} />
        </section>
      </Layout>
    )
}

export default Index

export async function getStaticProps({ ...ctx }) {
  const { travel } = ctx.params
  console.log(`../../posts/${travel}`)
  const siteConfig = await import(`../../data/config.json`)
  //get posts & context from folder
  const posts = (context => {
    let keys = context.keys()
    const values = keys.map(context)
    const data = keys.map((key, index) => {
      // Create slug from filename
      const slug = key
        .replace(/^.*[\\\/]/, '')
        .split('.')
        .slice(0, -1)
        .join('.')
      const travel = key
        .split('/')[1]
        .replace(/ /g, '-')
        .trim()
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
  })(require.context('../../posts/', true, /\.md$/))

  const travels = readdirSync("./posts");

  console.log(travel);

  return {
    props: {
      allBlogs: posts,
      title: siteConfig.default.title,
      description: siteConfig.default.description,
      travels,
      currentTravel: travel
    },
  }
}

export async function getStaticPaths() {
  //get all .md files in the posts dir
  const blogs = glob.sync('posts/*')

  //remove path and extension to leave filename only
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[1]
      .replace(/ /g, '-')
      .trim()
  )

  // create paths with `slug` param
  const paths = blogSlugs.map(slug => `/${slug}`)
  return {
    paths,
    fallback: false,
  }
}
