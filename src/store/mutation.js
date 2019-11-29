const mutation = {
  state: {
    size: 4,
    prevResult: null,
  },
  mutations: {
    setGameSize(state, size) {
      state.size = size;
    },
    setPrevResult(state, result) {
      state.prevResult = result;
    }
  }
};

export default mutation;
