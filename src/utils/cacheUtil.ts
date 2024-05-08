import NodeCache from "node-cache";
export default new NodeCache({ stdTTL: 60, checkperiod: 120 });