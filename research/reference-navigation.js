// Navigation

(function () {
    const navigationButton = document.querySelector('.navigation-button');
    const navigationClose = document.querySelector('.navigation-close');
    const navigationMenu = document.querySelector('.navigation-menu');

    const isMenuHiddenCheck = () => {
        let attributeValue = navigationButton.getAttribute('aria-expanded');

        return attributeValue === 'true';
    };

    const handleNavigationMenuState = () => {
        const isMenuHidden = isMenuHiddenCheck();
        navigationButton.setAttribute('aria-expanded', !isMenuHidden);

        if (isMenuHidden) {
            navigationButton.setAttribute('aria-label', 'Open menu');
        } else {
            navigationButton.setAttribute('aria-label', 'Close menu');
        }

        navigationMenu.classList.toggle('navigation-menu--active');
        document.body.classList.toggle('is-modal');
    };

    navigationClose.addEventListener('click', () => {
        handleNavigationMenuState();
    });

    navigationButton.addEventListener('click', () => {
        handleNavigationMenuState();
    });
}());

// Tap
(function () {
    const buttons = document.querySelectorAll('a, button');

    buttons.forEach(function(button) {
        button.addEventListener('touchstart', function() {
            button.classList.add('active');
        });
        button.addEventListener('touchend', function() {
            button.classList.remove('active');
        });
    });
}());
