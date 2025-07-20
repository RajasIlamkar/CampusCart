const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { name, email, password, hostel, year, rollNo, phoneNo } = req.body;

  try {
    // Validate all required fields
    if (!name || !email || !password || !hostel || !year || !rollNo || !phoneNo) {
      return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    // Check if user already exists (by email or roll number)
    let existingUser = await User.findOne({ $or: [{ email }, { rollNo }] });
    if (existingUser) return res.status(400).json({ msg: 'User already exists with this email or roll number' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      hostel,
      year,
      rollNo,
      phoneNo
    });

    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
  if (err) throw err;
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      rollNo: user.rollNo,
      phoneNo: user.phoneNo,
      year: user.year
    }
  });
});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
   jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
  if (err) throw err;
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      hostel: user.hostel,
      rollNo: user.rollNo,
      phoneNo: user.phoneNo,
      year: user.year
    }
  });
});

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }

};


