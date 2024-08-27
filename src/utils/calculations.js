// src/utils/calculations.js

// Функция для вычисления арифметического среднего
export function calculateMean(quotes) {
    const total = quotes.reduce((sum, quote) => sum + quote.value, 0);
    return total / quotes.length;
}

// Функция для вычисления стандартного отклонения
export function calculateStandardDeviation(quotes) {
    const mean = calculateMean(quotes);
    const squaredDiffs = quotes.map((quote) => Math.pow(quote.value - mean, 2));
    const averageSquareDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.sqrt(averageSquareDiff);
}

// Функция для нахождения моды
export function calculateMode(quotes) {
    const frequency = {};
    quotes.forEach((quote) => {
        if (frequency[quote.value]) {
            frequency[quote.value]++;
        } else {
            frequency[quote.value] = 1;
        }
    });

    let mode = null;
    let maxFrequency = 0;
    for (const value in frequency) {
        if (frequency[value] > maxFrequency) {
            maxFrequency = frequency[value];
            mode = Number(value);
        }
    }
    return mode;
}

// Функция для нахождения минимального значения
export function calculateMin(quotes) {
    return Math.min(...quotes.map((quote) => quote.value));
}

// Функция для нахождения максимального значения
export function calculateMax(quotes) {
    return Math.max(...quotes.map((quote) => quote.value));
}
