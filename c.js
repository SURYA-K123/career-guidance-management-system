const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongoDB, getClient } = require('./db');
const { ObjectId } = require('mongodb');

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/session', async (req, res) => {
  try {
    await connectToMongoDB(); 

    const client = getClient();
    const database = client.db('web');
    const sessionCollection = database.collection('session');

    const sessions = await sessionCollection.find({}, { _id: 0 }).toArray();
    console.log('Found sessions:', sessions);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});


app.get('/cart', async (req, res) => {
  try {
    await connectToMongoDB(); 

    const client = getClient();
    const database = client.db('web');
    const sessionCollection = database.collection('cart');

    const sessions = await sessionCollection.find({}, { _id: 0 }).toArray();
    console.log('Found added:', sessions);

    res.json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Error fetching sessions' });
  }
});

app.post('/addToCart', async (req, res) => {
  try {
    const item = req.body.item;

    item._id = new ObjectId(item._id);

    await connectToMongoDB();

    const client = getClient();
    const database = client.db('web');
    const cartCollection = database.collection('cart');

    const sessionCollection = database.collection('session');
    const updateResult = await sessionCollection.updateOne(
      { _id: item._id },
      { $set: { status: 0 } }
    );

    if (updateResult.modifiedCount === 1) {
      console.log("updated");
    } else if (updateResult.matchedCount === 0) {
      console.log("no document found with the provided _id");
    } else {
      console.log("status field was already set to 0");
    }

    const result = await cartCollection.insertOne(item);

    if (result.insertedCount === 1) {
      console.log("inserted");
      res.json({ message: 'Item added to cart successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add item to cart' });
    }
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Error adding item to cart' });
  }
});



app.delete('/removeFromCart/:id', async (req, res) => {
  try {
    const sessionId = new ObjectId(req.params.id);
    await connectToMongoDB();

    const client = getClient();
    const database = client.db('web');
    const cartCollection = database.collection('cart');
    const sessionCollection = database.collection('session');

    const updateSessionResult = await sessionCollection.updateOne(
      { _id: sessionId },
      { $set: { status: 1 } }
    );

    const deleteResult = await cartCollection.deleteOne({ _id: sessionId });

    if (deleteResult.deletedCount === 1) {
      res.json({ message: 'Session removed from the cart successfully' });
    } else {
      res.status(404).json({ error: 'Session not found in the cart' });
    }
  } catch (error) {
    console.error('Error removing session from the cart:', error);
    res.status(500).json({ error: 'Error removing session from the cart' });
  }
});


app.get('/review', async (req, res) => {
  try {
    await connectToMongoDB(); 

    const client = getClient();
    const database = client.db('web');
    const reviewCollection = database.collection('review');

    const reviews = await reviewCollection.find({}).toArray();
    console.log('Found reviews:', reviews);

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

app.post('/review', async (req, res) => {
  try {
    const review = req.body.review; 
    await connectToMongoDB();

    const client = getClient();
    const database = client.db('web');
    const reviewsCollection = database.collection('review');

    const result = await reviewsCollection.insertOne(review);

    if (result.insertedCount === 1) {
      res.json({ message: 'Review added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to add review' });
    }
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Error adding review' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
