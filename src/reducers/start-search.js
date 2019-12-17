export default function startSearch(state = {status: false, text: ''}, action) {
    switch (action.type) {
        case 'START_SEARCH':
            return Object.assign({}, state, {
                status: action.status,
                text: action.text
            });
        default:
            return state
    }
}