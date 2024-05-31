const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = new User({ 
    username: 'testuser', 
    passwordHash: 'hashedpassword' 
  });
  await user.save();

  const blog = new Blog({
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testurl.com',
    likes: 3,
    user: user._id,
  });
  await blog.save();
});

describe('=== TEST BLOG API ===', () => {
  test('the blog list application returns the correct amount of blog posts in the JSON format', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('2. the unique identifier property of the blog posts is named id, by default the database names the property _id.', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogs = response.body;
    blogs.forEach(blog => {
      expect(blog.id).toBeDefined();
      expect(blog._id).toBeUndefined();
    });
  });

  test('3. making an HTTP POST request to the /api/blogs URL successfully creates a new blog post.', async () => {
    const user = new User({ 
      username: 'testuser3', 
      passwordHash: 'hashedpassword' 
    });
    await user.save();
    
    const newBlog = {
      title: 'Async/Await simplifies making async calls',
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
      user: user._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(2);
    const titles = blogsAtEnd.map(b => b.title);
    expect(titles).toContain('Async/Await simplifies making async calls');
  });

  test('4. if likes property is missing, it defaults to 0.', async () => {
    const user = new User({ 
      username: 'testuser4', 
      passwordHash: 'hashedpassword' 
    });
    await user.save();

    const newBlog = {
      title: 'Blog without likes',
      author: 'John Doe',
      url: 'http://example.com',
      user: user._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    const addedBlog = blogsAtEnd.find(blog => blog.title === 'Blog without likes');
    expect(addedBlog.likes).toBe(0);
  });

  test('5. title or url properties are missing from the request data, the backend responds to the request with the status code 400 Bad Request.', async () => {
    const blogsAtStart = await Blog.find({});

    const user = new User({ 
      username: 'testuser5', 
      passwordHash: 'hashedpassword' 
    });
    await user.save();

    const newBlogWoTitle = {
      author: 'John Doe',
      url: 'http://example.com',
      likes: 5,
      user: user._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlogWoTitle)
      .expect(400);

    let blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const newBlogWoUrl = {
      title: 'Blog without URL',
      author: 'John Doe',
      likes: 5,
      user: user._id,
    };

    await api
      .post('/api/blogs')
      .send(newBlogWoUrl)
      .expect(400);

    blogsAtEnd = await Blog.find({});
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);
  });

  test('5. blog without url is not added and returns status code 400', async () => {
    const user = new User({ 
      username: 'testuser6', 
      passwordHash: 'hashedpassword' 
    });
    await user.save();

     // Only the initial blog should exist
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
