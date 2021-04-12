import * as Yup from 'yup';

export const addBookSchema = Yup.object({
  bookName: Yup.string()
    .max(200, 'Book name cannot be longer than 200 characters.')
    .required('Required field.'),
  bookAuthor: Yup.string()
    .max(200, 'Name of book authors cannot be more than 200 characters.')
    .required('Required field.'),
  createdAt: Yup.string()
    .max(13, 'Not valid date')
    .required('Required field.'),
  filename: Yup.string().required('Need an image.'),
});

export const deleteBookSchema = Yup.object({
  bookId: Yup.string().required('Need bookId'),
});
