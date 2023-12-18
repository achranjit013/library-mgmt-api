import BookSchema from "./BookSchema.js";

//Create
export const createBook = (bookObj) => {
  return BookSchema(bookObj).save();
};

export const getAllBooks = (filter) => {
  return BookSchema.find(filter);
};

export const getBookById = (_id) => {
  return BookSchema.findById(_id);
};

export const getABook = (filter) => {
  return BookSchema.findOne(filter);
};

export const deleteBook = (_id) => {
  return BookSchema.findByIdAndDelete(_id);
};

export const updateBookById = ({ _id, ...rest }) => {
  return BookSchema.findByIdAndUpdate(_id, rest);
};
