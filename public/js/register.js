        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        const number = document.getElementById('number');
        const warningBtn = document.getElementById('warning-btn');
        //date picker
        document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.datepicker');
            var instances = M.Datepicker.init(elems, {
                autoclose: true,
                disableWeekends: true,
                firstDay: 1,
                showMonthAfterYear: true,
                showDaysInNextAndPreviousMonths: true,
                showClearBtn: true,
            });
          });

          //time picker
          document.addEventListener('DOMContentLoaded', function() {
            var elems = document.querySelectorAll('.timepicker');
            var instances = M.Timepicker.init(elems, {
                twelveHour: false,
                showClearBtn: true
            });
         });

         //function to join the date and time strings and create one date variable
         const dateFormat = (date, time)=>{
            let month = date.slice(0, 3); 
            const day = parseInt(date.slice(4, 6)); 
            const year = parseInt(date.slice(8, 12)); 
            const timeValues = time.split(':');
            let hour = timeValues[0]; 
            let minutes = timeValues[1]; 
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for(let i = 0; i<monthNames.length; i++){
                if(month = monthNames[i]){
                    month = i; 
                }
            }
            month = parseInt(month); 
            
            return new Date(year, month, day, hour, minutes);  
        }

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

        //make post request with data
        document.getElementById('form').addEventListener('submit', function(e){
            e.preventDefault();
            const data = {
                name: name.value.trim(),
                email: email.value.trim(),
                date: date.value.trim(),
                time: time.value.trim(),
                number: number.value.trim(),
            }

            post(`http://localhost:5000/register`, data)
            .then(data => {
                if(data.success == false){
                    warningBtn.innerHTML = data.error;
                }else{
                    window.location.href = `http://localhost:5000/pay/${data.data._id}`;
                    warningBtn.innerHTML = '';
                }

            })
            .catch(err => console.log(err));
        })//end of the form function
        
        