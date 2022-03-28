
var url="{% url 'home/goToPayment' %}"
var acc= document.getElementById('auth');
let numbers=[1,2,3,4,5,6,7,8,9,0]
let payerAlias=0;

var formatnmb = function (nmb) {
  let formattedNMB;
  if(nmb[0]+nmb[1]+nmb[3]=="467"){
    for (let i = 0; i < nmb.length; i++) {
      if (numbers.includes(nmb[i])) {
        formattedNMB+=nmb[i];
      }
  
    }
    return formattedNMB
  }
}

var updateInputs = function () {
  var input1 = document.getElementById('payerAlias');
  payerAlias = input1.value;
  console.log(payerAlias);
  document.getElementsByClassName('phone-form').submit();
}




let xhr = new XMLHttpRequest();
xhr.open("POST", url);

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {

  if (xhr.readyState === 4) {
      console.log(xhr.responseText);
   }};




/*
async function createPaymentRequest(amount, message, payerAlias) {
    const instructionUUID = createId();
  
    const data = {
      payeeAlias: '1231111111',
      currency: 'SEK',
      callbackUrl: 'https://your-callback-url.com',
      amount,
      message,
      payerAlias
    };
  
    try {
      const response = await client.put(
        `https://mss.cpc.getswish.net/swish-cpcapi/api/v2/paymentrequests/${instructionUUID}`,
        data
      );
  
      if (response.status === 201) {
        return { id: instructionUUID };
      }
    } catch (error) {
      console.error(error);
    }
  }*/
  
  