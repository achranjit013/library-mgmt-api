import BurrowSchema from "./BurrowSchema.js";

// create
export const createBurrow = (burrowObj) => {
  return BurrowSchema(burrowObj).save();
};

// read
// filter must be an obj
export const getABurrow = (filter) => {
  return BurrowSchema.findOne(filter);
};

export const getManyBurrow = (filter) => {
  return BurrowSchema.find(filter);
};

// update
export const updateBurrow = (filter, update) => {
  return BurrowSchema.findOneAndUpdate(filter, update);
};

// delete
export const deleteBurrow = (filter) => {
  return BurrowSchema.findOneAndDelete(filter);
};
