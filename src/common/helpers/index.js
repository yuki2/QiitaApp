import { Status } from '../constants';

/* eslint-disable prefer-const */
export function uniqueItems(items) {
  let uniqueIds = new Set();
  let newItems = [];
  items.forEach((item) => {
    if (uniqueIds.has(item.id)) {
      return;
    }
    uniqueIds.add(item.id);
    newItems.push(item);
  });
  return newItems;
}
/* eslint-disable prefer-const */

function createAction(type, payload = {}, meta = {}, status) {
  return {
    type,
    payload,
    meta: { ...meta, status },
  };
}

export function createStartAction(type, payload = {}, meta = {}) {
  return createAction(type, payload, meta, Status.PROCESSING);
}

export function createCompleteAction(type, payload = {}, meta = {}) {
  return createAction(type, payload, meta, Status.COMPLETE);
}

export function createAbortAction(type, payload = {}, meta = {}) {
  return createAction(type, payload, meta, Status.ABORT);
}

export function defaultReducer(state = {}, action = {}, actionType) {
  switch (action.type) {
    case actionType:
      switch (action.meta.status) {
        case Status.PROCESSING:
          return {
            ...state,
            loading: true,
          };
        case Status.COMPLETE: {
          const { items, totalCount } = action.payload.model;
          let newItems;
          if (action.meta.refresh) {
            newItems = uniqueItems(items);
          } else {
            newItems = uniqueItems(state.model.items.concat(items));
          }

          return {
            ...state,
            model: {
              totalCount,
              items: newItems,
            },
            loading: false,
            error: {},
          };
        }
        case Status.ABORT:
          return {
            ...state,
            loading: false,
            error: action.payload.error,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}
