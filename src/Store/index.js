import { createStore } from "vuex";
import axios from "axios";
const store = createStore({
  state: {
      triggerMethod:false
    },
  mutations: {
    async setTriggerMethod(state, payload) {
      // state.triggerMethod = payload;
      try {
        const response = await axios.post("https://slow-camels-peel.loca.lt/dynamicscene",
          payload
        );
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      state.triggerMethod = true;
     console.log('entered');
     
    } 

   },
});

export default store;
