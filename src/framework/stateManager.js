class StateManager {
    constructor() {
      this.data = '';
    //   this.listeners = [];
    }
  
    setData(newData) {
      this.data = newData;
    //   this.notifyListeners();
    }
  
    getData() {
      return this.data;
    }
  
    // addListener(callback) {
    //   this.listeners.push(callback);
    // }
  
    // notifyListeners() {
    //   this.listeners.forEach(callback => callback(this.data));
    // }
  }
  
  const stateManager = new StateManager();
  export default stateManager;