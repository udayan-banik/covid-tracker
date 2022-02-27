var info_input = document.getElementsByTagName("input");

var token_input = document.getElementById("token_input");

// var mobile_num = info_input.elements.mobilenumber.value;
// var otp = info_input.elements.otp.value;
// var ref_id = info_input.elements.ref_id.value;
var btn_1 = document.getElementById("my-btn-1");
var btn_2 = document.getElementById("my-btn-2");
var toggle_bttn = document.getElementById("toggle-bttn");

var tokenArea = document.getElementById("bearer-token");

var hasToken = false;

var otpGenerated = false;
var otpConfirmed = false;

btn_1.disabled = true;
btn_2.disabled = true;

var params = {"mobile": "9876543210"};

var confirmation = {
    "otp": "digestHex",
    "txnId": "8fd4fa0d-5488-4741-9e0d-f68d3924"
}

var bearerToken = {
  "token":"klDSUFSWSIsInVzZXJfaWQiOiI3MDhjNzE3NS05MGQwLTRmOGMtOTAxNC1jMzZhNzRhM2QyMGIiLCJtb2JpbGVfbnVtYmVyIjo3MDA1MjAxNjMwLCJiZW5lZmljaWFyeV9yZWZlcmVuY2VfaWQiOjI3NTk0MDgwMTI4NTkwLCJ0eG5JZCI6IjhmZDRmYTBkLTU0ODgtNDc0MS05ZTBkLWY2OGQzOTI0MjY2ZCIsImlhdCI6MTYyNDM3NzExMSwiZXhwIjoxNjI0Mzc4MDExfQ.X4i9rXpy-otN37ycBHHfqeMWlYTTod-RBl8LjVcXbic"
}

function generateOTP() {
    var mobile_num = info_input[0].value;

    params.mobile = mobile_num;

    console.log(JSON.stringify(params));
    
    // Generate OTP
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP", true);
    xhttp.setRequestHeader("content-type", "application/json;charset=UTF-8");
    xhttp.responseType = 'json';
    xhttp.onload = function() {
         console.log(xhttp.response);
         if (xhttp.status === 200) {
            // console.log("Hoise re");
            // console.log(xhttp.response.txnId);
            confirmation.txnId = xhttp.response.txnId;
            // console.log(confirmation.txnId);
            btn_1.disabled = false;

         }
         else if (xhttp.status === 400) {
             alert("OTP already sent");
         } else {
             alert("Something went wrong");
         }
    };
    xhttp.send(JSON.stringify(params));

}

async function confirmOTP() {
    var otp = info_input[1].value;

    //encrypt OTP
    var enteredValue = otp;
      
    async function digestMessage(message) {
        const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
        const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
        return hashHex;
    }
  
    const digestHex = await digestMessage(enteredValue);
    console.log(digestHex);

    confirmation.otp = digestHex;

    //OTP to confirm to get the bearer token
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP", true);
    xhr.setRequestHeader("content-type", "application/json;charset=UTF-8");
    xhr.responseType = 'json';
    xhr.onload = function() {
        console.log(xhr.response);
        alert("Please keep the token for future reference. Do not share with anyone. It will be valid for 3 minutes.");
        if (xhr.status === 200) {
            console.log("Hoise re");
            console.log(xhr.response.token);
            bearerToken.token = xhr.response.token;
            tokenArea.value = xhr.response.token;
            console.log(bearerToken.token);
            btn_2.disabled = false;
        }
        else
            alert("something went wrong");
        };
    xhr.send(JSON.stringify(confirmation));

}

function generateCertificate() {
    var ref_id = info_input[2].value;

    var req = new XMLHttpRequest();
    req.open("GET", "https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id="+ref_id, true);
    req.setRequestHeader("content-type", "application/json;charset=UTF-8");
    req.setRequestHeader("authorization", "Bearer " + bearerToken.token);
    req.responseType = "arraybuffer";
    req.onload = function() {
        console.log(req.response);
        if (req.status === 200) {
            var blob = [];
            blob.push(req.response);
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(new File(blob, {type: "application/pdf"}));
            link.download = "certificate" /*+ new Date().getTime()*/ + ".pdf";
            document.body.appendChild(link);
            link.click();
        } else {
            alert("something went wrong");
        }
    };
    req.send();
}

function certificateViaToken() {
    bearerToken.token = tokenArea.value;
    var ref_id = token_input.value;
    
    var req = new XMLHttpRequest();
    req.open("GET", "https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id="+ref_id, true);
    req.setRequestHeader("content-type", "application/json;charset=UTF-8");
    req.setRequestHeader("authorization", "Bearer " + bearerToken.token);
    req.responseType = "arraybuffer";
    req.onload = function() {
        console.log(req.response);
        if (req.status === 200) {
            var blob = [];
            blob.push(req.response);
            var link = document.createElement("a");
            link.href = window.URL.createObjectURL(new File(blob, {type: "application/pdf"}));
            link.download = "certificate.pdf";
            document.body.appendChild(link);
            link.click();
        } else {
            alert("something went wrong");
        }
    };
    req.send();
}

function toggleCertDownload() {
    const viaotps = document.querySelectorAll(".viaOTP");
    for (let i=0; i<viaotps.length; i++) {
        viaotps[i].classList.toggle("invisible");
    }
    const viatokens = document.querySelectorAll(".viaToken");
    for (let i=0; i<viatokens.length; i++) {
        viatokens[i].classList.toggle("invisible");
    }

    if (!hasToken) {
        toggle_bttn.textContent = "via OTP";
        hasToken = true;
    } else {
        toggle_bttn.textContent = "via Token";
        hasToken = false;
    }
}
