'use strict'

const parse = require('bib2json')
const fs = require('fs')

let currBib = []

module.exports = {
  book: {
    assets: './assets',
    css: ["style.css"]
  },
  filters: {
    cite: function(key) {

      let ret = "[Citation not found]"

      const citation = find(this.config.get('bib'), {'EntryKey': key})

      if (citation !== undefined) {

        var index = currBib.indexOf(key)
        if (index === -1) {
          currBib.push(key)
          index = currBib.length
        }else{
          index++
        }

        ret = `<a href="References.html#cite-${index}">[${index}]</a>`
      }
      return ret
    }
  },
  hooks: {
    init: function() {
      const path = this.config.get('pluginsConfig')['citation-bibtex'].path || './literature.bib'
      const bib = fs.readFileSync(path, 'utf8')
      this.config.set('bib', parse(bib).entries)
      currBib = []
    }
  },
  blocks: {
    references: {
      process: function(blk) {

        if (!currBib.length) {
          return
        }

        const bib = this.config.get('bib')
        let result = '<table class="references">'

        currBib.forEach(function(cite, idx) {

          const item = find(bib, { EntryKey: cite }).Fields
          const index = idx + 1
          const fields = []

          result += `<tr><td><span class="citation-number" id="cite-${index}">${index}</span></td><td>`

          if (item.author) {
            fields.push(formatAuthors(item.author))
          }
          if (item.title) {
            if (item.url) {
              fields.push(`<a href="${item.url}">${item.title}</a>`)
            } else {
              fields.push(item.title)
            }
          }
          if (item.publisher) {
            fields.push(`<i>${item.publisher}</i>`)
          }
          if (item.year) {
            fields.push(item.year)
          }

          result += fields.join(', ') + '.'
          result += '</td></tr>'
        })

        result += '</table>'

        return result
      }
    }
  }
}

function find (arr, search) {
  let i = 0;
  const key = Object.keys(search)[0]
  for(; i < arr.length && arr[i][key] !== search[key]; i++);
  return i === arr.length ? undefined : arr[i]
}

function formatAuthors (authorsString) {
  const authors = authorsString.split('and')

  if (authors.length > 3) {
    return authors[0] + ' <i>et al.</i>'
  } else {
    return authorsString
  }
}
