// base class for all entities in the system. Contains ONLY system related info
import { v4 as uuidv4 } from "uuid";

const Base = {
  id: uuidv4(),
};

module.exports = Base;
