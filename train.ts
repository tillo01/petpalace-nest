// ZU-TASK:

// Shunday function yozing, u parametridagi array ichida takrorlanmagan raqamlar yig'indisini qaytarsin.
// MASALAN: sumOfUnique([1,2,3,2]) return 4

// function getUniqueArr(arr: number[]) {
// 	const getArr = Array.from(new Set(arr));
// 	const result = getArr.reduce((total) => {
// 		return total + total;
// 	});
// 	return result;
// }
// console.log(getUniqueArr([1, 2, 3, 4, 4, 2]));

// ZS-TASK:

// Shunday function yozing, u parametridagi arrayni ichidagi 1 marta kelgan elemnetni qaytarsin.
// MASALAN: singleNumber([4, 2, 1, 2, 1]) return 4

// function getSingleNum(arr: any[]): number {
// 	const result = arr.sort((a, b) => arr.filter((x) => x === b).length - arr.filter((x) => x === a).length).pop();
// 	return result;
// }
// console.log(getSingleNum([1, 2, 3, 2, 3, 4, 5, 4, 5]));

// ZR-TASK:

// Shunday function yozing, u parametridagi string ichidagi raqam va sonlarni sonini sanasin.
// MASALAN: countNumberAndLetters(“string152%\¥”) return {number:3, letter:6}

// function countNumandLet(str: any) {
// 	let result = { letter: 0, number: 0 };
// 	for (let char of str) {
// 		if (/[0-9]/.test(char)) {
// 			result.number++;
// 		} else if (/[a-zA-Z]/.test(char)) {
// 			result.letter++;
// 		}
// 	}
// 	return result;
// }

// console.log(countNumandLet('str123'));

// ZN-TASK:

// Shunday function yozing, uni array va number parametri bolsin. Ikkinchi parametrda berilgan raqamli indexgacha arrayni orqasiga ogirib qaytarsin.
// MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3) return [5, 6, 1, 2, 3, 4]

// function getRotArr(arr, index) {
// 	const res1 = arr.slice(0, index);
// 	const res2 = arr.slice(index);
// 	return res2.concat(res1);
// }

// console.log(getRotArr([1, 2, 3, 4, 5, 6], 3));

// ZM-TASK:

// Shunday function yozing, u function parametrga berilgan raqamlarni orqasiga ogirib qaytarsin.
// MASALAN: reverseInteger(123456789) return 987654321

// function getReverseInt(int: number) {
// 	let reverseInt = int.toString().split(' ').reverse().join(' ');
// 	let result = '';
// 	for (let i = reverseInt.length - 1; i >= 0; i--) {
// 		result += reverseInt[i];
// 	}
// 	return result;
// }
// console.log(getReverseInt(12345678));

// ZL-TASK:

// Shunday function yozing, u parametrda berilgan stringni kebab casega otkazib qaytarsin. Bosh harflarni kichik harflarga ham otkazsin.
// MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab”

// function getKebab(str: string): any {
// 	let words = str.split(' ');

// 	return words.join('-');
// }
// const res1 = getKebab('hello my name is kevin');
// console.log(res1);

// Shunday function yozing, u har soniyada bir marta consolega 1 dan 5 gacha bolgan raqamlarni chop etsin va 5 soniyadan keyin ishini toxtatsin.
// MASALAN: printNumbers()

// const stopAfter = setInterval(function () {
// 	let max = 7;
// 	let min = 2;
// 	let random;
// 	random = Math.floor(Math.random() * (max - min + 1)) + min;
// 	console.log(random);
// }, 1000);

// setTimeout(() => {
// 	clearInterval(stopAfter);
// 	console.log('Stopped');
// }, 5000);

// ZJ-TASK:

// Shunday function yozing, u berilgan arrayni ichidagi numberlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]) return 8

// function getNestedNums(arr: any): any {
// 	let res = 0;

// 	for (let i = 0; i < arr.length; i++) {
// 		if (Array.isArray(arr[i])) {
// 			res += getNestedNums(arr[i]);
// 		} else if (typeof arr[i] === 'number') {
// 			res += arr[i];
// 		}
// 	}

// 	return res;
// }

// console.log(getNestedNums([2, 3, [3, [5, 6]]]));

// ZK-TASK:
