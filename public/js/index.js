        const sidenav = document.querySelector('.sidenav'); 
        M.Sidenav.init(sidenav, {});  


        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.slider');
            var instances = M.Slider.init(elems, {
                indicators: false, 
                height: 780,
                transition: 500, 
                interval: 4000
            });
        });

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelector('.dropdown-trigger');
            var instances = M.Dropdown.init(elems, {});
        });

        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.scrollspy');
            var instances = M.ScrollSpy.init(elems, {});
        });