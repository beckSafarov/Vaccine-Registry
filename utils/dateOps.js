const Users = require('../modules/user');

function getAppointmentIntervalsFunc(user){
  let dayIntervals; 
  let currently = new Date(); 
  let passed = false; 

  if(user.date.getFullYear() === currently.getFullYear() && user.date.getMonth() === currently.getMonth()){
    dayIntervals = user.date.getDate()-currently.getDate(); 
    if(dayIntervals < 0){
      passed = true; 
    }
    dayIntervals = Math.abs(dayIntervals); 
  }else{
    dayIntervals = dateDiff('d', currently, user.date);
    if(dayIntervals < 0){
      passed = true; 
    }
    dayIntervals = Math.abs(dayIntervals); 
  }
  return {
    passed,
    dayIntervals
  }; 
}

function dateDiff(datepart, fromdate, todate){
  datepart = datepart.toLowerCase();	
  var diff = todate - fromdate;	
  var divideBy = { w:604800000, 
                  d:86400000, 
                  h:3600000, 
                  n:60000, 
                  s:1000 };	
  
  return Math.floor( diff/divideBy[datepart]);
}


class dateOps{

  async updateAppointmentIntervals(users){
    // const users = await Users.find(); 
    let newUserDetails; 

    users.forEach(async function(user){
      newUserDetails = getAppointmentIntervalsFunc(user); 
      user.dayIntervals = newUserDetails.dayIntervals; 
      user.passed = newUserDetails.passed; 
      await user.save();
    })
  }//end of the update function

  getAppointmentIntervals(user){
    return getAppointmentIntervalsFunc(user);
  }

  

  
}//end of the class 

module.exports = dateOps; 






// exports.updateAppointmentIntervals = async function(users){
//   // const users = await Users.find(); 
//   let newUserDetails; 

//   users.forEach(async function(user){
//     newUserDetails = getAppointmentIntervals2(user); 
//     user.dayIntervals = newUserDetails.dayIntervals; 
//     user.passed = newUserDetails.passed; 
//     await user.save(); 
//   })//end of the for loop 
// }

// exports.getAppointmentIntervals = function(user){
//   let dayIntervals; 
//   let currently = new Date(); 
//   let passed = false;
  
//   if(user.date.getFullYear() === currently.getFullYear() && user.date.getMonth() === currently.getMonth()){
    
//     dayIntervals = user.date.getDate()-currently.getDate(); 
//     if(dayIntervals < 0){
//       passed = true; 
//     }
//     dayIntervals = Math.abs(dayIntervals); 
//   }else{
//     dayIntervals = dateDiff('d', user.date, currently);
//     if(dayIntervals < 0){
//       passed = true; 
//     }
//     dayIntervals = Math.abs(dayIntervals); 
//   }
//   return {
//     passed,
//     dayIntervals
//   }; 
// }

// const getAppointmentIntervals2 = function(user){
//   let dayIntervals; 
//   let currently = new Date(); 
//   let passed = false; 
  
//   if(user.date.getFullYear() === currently.getFullYear() && user.date.getMonth() === currently.getMonth()){
//     dayIntervals = user.date.getDate()-currently.getDate(); 
//     if(dayIntervals < 0){
//       passed = true; 
//     }
//     dayIntervals = Math.abs(dayIntervals); 
//   }else{
//     dayIntervals = dateDiff('d', currently, user.date);
//     if(dayIntervals < 0){
//       passed = true; 
//     }
//     dayIntervals = Math.abs(dayIntervals); 
//   }
//   return {
//     passed,
//     dayIntervals
//   }; 
// }


// const dateDiff = function(datepart, fromdate, todate) {	
//   datepart = datepart.toLowerCase();	
//   var diff = todate - fromdate;	
//   var divideBy = { w:604800000, 
//                   d:86400000, 
//                   h:3600000, 
//                   n:60000, 
//                   s:1000 };	
  
//   return Math.floor( diff/divideBy[datepart]);
// }


