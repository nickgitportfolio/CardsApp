const createWordList = (object, randomKey, arrLength) => {
    if (!object[randomKey]) {
        return []; // возвращаем пустой массив, если объект не содержит указанный ключ
    }

    const randomValue = object[randomKey][Math.floor(Math.random() * object[randomKey].length)];

    const newArray = [randomValue]

    const keys = Object.keys(object).filter(key => key !== randomKey)

    for (let i = 0; i < arrLength - 1; i++) {
        const randomIndex = Math.floor(Math.random() * keys.length);
        const randomKey = keys[randomIndex]
        const randomValue = object[randomKey][Math.floor(Math.random() * object[randomKey].length)];
        newArray.push(randomValue)
        keys.splice(randomIndex, 1); // удалить случайно выбранный ключ из массива ключей, чтобы не выбрать его снова
    }

    newArray.sort(() => Math.random() - 0.5)
    return newArray
}

export default createWordList