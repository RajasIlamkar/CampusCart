const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const {
      search = '',
      hostel,
      minPrice,
      maxPrice,
      sort
    } = req.query;

    const matchStage = {
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        }
      ]
    };

    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter.$gte = Number(minPrice);
      if (maxPrice) priceFilter.$lte = Number(maxPrice);
      matchStage.$and.push({ price: priceFilter });
    }

    // Aggregation pipeline
    const pipeline = [
      {
        $lookup: {
          from: 'users', // collection name (lowercase plural of model name)
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $match: matchStage
      }
    ];

    // Add hostel filter after lookup
    if (hostel) {
      pipeline.push({
        $match: { 'user.hostel': hostel }
      });
    }

    // Sorting stage
    let sortStage = { $sort: { createdAt: -1 } }; // default
    if (sort === 'price_asc') sortStage = { $sort: { price: 1 } };
    else if (sort === 'price_desc') sortStage = { $sort: { price: -1 } };
    else if (sort === 'date_asc') sortStage = { $sort: { createdAt: 1 } };

    pipeline.push(sortStage);

    const products = await Product.aggregate(pipeline);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};





exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('user', 'name hostel phoneNo');
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = req.file ? req.file.path : '';

    const product = new Product({
      title,
      description,
      price,
      imageUrl,
      user: req.user.id,
    });
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).populate('user', 'name');
    res.json(products);
  } catch {
    res.status(500).json({ msg: 'Failed to fetch your listings' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });
    if (!product) return res.status(404).json({ msg: 'Product not found' });

    await product.deleteOne();
    res.json({ msg: 'Product deleted' });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: 'Product not found' });
    }

    if (!product.user || product.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Now safe to update
    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;

    if (req.file) {
      product.imageUrl = req.file.path.replace(/\\/g, '/');
    }

    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
