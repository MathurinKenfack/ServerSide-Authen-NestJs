export const captitaliseWord = function (word: string) {
  var firstLetter = word.charAt(0).toUpperCase();
  return firstLetter + word.slice(1);
};
