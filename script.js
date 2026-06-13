const products = [
  {
    name: 'JMP Sports Polo',
    image: 'https://github.com/utsavsinghthc-cmd/un-enterprises-tshirts/blob/main/JMPsportscollar.png?raw=true',
    sublimation: '₹279',
    dtf: '₹379',
    fabric: 'Premium sports polo fabric',
    sizes: 'S, M, L, XL, XXL',
    printing: 'Sublimation, DTF'
  },
  {
    name: 'JMP Max Dri Polo',
    image: 'https://github.com/utsavsinghthc-cmd/un-enterprises-tshirts/blob/main/jmpmax-dricollar.png?raw=true',
    sublimation: '₹329',
    dtf: '₹429',
    fabric: 'Max Dri performance polo fabric',
    sizes: 'S, M, L, XL, XXL',
    printing: 'Sublimation, DTF'
  },
  {
    name: 'JMP Exclusive Comfort Fit Polo',
    image: 'https://github.com/utsavsinghthc-cmd/un-enterprises-tshirts/blob/main/jmpexclusivemattycollar.png?raw=true',
    sublimation: '₹349',
    dtf: '₹449',
    fabric: 'Exclusive comfort fit matty polo fabric',
    sizes: 'S, M, L, XL, XXL',
    printing: 'Sublimation, DTF'
  },
  {
    name: 'JMP Sports Round Neck',
    image: 'https://github.com/utsavsinghthc-cmd/un-enterprises-tshirts/blob/main/jmpsportround.png?raw=true',
    sublimation: '₹209',
    dtf: '₹309',
    fabric: 'Premium sports round neck fabric',
    sizes: 'S, M, L, XL, XXL',
    printing: 'Sublimation, DTF'
  },
  {
    name: 'JMP Max Dri Round Neck',
    image: 'https://github.com/utsavsinghthc-cmd/un-enterprises-tshirts/blob/main/jmpmax-driround.png?raw=true',
    sublimation: '₹279',
    dtf: '₹379',
    fabric: 'Max Dri performance round neck fabric',
    sizes: 'S, M, L, XL, XXL',
    printing: 'Sublimation, DTF'
  }
];

function setupNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

function renderCatalog() {
  const catalog = document.querySelector('#productCatalog');
  if (!catalog) return;

  catalog.innerHTML = products.map((product, index) => `
    <article class="product-card" style="--delay:${index * 80}ms">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
      </div>
      <div class="product-body">
        <h3>${product.name}</h3>
        <ul class="product-meta">
          <li>Available Sizes: ${product.sizes}</li>
          <li>All Colors Available</li>
          <li>Premium Fabric</li>
        </ul>
        <div class="price-row">
          <span><small>Sublimation</small>${product.sublimation}</span>
          <span><small>DTF</small>${product.dtf}</span>
        </div>
        <div class="card-actions">
          <a href="https://wa.me/916386319056" class="btn" target="_blank" rel="noopener">Get Quote on WhatsApp</a>
          <button class="btn btn-outline" type="button" data-product-index="${index}">View Details</button>
        </div>
      </div>
    </article>
  `).join('');

  catalog.addEventListener('click', (event) => {
    const detailButton = event.target.closest('[data-product-index]');
    if (!detailButton) return;
    openProductModal(products[Number(detailButton.dataset.productIndex)]);
  });
}

function openProductModal(product) {
  const modal = document.querySelector('#productModal');
  const title = document.querySelector('#modalTitle');
  const image = document.querySelector('#modalImage');
  const details = document.querySelector('#modalDetails');

  if (!modal || !title || !image || !details) return;

  title.textContent = product.name;
  image.src = product.image;
  image.alt = product.name;
  details.innerHTML = `
    <li><strong>Fabric Type:</strong> ${product.fabric}</li>
    <li><strong>Available Sizes:</strong> ${product.sizes}</li>
    <li><strong>Printing Types:</strong> ${product.printing}</li>
    <li><strong>Bulk Orders Available:</strong> Yes</li>
    <li><strong>Custom Design Available:</strong> Yes</li>
  `;
  modal.hidden = false;
  document.body.classList.add('modal-open');
}

function setupModal() {
  const modal = document.querySelector('#productModal');
  if (!modal) return;

  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-close-modal]')) {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      modal.hidden = true;
      document.body.classList.remove('modal-open');
    }
  });
}

function getFirestoreDatabase() {
  if (!window.firebase || !window.UN_TEES_FIREBASE_CONFIG) return null;

  const config = window.UN_TEES_FIREBASE_CONFIG;
  if (!config.apiKey || config.apiKey.includes('YOUR_FIREBASE')) return null;

  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }

  return firebase.firestore();
}

function setupInquiryForm() {
  const form = document.querySelector('#inquiryForm');
  const status = document.querySelector('#formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const inquiry = {
      name: String(formData.get('name') || '').trim(),
      mobile: String(formData.get('mobile') || '').trim(),
      organization: String(formData.get('organization') || '').trim(),
      quantity: String(formData.get('quantity') || '').trim(),
      requirementType: String(formData.get('requirementType') || '').trim(),
      message: String(formData.get('message') || '').trim()
    };

    if (!inquiry.name) {
      alert('Name required');
      return;
    }

    if (!inquiry.mobile) {
      alert('Mobile required');
      return;
    }

    if (!/^\d{10}$/.test(inquiry.mobile)) {
      alert('Mobile must be 10 digits');
      return;
    }

    if (!inquiry.message) {
      alert('Message required');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    status.textContent = 'Sending inquiry...';
    status.className = 'form-status';

    try {
      const db = getFirestoreDatabase();
      if (!db) throw new Error('Firebase configuration is missing');

      await db.collection('inquiries').add({
        ...inquiry,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      status.textContent = '✅ Inquiry Sent Successfully. We will contact you shortly.';
      status.className = 'form-status success';
      form.reset();
    } catch (error) {
      console.error('Inquiry submission failed:', error);
      status.textContent = '❌ Failed to submit inquiry. Please try again.';
      status.className = 'form-status error';
    } finally {
      submitButton.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  renderCatalog();
  setupModal();
  setupInquiryForm();
});
