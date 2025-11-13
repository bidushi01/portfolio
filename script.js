let navToggler, aside, navLinks, sections;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    navToggler = document.querySelector('.nav-toggler');
    aside = document.querySelector('.aside');
    navLinks = document.querySelectorAll('.nav li a');
    sections = document.querySelectorAll('.section');
    
    // Ensure all sections are visible on load
    sections.forEach(section => {
        section.classList.remove('hidden');
    });
    
    // Navigation Toggler
    if (navToggler) {
        navToggler.addEventListener('click', () => {
            aside.classList.toggle('open');
            navToggler.classList.toggle('open');
        });
    }
    
    // Navigation Links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get the target section
            const target = link.getAttribute('href').substring(1);
            
            // Scroll to the target section
            const targetSection = document.getElementById(target);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            
            // Close mobile nav if open
            if (window.innerWidth <= 991) {
                aside.classList.remove('open');
                navToggler.classList.remove('open');
            }
        });
    });
});

// Download CV Button Functionality
document.addEventListener('DOMContentLoaded', () => {
    const hireMeBtns = document.querySelectorAll('.hire-me');

    // Hire Me buttons
    hireMeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Scroll to contact section or show contact modal
            const contactSection = document.querySelector('#contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // If contact section doesn't exist, show alert
                alert('Contact section not found. Please add a contact section with id="contact"');
            }
        });
    });
});

// Typing Animation for the profession text
const typingElement = document.querySelector('.typing');
if (typingElement) {
    const professions = ['Student', 'Web Developer'];
    let professionIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentProfession = professions[professionIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = 100;
        
        if (isDeleting) {
            typeSpeed /= 2;
        }
        
        if (!isDeleting && charIndex === currentProfession.length) {
            typeSpeed = 2000; // Wait at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            professionIndex = (professionIndex + 1) % professions.length;
            typeSpeed = 500; // Wait before typing next
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start the typing animation
    setTimeout(typeWriter, 1000);
}

// Scroll-based navigation highlighting (only for visible sections)
window.addEventListener('scroll', () => {
    let current = '';
    const visibleSections = document.querySelectorAll('.section');
    const allNavLinks = document.querySelectorAll('.nav li a');
    
    visibleSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    if (!current && visibleSections.length) {
        current = visibleSections[0].getAttribute('id');
    }

    // Update active state
    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Theme Switcher Functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeOptions = document.querySelectorAll('.theme-option');
    const body = document.body;
    
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('selected-theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        // Update active theme option
        themeOptions.forEach(option => {
            if (option.getAttribute('data-theme') === savedTheme) {
                option.classList.add('active');
            }
        });
        // Load the saved theme CSS
        loadThemeCSS(savedTheme);
    } else {
        // Default to color-1
        body.setAttribute('data-theme', 'color-1');
        themeOptions[0].classList.add('active');
        loadThemeCSS('color-1');
    }
    
    // Theme option click handlers
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedTheme = option.getAttribute('data-theme');
            
            // Remove active class from all options
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            option.classList.add('active');
            
            // Apply theme to body
            body.setAttribute('data-theme', selectedTheme);
            
            // Save theme preference
            localStorage.setItem('selected-theme', selectedTheme);
            
            // Load the corresponding CSS file
            loadThemeCSS(selectedTheme);
        });
    });
    
    // Function to load theme CSS files
    function loadThemeCSS(theme) {
        // Remove existing theme CSS links
        const existingThemeCSS = document.querySelectorAll('link[href*="color-"]');
        existingThemeCSS.forEach(link => {
            if (link.href.includes('color-')) {
                link.remove();
            }
        });
        
        // Add new theme CSS
        const themeCSS = document.createElement('link');
        themeCSS.rel = 'stylesheet';
        themeCSS.href = `${theme}.css`;
        document.head.appendChild(themeCSS);
    }
});
