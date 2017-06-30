Bibtex Citations Gitbook Plugin
==============

### Install

Add this to your `book.json`, then run `gitbook install`:

```
{
    "plugins": ["bibtex-indexed-cite"]
}
```

### Usage

The plugin expects a path parameter in your book.json, defaults to `literature.bib` file in your root folder. You can use the bibtex keys defined within the file to reference the literature.

Your references can also include a `URL` key which whill be used on the title of an article. For instance, your `literature.bib` file could look like this:

```
@misc{ROC,
  TITLE = {The Rights of Christ according to the principles and doctrines of the Children of Peace},
  AUTHOR = {Willson, David},
  YEAR = {1815},
  URL = {https://archive.org/details/cihm_62453}
}

@misc{TLW,
  TITLE = {The Late War between the United States and Great Britain},
  AUTHOR = {Hunt, Gilbert J.},
  YEAR = {1816},
  URL = {https://github.com/wordtreefoundation/books/blob/master/pseudo_biblical/The%20Late%20War%20-%20Gilbert%20Hunt%20-%201816.md}
}
```

Then, when you want to cite the reference to `The Late War` in the bib file, use the following in the content of a page:

```
{{ "TLW" | cite }}
```

You can also add a table of references with:

```
{% references %} {% endreferences %}
```

The table of references should be included in a file called References.md

If you name the file anything other than References.md, it will break the links from the individual citations to this references page (currently, each citation will link to References.html#cite- plus the index of that citation)

**Only used literature is included in the table of references** (really). They are ordered by the usage within the text.

### Limitations

The plugin currently only supports IEEE referencing style.
Feel free to submit pull requests to add additional styles.

