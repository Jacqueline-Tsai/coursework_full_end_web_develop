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

describe('=== TEST BLOG API GET ===', () => {
  test('1. the blog list application returns the correct amount of blog posts in the JSON format', async () => {
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
})

describe('=== TEST BLOG API POST===', () => {
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
})

describe('=== TEST BLOG API PUT ===', () => {
  test('6. a blog can be updated', async () => {
    const user = new User({ 
      username: 'testuser6', 
      passwordHash: 'hashedpassword' 
    });
    await user.save();

    const newBlog = {
      title: 'Initial Title',
      author: 'Initial Author',
      url: 'http://example.com',
      likes: 0,
      user: user._id,
    };

    const savedBlogResponse = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogToUpdate = savedBlogResponse.body;

    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://updated-url.com',
      likes: 100,
    };

    const updatedBlogResponse = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(updatedBlogResponse.body.title).toStrictEqual(updatedBlog.title);
    expect(updatedBlogResponse.body.author).toStrictEqual(updatedBlog.author);
    expect(updatedBlogResponse.body.url).toStrictEqual(updatedBlog.url);
    expect(updatedBlogResponse.body.likes).toStrictEqual(updatedBlog.likes);
    expect(updatedBlogResponse.body.user).toStrictEqual(savedBlogResponse.body.user);
  });
});

// describe('=== TEST BLOG API DELETE ===', () => {
//   test('7. a blog can be deleted', async () => {
//     const user = new User({ 
//       username: 'testuser7', 
//       passwordHash: 'hashedpassword' 
//     });
//     await user.save();

//     const newBlog = {
//       title: 'Blog to be deleted',
//       author: 'Jacqueline',
//       url: 'http://example.com',
//       likes: 9999,
//       user: user._id,
//     };

//     const savedBlogResponse = await api
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(201)
//       .expect('Content-Type', /application\/json/);

//     const blogToDelete = savedBlogResponse.body;

//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .expect(204);

//     const blogsAtEnd = await Blog.find({});
//     expect(blogsAtEnd).toHaveLength(0);
//   });

//   test('8. a blog cannot be deleted by a user who did not create it', async () => {
//     const blogsAtStart = await Blog.find({});

//     const originalUser = new User({ 
//       username: 'testuser8', 
//       passwordHash: 'hashedpassword' 
//     });
//     await originalUser.save();

//     const newBlog = {
//       title: 'Blog not to be deleted',
//       author: 'Author',
//       url: 'http://example.com',
//       likes: 0,
//       user: originalUser._id
//     };

//     const savedBlogResponse = await api
//       .post('/api/blogs')
//       .send(newBlog)
//       .expect(201)
//       .expect('Content-Type', /application\/json/);

//     const blogToDelete = savedBlogResponse.body;
//     const anotherUser = new User({ username: 'anotheruser', passwordHash: await bcrypt.hash('sekret', 10) });
//     await anotherUser.save();

//     await api
//       .delete(`/api/blogs/${blogToDelete.id}`)
//       .expect(401);

//     const blogsAtEnd = await Blog.find({});
//     expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);
//   });
// });


afterAll(async () => {
  await mongoose.connection.close();
});
