const API = '/api';
let currentImages = [];
let currentVideo = '';

const form = document.getElementById('productForm');
const productList = document.getElementById('productList');
const imageUpload = document.getElementById('imageUpload');
const videoUpload = document.getElementById('videoUpload');
const imagePreviewList = document.getElementById('imagePreviewList');
const siteForm = document.getElementById('siteForm');
const authScreen = document.getElementById('authScreen');
const adminShell = document.getElementById('adminShell');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

const getAuthToken = () => localStorage.getItem('dsLumoraAdminToken') || '';

const apiFetch = async (url, options = {}) => {
  const token = getAuthToken();
  const headers = options.headers || {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  }

  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    localStorage.removeItem('dsLumoraAdminToken');
    showAuth();
    throw new Error('Unauthorized');
  }

  return response;
};

const showAuth = () => {
  authScreen.classList.remove('hidden');
  adminShell.classList.add('hidden');
};

const showAdmin = () => {
  authScreen.classList.add('hidden');
  adminShell.classList.remove('hidden');
};

const checkAuth = async () => {
  const token = getAuthToken();
  if (!token) return showAuth();

  try {
    const response = await apiFetch(`${API}/admin/session`);
    const data = await response.json();
    if (data.authenticated) {
      showAdmin();
      loadProducts();
      loadSite();
      resetForm();
      return;
    }
  } catch (error) {
    console.error(error);
  }

  localStorage.removeItem('dsLumoraAdminToken');
  showAuth();
};

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';

  const payload = {
    email: document.getElementById('adminEmail').value,
    password: document.getElementById('adminPassword').value,
  };

  try {
    const response = await fetch(`${API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    localStorage.setItem('dsLumoraAdminToken', data.token);
    showAdmin();
    loadProducts();
    loadSite();
    resetForm();
  } catch (error) {
    loginError.textContent = error.message;
  }
});

const setFormValue = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
};

const resetForm = () => {
  form.reset();
  document.getElementById('productId').value = '';
  currentImages = [];
  currentVideo = '';
  imagePreviewList.innerHTML = '';
  document.getElementById('active').checked = true;
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiFetch(`${API}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const result = await response.json();
  return result.url;
};

const renderImages = () => {
  imagePreviewList.innerHTML = currentImages.map((url, index) => `
    <div class="image-pill">
      <img src="${url}" alt="uploaded-${index}" />
      <button type="button" data-remove-image="${index}">Remove</button>
    </div>
  `).join('');

  document.querySelectorAll('[data-remove-image]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.removeImage);
      currentImages.splice(index, 1);
      renderImages();
    });
  });
};

imageUpload.addEventListener('change', async (event) => {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;

  for (const file of files) {
    const url = await uploadFile(file);
    currentImages.push(url);
  }

  renderImages();
  event.target.value = '';
});

videoUpload.addEventListener('change', async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  currentVideo = await uploadFile(file);
  event.target.value = '';
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    id: document.getElementById('productId').value || undefined,
    name: document.getElementById('name').value,
    category: document.getElementById('category').value,
    description: document.getElementById('description').value,
    originalPrice: Number(document.getElementById('originalPrice').value || 0),
    discountPrice: Number(document.getElementById('discountPrice').value || 0),
    images: currentImages,
    video: currentVideo,
    featured: document.getElementById('featured').checked,
    active: document.getElementById('active').checked,
  };

  const productId = document.getElementById('productId').value;
  const url = productId ? `${API}/products/${productId}` : `${API}/products`;
  const method = productId ? 'PUT' : 'POST';

  const response = await apiFetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    resetForm();
    loadProducts();
  }
});

const renderProducts = (products) => {
  productList.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="card-media">
        <img src="${product.images?.[0] || '/uploads/default.svg'}" alt="${product.name}" />
      </div>
      <div class="card-body">
        <small>${product.category}</small>
        <h4>${product.name}</h4>
        <div class="price-row">
          <span class="price">₹${product.discountPrice || 0}</span>
          <span class="old-price">₹${product.originalPrice || 0}</span>
        </div>
        <div class="card-actions">
          <button data-edit="${product.id}" class="small-btn">Edit</button>
          <button data-delete="${product.id}" class="small-btn danger">Delete</button>
        </div>
      </div>
    </article>
  `).join('');

  productList.querySelectorAll('[data-edit]').forEach((button) => {
    button.addEventListener('click', async () => {
      const response = await apiFetch(`${API}/products`);
      const products = await response.json();
      const product = products.find((item) => item.id === button.dataset.edit);
      if (!product) return;

      document.getElementById('productId').value = product.id;
      setFormValue('name', product.name);
      setFormValue('category', product.category);
      setFormValue('description', product.description);
      setFormValue('originalPrice', product.originalPrice);
      setFormValue('discountPrice', product.discountPrice);
      document.getElementById('featured').checked = Boolean(product.featured);
      document.getElementById('active').checked = product.active !== false;
      currentImages = Array.isArray(product.images) ? product.images : [];
      currentVideo = product.video || '';
      renderImages();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  productList.querySelectorAll('[data-delete]').forEach((button) => {
    button.addEventListener('click', async () => {
      const confirmed = confirm('Delete this product?');
      if (!confirmed) return;

      await apiFetch(`${API}/products/${button.dataset.delete}`, { method: 'DELETE' });
      loadProducts();
    });
  });
};

const loadProducts = async () => {
  const response = await apiFetch(`${API}/products`);
  const products = await response.json();
  renderProducts(products);
};

const loadSite = async () => {
  const response = await apiFetch(`${API}/site`);
  const site = await response.json();

  setFormValue('brandName', site.brandName);
  setFormValue('tagline', site.tagline);
  setFormValue('instagram', site.instagram);
  setFormValue('whatsapp', site.whatsapp);
  setFormValue('heroTitle', site.heroTitle);
  setFormValue('heroSubtitle', site.heroSubtitle);
  setFormValue('storyTitle', site.storyTitle);
  setFormValue('storyText', site.storyText);
};

siteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = {
    brandName: document.getElementById('brandName').value,
    tagline: document.getElementById('tagline').value,
    instagram: document.getElementById('instagram').value,
    whatsapp: document.getElementById('whatsapp').value,
    heroTitle: document.getElementById('heroTitle').value,
    heroSubtitle: document.getElementById('heroSubtitle').value,
    storyTitle: document.getElementById('storyTitle').value,
    storyText: document.getElementById('storyText').value,
  };

  await apiFetch(`${API}/site`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  alert('Site content saved');
});

document.getElementById('newProductBtn').addEventListener('click', resetForm);
document.getElementById('resetFormBtn').addEventListener('click', resetForm);
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('dsLumoraAdminToken');
  showAuth();
});

document.querySelectorAll('.nav-btn').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.section).classList.add('active');
  });
});

checkAuth();
