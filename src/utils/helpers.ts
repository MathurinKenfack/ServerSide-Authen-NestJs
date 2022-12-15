export const capitalizeWord = function (word: string) {
	const firstLetter = word.charAt(0).toUpperCase();

	return firstLetter + word.slice(1);
};
