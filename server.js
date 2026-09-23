import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 4000;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dslumora.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lumora123';
const adminTokens = new Map();

const dataDir = path.join(__dirname, 'data');
const uploadsDir = path.join(__dirname, 'uploads');
const productsFile = path.join(dataDir, 'products.json');
const siteFile = path.join(dataDir, 'site.json');

fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadsDir, { recursive: true });

const defaultProducts = [
  {
    id: 'demo-1',
    name: 'Lilac Bloom Bouquet',
    slug: 'lilac-bloom-bouquet',
    category: 'Bouquets',
    description: 'Soft lilac bouquet for special gifting moments.',
    originalPrice: 1499,
    discountPrice: 999,
    images: ['/uploads/demo-bouquet-1.svg'],
    video: '',
    featured: true,
    active: true,
  },
  {
    id: 'demo-2',
    name: 'Cute Couple Keychains',
    slug: 'cute-couple-keychains',
    category: 'Keychains',
    description: 'Minimal handmade keychains with a cute theme.',
    originalPrice: 799,
    discountPrice: 499,
    images: ['/uploads/demo-keychain-1.svg'],
    video: '',
    featured: false,
    active: true,
  }
];

const defaultSite = {
  brandName: 'DS Lumora',
  tagline: 'Handmade with love',
  instagram: 'https://www.instagram.com/ds_lumora/',
  whatsapp: '919569533928',
  heroTitle: 'Give them a reason to smile.',
  heroSubtitle: 'Handmade bouquets, keepsakes and customized gifts.',
  storyTitle: 'Because the best gifts feel personal.',
  storyText: 'Every handmade piece is created with care and intention.'
};

const ensureJsonFile = (filePath, defaultData) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    return raw ? JSON.parse(raw) : defaultData;
  } catch {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
};

const products = ensureJsonFile(productsFile, defaultProducts);
const site = ensureJsonFile(siteFile, defaultSite);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '.jpg');
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({ storage });

const writeProducts = (data) => {
  fs.writeFileSync(productsFile, JSON.stringify(data, null, 2), 'utf-8');
};

const writeSite = (data) => {
  fs.writeFileSync(siteFile, JSON.stringify(data, null, 2), 'utf-8');
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '';

  if (!token || !adminTokens.has(token)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
};

app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadsDir));
app.use('/admin', express.static(path.join(__dirname, 'admin')));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'DS Lumora API is running' });
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = `admin_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  adminTokens.set(token, email);
  res.json({ token, email });
});

app.get('/api/admin/session', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : '';
  res.json({ authenticated: !!token && adminTokens.has(token) });
});

app.get('/api/products', (req, res) => {
  res.json(products.filter((item) => item.active !== false));
});

app.post('/api/products', requireAdmin, (req, res) => {
  const product = {
    id: req.body.id || `product-${Date.now()}`,
    name: req.body.name || 'New Product',
    slug: req.body.slug || (req.body.name || 'product').toLowerCase().replace(/\s+/g, '-'),
    category: req.body.category || 'General',
    description: req.body.description || '',
    originalPrice: Number(req.body.originalPrice || 0),
    discountPrice: Number(req.body.discountPrice || 0),
    images: Array.isArray(req.body.images) ? req.body.images : [],
    video: req.body.video || '',
    featured: Boolean(req.body.featured),
    active: req.body.active !== false,
  };

  products.unshift(product);
  writeProducts(products);
  res.status(201).json(product);
});

app.put('/api/products/:id', requireAdmin, (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products[index] = {
    ...products[index],
    ...req.body,
    originalPrice: Number(req.body.originalPrice || products[index].originalPrice),
    discountPrice: Number(req.body.discountPrice || products[index].discountPrice),
    images: Array.isArray(req.body.images) ? req.body.images : products[index].images,
  };

  writeProducts(products);
  res.json(products[index]);
});

app.delete('/api/products/:id', requireAdmin, (req, res) => {
  const filtered = products.filter((item) => item.id !== req.params.id);
  if (filtered.length === products.length) {
    return res.status(404).json({ message: 'Product not found' });
  }

  products.splice(0, products.length, ...filtered);
  writeProducts(products);
  res.json({ success: true });
});

app.get('/api/site', (req, res) => {
  res.json(site);
});

app.put('/api/site', requireAdmin, (req, res) => {
  Object.assign(site, req.body);
  writeSite(site);
  res.json(site);
});

app.post('/api/upload', requireAdmin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl, filename: req.file.filename });
});

app.post('/api/upload-multiple', requireAdmin, upload.array('files', 10), (req, res) => {
  if (!req.files || !req.files.length) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const urls = req.files.map((file) => `/uploads/${file.filename}`);
  res.json({ urls });
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DS Lumora backend running on http://localhost:${PORT}`);
});
