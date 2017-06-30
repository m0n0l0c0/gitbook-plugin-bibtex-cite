'use strict'

const bibtexParse = require('bibtex-parser-js')
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

      const upperKey = key.toUpperCase()
      const citation = find(this.config.get('bib'), {'citationKey': upperKey})

      const path = this.config.get('pluginsConfig')['bibtex-indexed-cite'].path            

      if (citation !== undefined) {

        var index = currBib.indexOf(upperKey)
        if (index === -1) {
          currBib.push(upperKey)
          index = currBib.length
        }else{
          index++
        }

        // This path should probably not be here
        ret = `<a href="${path}References.html#cite-${index}">[${index}]</a>`
      }
      return ret
    }
  },
  hooks: {
    init: function() {
      const bib = fs.readFileSync('literature.bib', 'utf8')
      this.config.set('bib', bibtexParse.toJSON(bib))
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

          const item = find(bib, { citationKey: cite })
          const index = idx + 1

          result += `<tr><td><span class="citation-number" id="cite-${index}">${index}</span></td><td>`

          if (item.entryTags.AUTHOR) {
            result += formatAuthors(item.entryTags.AUTHOR) + ', '
          }
          if (item.entryTags.TITLE) {
            if (item.entryTags.URL) {
              result += `<a href="${item.entryTags.URL}">${item.entryTags.TITLE}</a>, `
            } else {
              result += item.entryTags.TITLE + ', '
            }
          }
          if (item.entryTags.BOOKTITLE) {
            if (item.entryTags.BOOKURL) {
              result += `<a href="${item.entryTags.BOOKURL}">${item.entryTags.BOOKTITLE}</a>, `
            } else {
              result += `<i>${item.entryTags.BOOKTITLE}</i>, `
            }
          }
          if (item.entryTags.PUBLISHER) {
            result += `<i>${item.entryTags.PUBLISHER}</i>, `
          }
          if (item.entryTags.YEAR) {
            result += item.entryTags.YEAR + '.'
          }

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
