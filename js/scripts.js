 //See if the browser supports Service Workers, if so try to register one
const installApp = document.getElementById('installApp');
let installPrompt; //Variable to store the install action in
window.addEventListener("beforeinstallprompt",(event)=>{	
	event.preventDefault(); //Prevent the event (this prevents the default bar to show up)
	installPrompt=event; //Install event is stored for triggering it later
	//...do something here to show your install button
	installApp.style.display = "block";
});

installApp.addEventListener('click', async () => {
	installPrompt.prompt();
	installApp.style.display = "none";
	installPrompt.userChoice.then((choiceResult)=>{
	installApp.style.display = "none";
  if(choiceResult.outcome!=="accepted"){
	installApp.style.display = "block";
  }
  installPrompt=null;
});

});

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('service-worker.js');
  }

 if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js").then(function(registering){
      // Registration was successful
      console.log("Browser: Service Worker registration is successful with the scope",registering.scope);
    }).catch(function(error){
      //The registration of the service worker failed
      console.log("Browser: Service Worker registration failed with the error",error);
    });
  } else {
    //The registration of the service worker failed
    console.log("Browser: I don't support Service Workers :(");
  }

  //Asking for permission with the Notification API
if(typeof Notification!==typeof undefined){ //First check if the API is available in the browser
	Notification.requestPermission().then(function(result){ 
		//If accepted, then save subscriberinfo in database
		if(result==="granted"){
			console.log("Browser: User accepted receiving notifications, save as subscriber data!");
			navigator.serviceWorker.ready.then(function(serviceworker){ //When the Service Worker is ready, generate the subscription with our Serice Worker's pushManager and save it to our list
				const VAPIDPublicKey="BDUqubIN0W-KKpw8caJdci0wvTaTJJDoc00C4HaMSDNcre_qWxglIXyAZUFyhUd8oBjv71pWyMrwIe28IKhyLzc"; // Fill in your VAPID publicKey here
				const options={applicationServerKey:VAPIDPublicKey,userVisibleOnly:true} //Option userVisibleOnly is neccesary for Chrome
				serviceworker.pushManager.subscribe(options).then((subscription)=>{
          //POST the generated subscription to our saving script (this needs to happen server-side, (client-side) JavaScript can't write files or databases)
					let subscriberFormData=new FormData();
					subscriberFormData.append("json",JSON.stringify(subscription));
					fetch("data/saveSubscription.php",{method:"POST",body:subscriberFormData});
				});
			});
		}
	}).catch((error)=>{
		console.log(error);
	});
}






 

// {
//   "subject": "mailto: <kalinkov1999@gmail.com>",
//   "publicKey": "BDUqubIN0W-KKpw8caJdci0wvTaTJJDoc00C4HaMSDNcre_qWxglIXyAZUFyhUd8oBjv71pWyMrwIe28IKhyLzc",
//   "privateKey": "8ZRyWf1uVmgAigXj02gV8VY5xH1Vcb6Rkn_6zfgfk_U"
//   }