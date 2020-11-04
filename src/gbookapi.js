const fetch = require("node-fetch");
const searchUrl = (keywords, maxResults = 10) => {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  const params = {
    q: keywords,
    startIndex: 0,
    maxResults,
  };
  url.search = new URLSearchParams(params).toString();
  return url.href;
};

const searchBooks = async (keywords, maxResults) => {
  try {
    const res = await fetch(searchUrl(keywords, maxResults));
    const json = await res.json();
    return reorganizeResults(json);
  } catch (err) {
    console.log(err);
    returnerr;
  }
};

const reorganizeResults = (json) => {
  let { totalItems, items } = json;
  // restructuring items properties
  items = items.map((item) => {
    const { id, volumeInfo } = { ...item };
    const {
      title,
      subtitle,
      authors,
      publisher,
      publishedDate,
      description,
      pageCount,
      maturityRating,
      imageLinks,
      averageRating,
      ratingsCount,
    } = { ...volumeInfo };
    const { smallThumbnail, thumbnail } = { ...imageLinks };
    return {
      gbook_id: id,
      title,
      subtitle,
      authors,
      publisher,
      published_date: publishedDate,
      description,
      page_count: pageCount,
      maturity_rating: maturityRating,
      small_thumbnail: smallThumbnail,
      thumbnail,
      average_rating: averageRating,
      ratings_count: ratingsCount,
    };
  });
  return { totalItems, items };
};

module.exports = searchBooks;
