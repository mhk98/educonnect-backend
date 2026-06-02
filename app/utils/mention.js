const extractMentions = (text = "") => {
  // matches @Rahim, @john_doe
  const regex = /@([a-zA-Z0-9_]+)/g;
  const matches = [...text.matchAll(regex)];
  return [...new Set(matches.map((m) => m[1]))]; // unique names
};

module.exports = {
  extractMentions,
};
