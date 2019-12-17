export default function toObserveStore(store) {
    return {
        subscribe({ next }) {
            let unsubscribe = store.subscribe(() => next(store.getState()));
            next(store.getState());
            return unsubscribe;
        }
    }
}