(function () {
    var options = {
        call_to_action: "Estamos Online!", // Call to action
        button_color: "#FF0000", // Color of button
        position: "right", // Position may be 'right' or 'left'
        order: "facebook,whatsapp,instagram,telegram,sms,call,email", // Order of buttons

        facebook: "", // Facebook page ID
        whatsapp: "+5513", // WhatsApp number
        
        instagram: "", // Instagram username
        telegram: "", // Telegram bot username
        sms: "", // Sms phone number
        call: "", // Call phone number
        email: "", // Email

        // viber: "123456789", // Viber number
        // snapchat: "megaboxbrasil", // Snapchat username
        // line: "//line.me/ti/p/2Y-7aApB8d", // Line QR code URL
        // vkontakte: "live", // VKontakte page name
        
    };
    var proto = document.location.protocol, host = "getbutton.io", url = proto + "//static." + host;
    var s = document.createElement('script'); 
    s.type = 'text/javascript'; 
    s.async = true;
    s.src = url + '/widget-send-button/js/init.js';
    s.onload = function () {
        WhWidgetSendButton.init(host, proto, options); 
    };
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
})();