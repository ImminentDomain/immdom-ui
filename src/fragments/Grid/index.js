import React from 'react'
import SearchBox from '../../components/SearchBox'
import Card from '../../components/Card'
import styles from './Grid.css'
import debounce from 'lodash.debounce'
import analytics from '../../analytics'

const searchInputId = 'example-search'

function updateQueryStringParam(key, value) {
  if (typeof window === 'undefined') {
    return
  }
  const { location, history } = window
  const { search, protocol, host, pathname } = location
  const baseUrl = `${protocol}//${host}${pathname}`

  const newParam = `${key}=${value}`

  var params = '?' + newParam
  // If the "search" string exists, then build params from it
  if (search) {
    var updateRegex = new RegExp(`([\?&])${key}[^&]*`)

    if (typeof value === 'undefined' || value == null || value === '') {
      const removeRegex = new RegExp(`([\?&])${key}=[^&;]+[&;]?`)
      params = search.replace(removeRegex, '$1')
      params = params.replace(/[&;]$/, '')
    } else if (search.match(updateRegex) !== null) {
      // If param exists already, update it
      params = search.replace(updateRegex, '$1' + newParam)
    } else {
      // Otherwise, add it to end of query string
      params = search + '&' + newParam
    }
  }

  // no parameter was set so we don't need the question mark
  params = params == '?' ? '' : params

  history.replaceState({}, '', baseUrl + params)
}

export default class Grid extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      filterText: props.tag
    }
    this.handleKeyDown = debounce(this.trackSearch, 1500)
  }
  handleFilterInput = e => {
    this.setState({
      filterText: e.target.value
    })
  }
  trackSearch = (e) => {
    const { filterText } = this.state
    if (filterText) {
      analytics.track('functionsSearched', {
        query: filterText
      })
    }
  }
  setSearch = (value) => {
    this.setState({
      filterText: value
    })
    document.getElementById(searchInputId).value = value
    if (value) {
      updateQueryStringParam('search', value)
    }
  }
  componentDidMount() {
    if (this.props.tag) {
      setTimeout(() => {
        // Clear search
        this.setSearch('')
        // then reset it. Fixes incorrect link issue https://bit.ly/2LtERiT
        this.setSearch(this.props.tag)
      }, 0)
    }
  }
  componentDidUpdate (prevProps, prevState) {
    if (prevProps.tag !== this.props.tag) {
      this.setSearch(this.props.tag)
    }
    // Update the search query on typing
    if (this.state.filterText) {
      updateQueryStringParam('search', this.state.filterText)
    } else if (!this.state.filterText && window.location.search) {
      updateQueryStringParam('search')
    }
  }
  handleChange = () => {
    if (this.props.onChange) {
      this.props.onChange()
    }
  }
  renderTags(tags) {
    return (
      <div className={styles.itemTags}>
        {tags.join(', ')}
      </div>
    )
  }
  defaultTitle = (matchCount) => {
    const { title } = this.props
    if (title && typeof title === 'string') {
      let count
      if (matchCount) {
        count = (
          <span className={styles.count}>
            ({matchCount})
          </span>
        )
      }
      return (
        <div className={styles.gridTitle}>
          <h1>
            {title}
            {count}
          </h1>
        </div>
      )
    }
  }
  render() {
    const { data, title } = this.props
    const search = this.state.filterText
    let renderExamples = data.filter(example => {
      // No search query. Show all
      if (!search) {
        return true
      }

      const { name, description, tags } = example
      if (
        matchText(search, name) ||
        matchText(search, description) ||
        matchTags(search, tags)
      ) {
        return true
      }
      // no match!
      return false
    }).map((example, i) => {
      // get first link
      let codeLink = (Array.isArray(example.code)) ? example.code[0] : example.code
      if (!codeLink) {
        codeLink = example.url;
      }
      return (
        <Card key={i} className={styles.item}>
          <div className={styles.itemTitle}>
            <a href={codeLink} target='_blank' rel='noopener noreferrer'>
              {example.name}
            </a>
          </div>
          {/* <div className={styles.itemImage}>
            <img src={`/images/${example.image}`} alt="profile image" height="300" object-fit = "contain;" />
          </div> */}
          <div className={styles.itemDescription}>
            {example.description}
          </div>
          {example.tags && this.renderTags(example.tags)}
        </Card>
      )
    })

    if (!renderExamples.length) {
      renderExamples = (
        <div className={styles.noResults}>
          <h3>
            No "{search}" examples found. Clear your search and try again.
          </h3>
          <div>
            Checkout some popular queries:
            <ul>
              <li onClick={() => { this.setSearch('graphql') }}>graphql</li>
              <li onClick={() => { this.setSearch('database') }}>databases</li>
              <li onClick={() => { this.setSearch('auth') }}>authenication</li>
              <li onClick={() => { this.setSearch('ecommerce') }}>ecommerce</li>
              <li onClick={() => { this.setSearch('email') }}>email</li>
            </ul>
          </div>
        </div>
      )
    }

    const titleRender = (typeof title === 'string')
      ? this.defaultTitle(renderExamples.length)
      : title(renderExamples.length)

    return (
      <div style={{ marginBottom: 60 }}>
        {titleRender}
        <div className={styles.gridWrapper}>
          <div className={styles.gridContent}>
            <div style={{ marginBottom: 10 }}>
              <SearchBox
                id={searchInputId}
                placeholder='Search for functions'
                onChange={this.handleFilterInput}
                onKeyDown={this.handleKeyDown}
              />
            </div>
            <div className={styles.grid}>
              {renderExamples}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function matchText(search, text) {
  if (!text || !search) {
    return false
  }
  return text.toLowerCase().indexOf(search.toLowerCase()) > -1
}

function matchTags(search, tags) {
  if (!tags || !search) {
    return false
  }
  return tags.some((tag) => {
    return tag.toLowerCase().indexOf(search.toLowerCase()) > -1
  })
}
