db.createCollection('authors', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['fullName', 'birthday', 'languages', 'contacts'],
      properties: {
        fullName: { bsonType: 'string', description: "Author's full name" },
        birthday: { bsonType: 'date', description: "Author's birth date" },
        languages: {
          bsonType: 'array',
          items: { bsonType: 'string' },
          description: 'Languages the author writes in',
        },
        contacts: {
          bsonType: 'object',
          required: ['email', 'phone', 'postalCode'],
          properties: {
            email: { bsonType: 'string', description: "Author's email" },
            phone: { bsonType: 'string', description: "Author's phone number" },
            postalCode: {
              bsonType: 'string',
              description: "Author's postal code",
            },
          },
        },
      },
    },
  },
});

db.createCollection('books', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: [
        'title',
        'authorId',
        'genre',
        'pages',
        'language',
        'year',
        'synopsis',
      ],
      properties: {
        title: { bsonType: 'string', description: 'Book title' },
        authorId: {
          bsonType: 'objectId',
          description: 'Reference to the author',
        },
        genre: { bsonType: 'string', description: 'Book genre' },
        pages: { bsonType: 'int', minimum: 1, description: 'Number of pages' },
        language: { bsonType: 'string', description: 'Language of the book' },
        year: { bsonType: 'int', description: 'Year of publication' },
        synopsis: {
          bsonType: 'string',
          description: 'Brief description of the book',
        },
      },
    },
  },
});

db.authors.insertMany([
  {
    fullName: 'George Orwell',
    birthday: new Date('1903-06-25'),
    languages: ['English'],
    contacts: {
      email: 'orwell@example.com',
      phone: '+123456789',
      postalCode: '12345',
    },
  },
  {
    fullName: 'J.K. Rowling',
    birthday: new Date('1965-07-31'),
    languages: ['English'],
    contacts: {
      email: 'rowling@example.com',
      phone: '+987654321',
      postalCode: '54321',
    },
  },
]);

db.books.insertMany([
  {
    title: '1984',
    authorId: ObjectId('65a123456789abcd12345678'),
    genre: 'Dystopian',
    pages: 328,
    language: 'English',
    year: 1949,
    synopsis: 'A novel about a totalitarian future society.',
  },
  {
    title: 'Animal Farm',
    authorId: ObjectId('65a123456789abcd12345678'),
    genre: 'Political satire',
    pages: 112,
    language: 'English',
    year: 1945,
    synopsis: 'A satirical allegory of Soviet totalitarianism.',
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    authorId: ObjectId('65a123456789abcd12345679'),
    genre: 'Fantasy',
    pages: 309,
    language: 'English',
    year: 1997,
    synopsis: "A young wizard's journey begins.",
  },
  {
    title: 'Harry Potter and the Chamber of Secrets',
    authorId: ObjectId('65a123456789abcd12345679'),
    genre: 'Fantasy',
    pages: 341,
    language: 'English',
    year: 1998,
    synopsis: 'The second year at Hogwarts brings new mysteries.',
  },
]);

db.authors.aggregate([
  {
    $lookup: {
      from: 'books',
      localField: '_id',
      foreignField: 'authorId',
      as: 'books',
    },
  },
  {
    $unwind: {
      path: '$books',
      preserveNullAndEmptyArrays: false,
    },
  },
  {
    $group: {
      _id: {
        fullName: '$fullName',
        id: '$_id',
      },
      bookCount: {
        $sum: 1,
      },
    },
  },
  {
    $sort: {
      bookCount: -1,
      '_id.fullName': 1,
    },
  },
]);

db.books.aggregate([
  {
    $lookup: {
      from: 'authors',
      localField: 'authorId',
      foreignField: '_id',
      as: 'author',
    },
  },
  {
    $unwind: {
      path: '$author',
      preserveNullAndEmptyArrays: false,
    },
  },
]);

db.books.aggregate([
  {
    $match: {
      language: 'English',
      year: 2021,
    },
  },
  {
    $group: {
      _id: null,
      bookCount: {
        $sum: 1,
      },
    },
  },
]);

// $project ?
