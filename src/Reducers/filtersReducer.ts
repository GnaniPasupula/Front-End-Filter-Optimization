import { Reducer } from 'redux';

interface FiltersState {
  [key: string]: string[];
}

const initialState: FiltersState = {};

const filtersReducer: Reducer<FiltersState> = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FILTERS':
      return action.payload;
    case 'CLEAR_FILTERS':
      return {};
    default:
      return state;
  }
};

export { filtersReducer };  export type { FiltersState };

