document.addEventListener("DOMContentLoaded", function() {
    feather.replace();

    // Konten Navbar Index
    const navbarNav = document.getElementById('navbarNav');
    const navItems = [
        { name: 'Beranda', link: 'index.html' },
        { name: 'Profil', link: 'profil.html' },
        { name: 'Info PSB', link: 'psb.html' },
        { name: 'Kontak', link: 'index.html#contact' },
        {name : 'Login/Daftar', link : 'login.html'}
    ];

    navItems.forEach(item => {
        if (item.dropdown) {
            createDropdown(item, navbarNav);
        } else {
            createLink(item, navbarNav);
        }
    });
    document.getElementById('navbarNav').addEventListener('click', function() {
        fetch('/check-login')
            .then(response => response.json())
            .then(data => {
                if (data.loggedIn) {
                    window.location.href = '#';
                } else {
                    window.location.href = '/login.html';
                }
            });
    });
    

    

    // Dark Mode Toggle
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        modeToggle.innerHTML = document.body.classList.contains('dark-mode') ? 
                               feather.icons['sun'].toSvg() : 
                               feather.icons['moon'].toSvg();
    });

    // Hamburger Menu 
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navbarNav');
    hamburgerMenu.addEventListener('click', function(event) {
        navMenu.classList.toggle('active');
        event.stopPropagation();
    });

    // Close Navbar
    document.addEventListener('click', function(event) {
        if (!navbarNav.contains(event.target) && !hamburgerMenu.contains(event.target)) {
            navMenu.classList.remove('active');
        }
    });

    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        console.log('Form Submitted', data);

        const whatsappNumber = '6287884877800';
        const message = `Pesan dari ${data['name']} (${data['email']})\n\n${data['Pesan']}`;
        const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappURL, '_blank');

        contactForm.reset();
        alert('Pesan Anda telah terkirim!');
    });
});

function createLink(item, navbarNav) {
    const link = document.createElement('a');
    link.href = item.link;
    link.textContent = item.name;
    navbarNav.appendChild(link);
}
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Sample username and password for demonstration
    const validUsername = 'admin';
    const validPassword = 'password123';

    if (username === validUsername && password === validPassword) {
        alert('Login successful!');
        // Redirect to index.html
        window.location.href = 'admin.html';
    } else {
        errorMessage.textContent = 'Invalid username or password.';
        errorMessage.style.display = 'block';
    }
});
