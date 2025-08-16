// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Article = require("./models/Article");
const ArticleCategory = require("./models/ArticleCategory");
const Category = require("./models/Category");
const Comment = require("./models/Comment");
const Image = require("./models/Image");
const User = require("./models/User");
const NewsPost = require("./models/NewsPost");
const Music = require("./models/Music");

const multer = require("multer");

const app = express();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 5000;
const MONGO_URI = "mongodb+srv://doctorshavu:Admin%401234@cluster0.ebmy41m.mongodb.net/Amakuru-News?retryWrites=true&w=majority&appName=Cluster0";

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Images/"); // folder must exist or create it
  },
  filename: function (req, file, cb) {
    // Unique filename with timestamp + original name
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Serve static files from uploads folder
const path = require("path");
app.use(
  "/uploads/Images",
  express.static(path.join(__dirname, "uploads", "Images"))
);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));




// CREATE article-category link
app.post("/article-categories", async (req, res) => {
  try {
    const link = new ArticleCategory(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all article-category links
app.get("/article-categories", async (req, res) => {
  try {
    const links = await ArticleCategory.find()
      .populate("article_id", "title") // optionally populate article title
      .populate("category_id", "name"); // optionally populate category name
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one article-category link by ID
app.get("/article-categories/:id", async (req, res) => {
  try {
    const link = await ArticleCategory.findById(req.params.id)
      .populate("article_id", "title")
      .populate("category_id", "name");
    if (!link) return res.status(404).json({ error: "Link not found" });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE article-category link by ID
app.put("/article-categories/:id", async (req, res) => {
  try {
    const link = await ArticleCategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!link) return res.status(404).json({ error: "Link not found" });
    res.json(link);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE article-category link by ID
app.delete("/article-categories/:id", async (req, res) => {
  try {
    const link = await ArticleCategory.findByIdAndDelete(req.params.id);
    if (!link) return res.status(404).json({ error: "Link not found" });
    res.json({ message: "Link deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








// CREATE Category
app.post("/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ All Categories
app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ One Category by ID
app.get("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Category by ID
app.put("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Category by ID
app.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});








// Get all messages
app.get("/api/comments", async (req, res) => {
  const comments = await Comment.find().sort({ createdAt: -1 });
  res.json(comments);
});

app.post("/api/comments", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  // Save to DB
  const comment = new Comment({ name, email, phone, subject, message });
  await comment.save();
  res.status(201).json({ message: "Message saved" });
});

app.patch("/api/comments/:id/read", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!comment) return res.status(404).json({ error: "Message not found" });
    res.json(comment);
  } catch (err) {
    console.error("Error marking message as read:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a message
app.delete("/api/comments/:id", async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});






app.get("/api/music", async (req, res) => {
  try {
    const all = await Music.find().sort({ _id: -1 });
    res.json(all);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch music" });
  }
});

app.post("/api/music", async (req, res) => {
  try {
    const { youtubeUrl } = req.body;
    if (!youtubeUrl) {
      return res.status(400).json({ message: "youtubeUrl is required" });
    }
    const newItem = new Music({ youtubeUrl });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error saving music:", error);
    res.status(500).json({ message: "Failed to add music" });
  }
});

app.delete("/api/music/:id", async (req, res) => {
  try {
    await Music.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete music" });
  }
});

// Set status = 'approved'
app.patch("/api/comments/:id/approve", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating comment status" });
  }
});

app.patch("/api/comments/:id/reject", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error updating comment status" });
  }
});

// Delete comment by id
app.delete("/api/comments/:id", async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error deleting comment" });
  }
});







// CREATE Image
app.post("/images", async (req, res) => {
  try {
    const image = new Image(req.body);
    await image.save();
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ all Images
app.get("/images", async (req, res) => {
  try {
    const images = await Image.find().populate("article_id", "title"); // populate article title
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one Image by ID
app.get("/images/:id", async (req, res) => {
  try {
    const image = await Image.findById(req.params.id).populate(
      "article_id",
      "title"
    );
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json(image);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Image by ID
app.put("/images/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE Image by ID
app.delete("/images/:id", async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ error: "Image not found" });
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create news post with image upload
app.post("/api/news", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author, category, status } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/Images/${
        req.file.filename
      }`;
    }

    const newPost = new NewsPost({
      title,
      content,
      author,
      category,
      status,
      image: imageUrl,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating news post:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all news posts
app.get("/api/news", async (req, res) => {
  try {
    const posts = await NewsPost.find().sort({ updatedAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single news post by id
app.get("/api/news/:id", async (req, res) => {
  try {
    const post = await NewsPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Inkuru ntiboneka" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE a post
app.put("/api/news/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/Images/${
        req.file.filename
      }`;
    }

    const updated = await NewsPost.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE a post
app.delete("/api/news/:id", async (req, res) => {
  try {
    await NewsPost.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const YOUTUBE_API_KEY = "https://youtu.be/drf9WrCkzsM?list=RDdrf9WrCkzsM";

if (!YOUTUBE_API_KEY) {
  console.error("Missing YOUTUBE_API_KEY!");
  process.exit(1);
}
if (!MONGO_URI) {
  console.error("Missing MONGO_URI!");
  process.exit(1);
}

const extractVideoId = (url) => {
  const regExp =
    /^.*(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]{11}).*/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

app.post("/api/songs", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: "Missing YouTube URL." });
    }
    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({ message: "Invalid YouTube URL." });
    }

    const ytApiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(ytApiUrl);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Failed to fetch YouTube video details." });
    }

    const snippet = data.items[0].snippet;

    const newSong = new Song({
      title: snippet.title,
      artist: snippet.channelTitle,
      image: snippet.thumbnails.high.url,
      videoId,
      url,
    });

    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    console.error("Error saving song:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

app.get("/api/songs", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Register User
app.post("/api/users", async (req, res) => {
  try {
    const { username, email, password_hash, role, status, avatar } = req.body;

    if (!username || !email || !password_hash) {
      return res
        .status(400)
        .json({ message: "Username, email, and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password_hash, salt);

    const newUser = new User({
      username,
      email,
      password_hash: hashedPassword,
      role,
      status,
      avatar,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Login User

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, 'e5ce40b43736a783c84ddc8551d1818c7b85c0b9', {
      expiresIn: '2m',
    });

    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// READ all Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password_hash"); // exclude password hash
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ one User by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password_hash");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE User by ID
app.put("/api/users/:id", async (req, res) => {
  try {
    const { username, email, password_hash, role, status, avatar } = req.body;

    // Ensure required fields for update (you can customize this validation)
    if (!username && !email && !password_hash && !role && !status && !avatar) {
      return res.status(400).json({ message: "At least one field must be provided for update." });
    }

    const updates = {};

    if (username) updates.username = username;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (avatar) updates.avatar = avatar;

    // Hash password if provided
    if (password_hash) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password_hash, salt);
      updates.password_hash = hashedPassword;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const { password_hash: _, ...userWithoutPassword } = user.toObject();
    res.json({ message: "User updated successfully", user: userWithoutPassword });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// DELETE User by ID
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
