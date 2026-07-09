const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

// A book is "new" for 30 days after creation — derived from createdAt,
// no admin action or extra DB field involved.
export const isNewBook = (book) =>
  Boolean(book?.createdAt) && Date.now() - new Date(book.createdAt).getTime() < THIRTY_DAYS_MS;
