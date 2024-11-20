import { createStore } from "vuex";
import axios from "axios";
const store = createStore({
  state: {
    triggerMethod: false,
  },
  mutations: {
    changeTriggerMethod(state){
      state.triggerMethod = false;

    },
    async setTriggerMethod(state, payload) {
      // state.triggerMethod = payload;
      console.log('payload',payload);
      
      axios.post(`${import.meta.env.VITE_API_LINK}/dynamicscene`, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Data submitted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error:', error.response ? error.response : error);
      });
      state.triggerMethod = true;
     
    } 

   },
});

export default store;
