import { createStore } from "vuex";
import axios from "axios";
const store = createStore({
  state: {
    triggerMethod: false,
  },
  mutations: {
    async setTriggerMethod(state, payload) {
      // state.triggerMethod = payload;
      console.log('payload',payload);
      
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_LINK}/dynamicscene`,
          payload
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      state.triggerMethod = true;
     
    } 

   },
});

export default store;
