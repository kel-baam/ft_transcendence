export function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerText = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '50px';
    notification.style.left = '77.5%';
    notification.style.width = '500px';
    notification.style.height = '100px'; 
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = '#ffe6e6';
    notification.style.color = '#EA5050';
    notification.style.paddingLeft = '30px';
    notification.style.borderRadius = '5px';
    notification.style.fontSize = '17px';
    notification.style.fontFamily = 'myFont';
    notification.style.letterSpacing = '2px';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.opacity = '1';
    notification.style.transition = 'opacity 1s ease-in-out, background-color 2s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.backgroundColor = '#FFB3B3';
    }, 5555);
    
    setTimeout(() => {
        notification.remove();
    }, 12000);
}


export function highlightInvalidInput(formElement){
    const inputs = formElement.querySelectorAll('input, select, textarea');
    inputs.forEach(input =>
    {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        if (input.value === '')
        {
            input.style.borderColor = 'red';
            input.style.backgroundColor = '#ffe6e6';
            input.focus();
        }
    });
}