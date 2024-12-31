

export function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerText = message;
    
    notification.style.position = 'fixed';
    notification.style.top = '50px';
    notification.style.left = '86%';
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
    const inputs = document.body.querySelectorAll('input','placeholder');
    console.log("ooojk,",inputs)
    inputs.forEach(input =>
    {
        input.style.borderColor = '';
        input.style.backgroundColor = '';
        
        if (input.value === '')
        {
            input.style.borderColor = 'red';
            input.style.backgroundColor = 'rgba(255, 0, 0, 0.2)';
            input.focus();
        }
    });
}


export function showSuccessNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerText = message;

    // Styling the notification
    notification.style.position = 'fixed';
    notification.style.top = '50px';
    notification.style.left = '86%';
    notification.style.width = '500px';
    notification.style.height = '100px';
    notification.style.transform = 'translateX(-50%)';
    notification.style.background = '#e6ffe6'; // Light green background
    notification.style.color = '#50A050'; // Green text color
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

    // Add the notification to the document
    document.body.appendChild(notification);

    // Animate the fade-out and color change
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.backgroundColor = '#B3FFB3'; // Fading to a lighter green
    }, 5555);

    // Remove the notification after it fades out
    setTimeout(() => {
        notification.remove();
    }, 12000);
}
