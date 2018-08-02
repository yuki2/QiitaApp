import keyMirror from 'keymirror';

/* eslint-disable prefer-const */
export const Status = keyMirror({ PROCESSING: null, COMPLETE: null, ABORT: null });

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

export const createDefaultReducer = (startActionType, endActionType) => (state, action) => {
  switch (action.type) {
    case startActionType:
      return {
        ...state,
        loading: true,
      };
    case endActionType: {
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
      };
    }
    default:
      return state;
  }
};
