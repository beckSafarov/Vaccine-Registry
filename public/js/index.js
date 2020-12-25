
        const form = document.getElementById('form'); 
        const fullName = document.getElementById('first_name'); 
        const email = document.getElementById('email'); 
        const message = document.getElementById('textarea');
        // const warningBtn = document.getElementById('warning-btn');
        root = localStorage.getItem('root', root);  


        
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

        form.addEventListener('submit', function(e){
            // console.log(email.value); 
            // console.log(fullName.value); 
            e.preventDefault(); 
            const data = {
                name: fullName.value, 
                email: email.value,
                message: message.value
            }

            post(`${root}/email`, data)
            .then(data => {
                console.log(data); 
                // if(data.success == false){
                //     warningBtn.innerHTML = data.error;
                //     warningBtn.style.color = 'red'; 
                // }else{
                //     warningBtn.innerHTML = 'Email has been sent successfully';
                //     warningBtn.style.color = 'green'; 
                //     console.log(data); 
                    
                // }

            })
            .catch(err => console.log(err));
            
        }) //end of the form 

        //post function to make a post request to the server
        async function post(url, data){
            const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-type':'application/json'
                    },
                    body: JSON.stringify(data)
            });
            const resData = await response.json();
            return resData;
        }

