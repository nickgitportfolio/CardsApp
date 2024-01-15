export const numbers = [];

export const random = (min, max) => {
    const number = Math.floor(min + Math.random() * (max - min + 1));
    if (numbers.includes(number)) {
        return random(min, max);
    } else {
        numbers.push(number);
        return number;
    }
};