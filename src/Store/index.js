import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      role: "",
    };
  },
  mutations: {
    updateRole(state, role) {
        alert("dnd")
      this.state.role = role;
    },
  },
  actions: {
    increment(context) {
      context.commit("increment");
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
});

export default store;
