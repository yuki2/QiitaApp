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
