// Configuration
const CONFIG = {
    API_BASE_URL: 'http://numbersapi.com',
    ELEMENTS: {
        number: 'number',
        numberFact: 'number-fact',
        newNumber: 'new-number',
        dateFact: 'numberFact'  
    },
    PATHS: {
        random: 'random.html',
        result: 'result.html',
        date: 'date.html'
    }
};


class NumbersApiService {
    static async fetchFact(endpoint) {
        try {
            const response = await fetch(`${CONFIG.API_BASE_URL}/${endpoint}`);
            return await response.text();
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new Error('Failed to fetch fact');
        }
    }

    static getNumberFact(number) {
        return this.fetchFact(number);
    }

    static getRandomFact() {
        return this.fetchFact('random');
    }

    static getDateFact(month, day) {
        return this.fetchFact(`${month}/${day}/date`);
    }
}


class UIHandler {
    static updateElement(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.innerText = content;
        }
    }

    static showError(elementId, message = 'An error occurred. Please try again.') {
        this.updateElement(elementId, message);
    }

    static getInputValue(elementId) {
        return document.getElementById(elementId)?.value;
    }

    static validateDateNumber(number) {
        const parsed = parseInt(number, 10);
        return parsed >= 1 && parsed <= 31 ? parsed : null;
    }

    static formatDate(dayNumber) {
        const date = new Date(2020, 0);
        date.setDate(dayNumber);
        return {
            month: date.getMonth() + 1,
            day: date.getDate()
        };
    }
}


class PageController {
    static async handleNumberFact(number) {
        try {
            const fact = await NumbersApiService.getNumberFact(number);
            UIHandler.updateElement(CONFIG.ELEMENTS.number, number);
            UIHandler.updateElement(CONFIG.ELEMENTS.numberFact, fact);
        } catch (error) {
            UIHandler.showError(CONFIG.ELEMENTS.numberFact);
        }
    }

    static async handleRandomFact() {
        try {
            const fact = await NumbersApiService.getRandomFact();
            const numberMatch = fact.match(/\d+/);
            const number = numberMatch ? numberMatch[0] : 'Unknown';
            
            UIHandler.updateElement(CONFIG.ELEMENTS.number, number);
            UIHandler.updateElement(CONFIG.ELEMENTS.numberFact, fact);
        } catch (error) {
            UIHandler.showError(CONFIG.ELEMENTS.numberFact);
        }
    }

    static async handleDateFact(number) {
        const validNumber = UIHandler.validateDateNumber(number);
        if (!validNumber) {
            alert('Please enter a number between 1 and 31.');
            return;
        }

        try {
            const { month, day } = UIHandler.formatDate(validNumber);
            const fact = await NumbersApiService.getDateFact(month, day);
            UIHandler.updateElement(CONFIG.ELEMENTS.dateFact, fact);  
        } catch (error) {
            UIHandler.showError(CONFIG.ELEMENTS.dateFact);  
        }
    }
}


class EventHandler {
    static setupEventListeners() {
        this.setupButton('fetchFact', () => {
            const number = UIHandler.getInputValue(CONFIG.ELEMENTS.number);
            if (number) {
                window.location.href = `${CONFIG.PATHS.result}?number=${number}`;
            } else {
                alert('Please enter a number.');
            }
        });

        this.setupButton('fetchNewFact', () => {
            const number = UIHandler.getInputValue(CONFIG.ELEMENTS.newNumber);
            if (number) {
                PageController.handleNumberFact(number);
            } else {
                alert('Please enter a number.');
            }
        });

        this.setupButton('randomBtn', () => {
            window.location.href = CONFIG.PATHS.random;
        });

        this.setupButton('dateBtn', () => {
            window.location.href = CONFIG.PATHS.date;
        });

        this.setupButton('fetchNumberFact', () => {
            const number = UIHandler.getInputValue(CONFIG.ELEMENTS.number);
            if (number) {
                PageController.handleDateFact(number);
            } else {
                alert('Please enter a number.');
            }
        });

        this.setupButton('fetchRandomFact', () => {
            PageController.handleRandomFact();
        });
    }

    static setupButton(id, callback) {
        const button = document.getElementById(id);
        if (button) {
            button.addEventListener('click', callback);
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    EventHandler.setupEventListeners();

    
    const currentPath = window.location.pathname;
    
    if (currentPath.includes(CONFIG.PATHS.random)) {
        PageController.handleRandomFact();
    } else if (currentPath.includes(CONFIG.PATHS.result)) {
        const params = new URLSearchParams(window.location.search);
        const number = params.get('number');
        
        if (number) {
            PageController.handleNumberFact(number);
        } else {
            UIHandler.updateElement(CONFIG.ELEMENTS.number, 'Error');
            UIHandler.updateElement(CONFIG.ELEMENTS.numberFact, 'No number provided.');
        }
    }
});