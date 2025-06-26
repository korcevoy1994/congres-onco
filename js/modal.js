// Modal data object
const data = {
  doctors: {
    en: {
      title: 'Doctors',
      price: '3000 Lei',
      description: 'Doctors and oncology specialists, society members',
    },
    ro: {
      title: 'Medici',
      price: '3000 Lei',
      description: 'Medici și specialiști în oncologie, membri ai societății',
    },
    formId: 'form-doctors'
  },
  students: {
    en: {
      title: 'Students',
      price: '1000 Lei',
      description: 'Residents, PhD students, and students',
    },
    ro: {
      title: 'Studenți',
      price: '1000 Lei',
      description: 'Rezidenți, doctoranzi și studenți',
    },
    formId: 'form-students'
  },
  nurses: {
    en: {
      title: 'Nurses',
      price: '1000 Lei',
      description: 'Nurses and other medical staff',
    },
    ro: {
      title: 'Asistenți medicali',
      price: '1000 Lei',
      description: 'Asistenți medicali și alt personal medical',
    },
    formId: 'form-nurses'
  },
  nonmembers: {
    en: {
      title: 'Non-members',
      price: '4000 Lei',
      description: 'Non-members of the society',
    },
    ro: {
      title: 'Non-membri',
      price: '4000 Lei',
      description: 'Non-membri ai societății',
    },
    formId: 'form-nonmembers'
  },
  becameMember: {
    en: {
      title: 'Become a Member',
      price: '200 Lei',
      description: '',
    },
    ro: {
      title: 'Devino membru',
      price: '200 Lei',
      description: '',
    },
    formId: 'form-became-member'
  },
  lostId: {
    en: {
      title: 'Lost your Member ID?',
      price: '',
      description: 'Please enter your IDNP and your Member ID will be sent to your email.',
    },
    ro: {
      title: 'Ați pierdut ID-ul de membru?',
      price: '',
      description: 'Introduceți IDNP-ul și ID-ul de membru va fi trimis la emailul dumneavoastră.',
    },
    formId: 'form-lost-id'
  }
};

// Current language detection
let currentLanguage = 'en';

// Function to detect current language
function detectLanguage() {
  const path = window.location.pathname;
  if (path.includes('ro.html')) {
    currentLanguage = 'ro';
  } else {
    currentLanguage = 'en';
  }
}

// Modal elements
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalDescription = document.getElementById('modal-description');
const modalFormContainer = document.getElementById('modal-form-container');
const modalClose = document.getElementById('modal-close');

// Function to open modal
function openModal(category) {
  const categoryData = data[category];
  if (!categoryData) return;

  const langData = categoryData[currentLanguage];
  
  // Set modal content
  modalTitle.textContent = langData.title;
  modalPrice.textContent = langData.price;
  modalDescription.textContent = langData.description;
  
  // Add form content first
  const formElement = document.getElementById(categoryData.formId);
  if (formElement) {
    const formClone = formElement.cloneNode(true);
    formClone.style.display = 'block';
    modalFormContainer.innerHTML = '';
    modalFormContainer.appendChild(formClone);
    
    // Try to populate form from sessionStorage
    const savedUserData = JSON.parse(sessionStorage.getItem('userData'));
    const savedTicketType = sessionStorage.getItem('ticketType');
    
    // Check if the saved data is for the current modal
    if (savedUserData && savedTicketType === langData.title) {
      for (const key in savedUserData) {
        const input = formClone.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = savedUserData[key];
        }
      }
    }
    
    // Add form submission handler
    const form = formClone.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => handleFormSubmit(e, category));

      const lostIdBtn = form.querySelector('#lost-id-btn');
      if (lostIdBtn) {
        lostIdBtn.addEventListener('click', () => {
          openModal('lostId');
        });
      }
    }
  }
  
  // Show modal after content is ready
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

// Function to close modal
function closeModal() {
  // Hide modal without clearing content
  modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// Function to handle form submission
function handleFormSubmit(e, category) {
  e.preventDefault();

  if (category === 'lostId') {
    // The user requested to make this form do nothing on submission for now.
    return;
  }

  const formData = new FormData(e.target);
  const userData = {};
  for (let [key, value] of formData.entries()) {
    userData[key] = value;
  }

  // Определяем тип билета и цену
  const ticketType = modalTitle.textContent;
  const ticketPrice = modalPrice.textContent;

  sessionStorage.setItem('ticketType', ticketType);
  sessionStorage.setItem('ticketPrice', ticketPrice);
  sessionStorage.setItem('userData', JSON.stringify(userData));

  window.location.href = 'checkout.html';
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  detectLanguage();
  
  // Add click handlers to registration buttons
  const buttons = ['doctors', 'students', 'nurses', 'nonmembers', 'became-member'];
  
  buttons.forEach(category => {
    const button = document.getElementById(category);
    if (button) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        if (category === 'became-member') {
          openModal('becameMember');
        } else {
          openModal(category);
        }
      });
    }
  });
  
  // Close modal on backdrop click
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', closeModal);
  }
  
  // Close modal on close button click
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
});

// Language switching functionality
function switchLanguage(lang) {
  currentLanguage = lang;
  
  // If modal is open, refresh its content
  if (!modal.classList.contains('hidden')) {
    // Find which category is currently open
    const currentTitle = modalTitle.textContent;
    let currentCategory = null;
    
    for (const [category, categoryData] of Object.entries(data)) {
      if (categoryData.en.title === currentTitle || categoryData.ro.title === currentTitle) {
        currentCategory = category;
        break;
      }
    }
    
    if (currentCategory) {
      openModal(currentCategory);
    }
  }
}

// Export for global access
window.switchLanguage = switchLanguage; 