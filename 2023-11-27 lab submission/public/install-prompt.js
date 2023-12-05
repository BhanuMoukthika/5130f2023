

document.addEventListener('DOMContentLoaded', (event) => {

 let deferredPrompt;

 const buttonInstall = document.getElementById('buttonInstall');

 if (buttonInstall) {

   window.addEventListener('beforeinstallprompt', (e) => {

     // Prevent the mini-infobar from appearing on mobile

     e.preventDefault();

     // Stash the event so it can be triggered later.

     deferredPrompt = e;

     // Update UI to notify the user they can install the PWA

     buttonInstall.style.display = 'block';

   });

   buttonInstall.addEventListener('click', (e) => {

     // Hide the install button since the prompt is being shown

     e.target.style.display = 'none';

     // Show the install prompt

     deferredPrompt.prompt();

     // Wait for the user to respond to the prompt

     deferredPrompt.userChoice.then((choiceResult) => {

       if (choiceResult.outcome === 'accepted') {

         console.log('User accepted the install prompt');

       } else {

         console.log('User dismissed the install prompt');

       }

       deferredPrompt = null;

     });

   });

 }

 window.addEventListener('appinstalled', (evt) => {

   console.log('a2hs installed');

 });

});