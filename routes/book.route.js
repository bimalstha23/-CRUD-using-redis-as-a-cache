const router = require("express").Router();
const Book = require("../models/book.model");
const client = require("../redisDB");

/**
 *  While fetching for data, check for cache hit.
 *  If cache hit,
 *      get data from redis,
 *  else
 *      fetch data from mongoDB,
 *      set data in redis cache and
 *      finally send the data to client.
 */
router.get("/", async (req, res) => {
  try {
    let books = await client.get("books");

    // check for cache hit
    if (books) {
      res.send(JSON.parse(books));
      return;
    }

    // On cache miss, fetch data from mongoDB.
    // Sending all data is a bad practice,
    // so send only some limited data
    books = await Book.find().limit(10);

    // set data in cache with expiry
    await client.set("books", JSON.stringify(books), {
      EX: 5,
    });

    // send data to user
    res.json(books);
  } catch (err) {
    res.send(err);
  }
});

/**
 *  While creating data, set the new data in redis cache.
 */
router.post("/", async (req, res) => {
  const { title, author, genre } = req.body;

  const book = new Book({
    title,
    author,
    genre,
  });

  try {
    // create a new book in mongoDB
    const newBook = await book.save();

    // cache new book data in redis
    await client.set(newBook.id, JSON.stringify(newBook), { EX: 5 });

    // send data to user
    res.json(newBook);
  } catch (err) {
    res.send(err);
  }
});

/**
 *  While fetching data by id check for cache hit
 *  If cache hit
 *    get data from redis
 *  else
 *    fetch data by id from MongoDB,
 *    set fetched data in redis,
 *    and finally send the data to client,
 *
 */
router.get("/:id", async (req, res) => {
  try {
    // check for cache hit
    let book = JSON.parse(await client.get(req.params.id));

    // if not cache hit, get data from mongoDB and cache to redis
    if (!book) {
      book = await Book.findById(req.params.id);
      //set fetched data in redis including expiry time in sec.
      await client.set(book.id, JSON.stringify(book), { EX: 5 });
    }
    res.json(book);
  } catch (err) {
    res.send(err);
  }
});

/**
 * When updating the data by id
 * update the data in mongoDB as well as in redis.
 */
router.patch("/:id", async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    //update the data in mongoDB
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre },
      { new: true }
    );
    //update the values in redis as well
    await client.set(updatedBook.id, JSON.stringify(updatedBook), { EX: 5 });
    //send the updated data to client
    res.json(updatedBook);
  } catch (err) {
    res.send(err);
  }
});

/**
 * While deleting the data from DB first delete the data from redis,
 * and then delete it from mongo as well.
 */
router.delete("/:id", async (req, res) => {
  try {
    //delete the data from redis
    await client.del(req.params.id);

    //delete the data from mongoDB
    console.log(await Book.findByIdAndDelete({ _id: req.params.id }));

    res.json({ message: "record deleted successfully" });
  } catch (err) {
    res.send(err);
  }
});
module.exports = router;
