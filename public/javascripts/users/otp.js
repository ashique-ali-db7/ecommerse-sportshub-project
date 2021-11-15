


document.addEventListener("DOMContentLoaded", function (event) {

    function OTPInput() {
        const inputs = document.querySelectorAll('#otp > *[id]');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener('keydown', function (event) {
                if (event.key === "Backspace") {
                    inputs[i].value = '';
                    if (i !== 0) inputs[i - 1].focus();
                }
                else {
                    if (i === inputs.length - 1 && inputs[i].value !== '') { return true; }
                    else if (event.keyCode > 47 && event.keyCode < 58) {
                        inputs[i].value = event.key;
                        if (i !== inputs.length - 1)
                            inputs[i + 1].focus();
                        event.preventDefault();
                    }
                    else if (event.keyCode > 64 && event.keyCode < 91) {
                        inputs[i].value = String.fromCharCode(event.keyCode);
                        if (i !== inputs.length - 1) inputs[i + 1].focus();
                        event.preventDefault();
                    }
                }
            });
        }
    } OTPInput();
});



  




let timerOn = true;

function timer(remaining) {
  var m = Math.floor(remaining / 60);
  var s = remaining % 60;
  
  m = m < 10 ? '0' + m : m;
  s = s < 10 ? '0' + s : s;
  document.getElementById('timer').innerHTML = m + ':' + s;
  remaining -= 1;
  
  if(remaining >= 0 && timerOn) {
    setTimeout(function() {
        timer(remaining);
    }, 1000);
    return;
  }

  if(!timerOn) {
    // Do validate stuff here
    return;
  }
  
document.getElementById("otprequest").classList.remove("otprequest");
document.getElementById("otprequest").classList.add("timer");
}




timer(60);





function otpform(){

    var first = document.getElementById("first").value;
        var second = document.getElementById("second").value;
        var third = document.getElementById("third").value;
         var fourth = document.getElementById("fourth").value;
         var fifth = document.getElementById("fifth").value;
         var sixth= document.getElementById("sixth").value;

         var otpnumber = first+second+third+fourth+fifth+sixth
         var phoneNumber = document.getElementById("phonnumber").value;


$.ajax({
    url:'/otplogin?phonenumber='+phoneNumber+'&otpnumber='+otpnumber,
    method:'get',
    success:(response)=>{
        if(response){
            window.location.replace("/");
        }else{
            document.getElementById("error").classList.remove("otperror");
        }
    }
})


}










function otpformforpasswordchange(){

    var first = document.getElementById("first").value;
        var second = document.getElementById("second").value;
        var third = document.getElementById("third").value;
         var fourth = document.getElementById("fourth").value;
         var fifth = document.getElementById("fifth").value;
         var sixth= document.getElementById("sixth").value;

         var otpnumber = first+second+third+fourth+fifth+sixth
         var phoneNumber = document.getElementById("phonnumber").value;


$.ajax({
    url:'/otploginforpassword?phonenumber='+phoneNumber+'&otpnumber='+otpnumber,
    method:'get',
    success:(response)=>{
        if(response){
            window.location.replace("/passwordchange?phonenumber="+phoneNumber);
         
        }else{
            document.getElementById("error").classList.remove("otperror");
        }
    }
})


}



