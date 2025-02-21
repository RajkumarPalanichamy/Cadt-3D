import { createStore } from "vuex";
import axios from "axios";
const store = createStore({
  state: {
    triggerMethod: false,
    loadSavedModel: null,
    wallValue: false,
    studioButton:false,

    modelimg:null,

  },
  mutations: {
    changeTriggerMethod(state) {
      state.triggerMethod = false;
    },
    async setTriggerMethod(state, payload) {
      console.log("payload", payload);
      try {
        const response = await axios.post(

          `${import.meta.env.VITE_API_LINK}/dynamic/dynamicscene`,

          payload
        );
        console.log(response.data);
      } catch (err) {
        console.error("Error:", err.response ? err.response : err);
      }

      state.triggerMethod = true;
    },
    loadModel(state, model) {
      state.loadSavedModel = model;

    },
    cancelModel(state) {
      state.loadSavedModel = null;
    },
    wall(state, value) {
      state.wallValue = value;
      console.log("value,", state.wallValue);
    },
    revertWall(state, value) {
      state.wallValue=value
    },
    studioFunctionality(state,value){
      state.studioButton=value

    },
    modelimage(state,response){
      state.modelimg = response
      console.log(state.modelimg);
      

    }
  },
});

export default store;