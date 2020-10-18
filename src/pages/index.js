import React from 'react'
import Helmet from 'react-helmet'
import Layout from '../layouts/Default'
import SEO from '../components/SEO/SEO'
import Grid from '../fragments/Grid'
import data from '../../data/faces.json'
import { paramsParse } from 'analytics-utils'
import styles from './Faces.css'

const tags = data.reduce((acc, curr) => {
  if (curr.tags) {
    acc = acc.concat(curr.tags)
  }
  return acc
}, [])
const uniqueTags = new Set(tags)

export default class Index extends React.Component {
  constructor (props, context) {
    super(props, context)
    const params = paramsParse()
    const search = (!params.search || params.search === true) ? '' : params.search

    this.state = {
      tag: search
    }
  }
  changeTag = (e) => {
    this.setState({
      tag: e.target.innerText
    })
  }
  renderTags = () => {
    const { tag } = this.state
    return ['all'].concat(Array.from(uniqueTags)).map((name, i) => {
      let classes = styles.tag
      if ((!tag && name === 'all') || tag === name) {
        classes = `${styles.current} ${styles.tag}`
      }
      return (
        <span key={i} className={classes} onClick={this.changeTag}>
          {name}
        </span>
      )
    })
  }
  renderSidebar = () => {
    return (
      <div>
        <div className={styles.tagWrapper}>
          <h3>Browse by tag</h3>
          <div className={styles.tags}>
            { this.renderTags() }
          </div>
        </div>
      </div>
    )
  }
  render() {
    const { tag } = this.state
    const theTag = (tag !== 'all') ? tag : ''
    return (
      <Layout sidebar={this.renderSidebar()}>
        <div className={styles.wrapper}>
          <Helmet title={'The Faces of Primer'} />
          <SEO />
          <div className={styles.content}>
            <div style={{ paddingBottom: 300 }}>
              <Grid
                data={data}
                tag={theTag}
                title={(count) => {
                  let countRender
                  if (count) {
                    countRender = (
                      <span className={styles.count}>
                        ({ count })
                      </span>
                    )
                  }
                  return (
                    <div className={styles.title}>
                      <h1>
                        The Faces of Primer
                        {countRender}
                      </h1>
                      <div className={styles.actions}>
                        {/* <Button to='/add-example' onClick={() => analytics.track('exampleAdditionStarted') }>
                          {'Add a function example'}
                        </Button> */}
                      </div>
                    </div>
                  )
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}


// import React from 'react'
// import Helmet from 'react-helmet'
// import { graphql } from 'gatsby'
// import Layout from '../layouts/Default'
// import PostListing from '../components/PostListing/PostListing'
// import SEO from '../components/SEO/SEO'
// import Grid from '../fragments/Grid'
// import config from '../../_site-config'
// import styles from './Home.css'

// export default class Index extends React.Component {
//   render() {
//     const postEdges = this.props.data.allMarkdownRemark.edges
//     return (
//       <Layout>
//         <div className={styles.wrapper}>
//           <Helmet title={config.siteTitle} />
//           <SEO />
//           <div className={styles.content}>
//             <h1>Netlify Functions</h1>
//             <h2>{`//`}&nbsp;&nbsp;{`the problem`}</h2>
//             <p>
//               When you build and deploy sites on netlify, you can interact with third-party services and APIs with javascript places directly in your site. For example, you can have a script that sends event data to google analytics, or adds someone to a mailchimp list, or sends a request to a zapier webhook.
//             </p>
//             <p>
//               But what if you want to write scripts with something other than javascript? Or if you want to do more complex things like resize images or query a database? Or if you have sensitive information in your script such as API tokens that you don’t want embedded on your site and visible to all? Or if there is no service or API that does what you need?
//             </p>
//             <p>
//               <strong>That’s where Netlify Functions come in.</strong>
//             </p>
//             <h2>{`//`}&nbsp;&nbsp;{`what is it?`}</h2>
//             <p>
//               Functions are scripts that you write and deploy with Netlify. The function’s code is hidden from the public, but you can interact with it just like any other API service. Just as with your site code, Netlify takes care of deploying your scripts into functions.
//             </p>
//             <h2>{`//`}&nbsp;&nbsp;{`who’s it useful for?`}</h2>
//             <p>
//               This is useful for developers who want to add more functionality to their sites and don’t want to or can’t rely entirely on third-party APIs, or want to use a language other than JavaScript, or don’t want to expose their scripts to site visitors.
//             </p>
//             <h2>{`//`}&nbsp;&nbsp;{`why use it?`}</h2>
//             <p>
//               Despite all the benefits of serverless sites, there were many things you couldn’t do with just client-side JavaScript:
//             </p>
//             <ul>
//               <li>
//               Interact with protected APIs such as databases or payment processing services, because the secret API keys would be exposed to the world.
//               </li>
//               <li>
//               Run large workloads such as image handling or searching large amounts of data they would take too long to run in the browser.
//               </li>
//             </ul>
//             <p>
//               You would want to use Functions if you want to deploy scripts that can be run on-demand and return results just like an API, that run on high-powered servers for low latency, that can be written in Go or JavaScript, and that keeps the underlying code (and any secrets inside) hidden from the world.
//             </p>
//           </div>
//         </div>
//       </Layout>
//     )
//   }
// }

// export const pageQuery = graphql`
//   query IndexQuery {
//     allMarkdownRemark(
//       limit: 2000
//       sort: { fields: [fields___date], order: DESC }
//     ) {
//       edges {
//         node {
//           fields {
//             slug
//             date
//           }
//           excerpt
//           timeToRead
//           frontmatter {
//             title
//             tags
//             cover
//             date
//           }
//         }
//       }
//     }
//   }
// `
