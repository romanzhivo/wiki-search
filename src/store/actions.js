const CHANGE_NAME = 'CHANGE_NAME';
const START_SEARCH = 'START_SEARCH';

// Action creators

export function changeName(text) {
    return {
        type: CHANGE_NAME,
        update: text
    }
}

export function startSearch({status = false, text = ''}) {
    return {
        type: START_SEARCH,
        status,
        text
    }
}

// Action creators : END