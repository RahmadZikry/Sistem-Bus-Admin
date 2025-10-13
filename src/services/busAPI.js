import busData from '../JSON/databus.json'; 

export const busAPI = {
    async fetchBuses() {
        return Promise.resolve(busData);
    }
};