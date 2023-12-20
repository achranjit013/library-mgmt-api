import ReviewSchema from "./ReviewSchema.js";

// create
export const createReview = (reviewObj) => {
  return ReviewSchema(reviewObj).save();
};

// read
export const getManyReview = () => {
  return ReviewSchema.find();
};

// update
export const updateReview = (filter, update) => {
  return ReviewSchema.findOneAndUpdate(filter, update);
};

// delete
export const deleteReview = (filter) => {
  return ReviewSchema.findOneAndDelete(filter);
};
