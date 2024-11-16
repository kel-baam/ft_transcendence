export function playerForm() {
    return new Promise((resolve, reject) => {
        const playerForm = document.createElement('div');
        playerForm.className = 'player-form';
        playerForm.style.width = '500px';
        playerForm.style.height = '400px';
        playerForm.style.backgroundColor = '#D9D9D9';
        playerForm.style.position = 'relative';
        playerForm.style.left = '35%';
        playerForm.style.top = '-680px';
        playerForm.style.borderRadius = '20px';

        const icon = document.createElement('i');
        icon.className = 'fa-regular fa-circle-xmark icon';
        icon.style.color = '#858484';
        icon.style.cursor = 'pointer';
        icon.style.fontSize = '24px';
        icon.style.position = 'relative';
        icon.style.left = '93%';
        icon.style.top = '10px';

        icon.onclick = () => {
            document.body.removeChild(playerForm);
            reject('Form closed by the user')
        };

        const formClass = document.createElement('form');
        formClass.className = 'form1';

        formClass.onsubmit = (event) => {
            event.preventDefault();

            const formElement1 = document.querySelector('.form1');

            if (formElement1) {
                const formData = new FormData(formElement1);
                document.body.removeChild(playerForm);
                resolve(formData);
            } else {
                reject("Form element not found!");
            }
        };


    const imageContainer = document.createElement('div');
    imageContainer.className = 'avatar';
    imageContainer.style.position = 'relative';
    imageContainer.style.left = '200px';
    imageContainer.style.top = '20px';

    const avatar = document.createElement('img');
    avatar.className = 'createAvatar';
    avatar.src = './images/people_14024721.png';
    avatar.style.width = '100px';
    avatar.style.height = '100px';
    avatar.style.borderRadius = '100%';

    const editIcon = document.createElement('div');
    editIcon.className = 'editIcon';
    editIcon.onclick = () => {
        document.getElementById('avatar-upload').click();
    };

    const input_avatar = document.createElement('input');
    input_avatar.type = 'file';
    input_avatar.id = 'avatar-upload';
    input_avatar.name = 'createAvatar';
    input_avatar.accept = 'image/*';
    input_avatar.onchange = (event) => {
        const f = event.target.files[0];
        if (f) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatar.src = e.target.result;
            };
            reader.readAsDataURL(f);
        }
    };
    input_avatar.style.display = 'none';
    editIcon.appendChild(input_avatar);

    const imageIcon = document.createElement('i');
    imageIcon.className = 'fas fa-edit icon';
    imageIcon.style.position = 'relative';
    imageIcon.style.left = '15%';
    imageIcon.style.top = '-30px';

    editIcon.appendChild(imageIcon);
    imageContainer.appendChild(avatar);
    imageContainer.appendChild(editIcon);

    const inputContainer = document.createElement('div');
    inputContainer.className = 'createInput';
    inputContainer.style.position = 'relative';
    inputContainer.style.left = '108px';
    inputContainer.style.top = '30px';

    const label = document.createElement('label');
    label.innerText = 'Nickname:';
    label.style.letterSpacing = '2px';
    label.style.fontFamily = 'myFont';
    label.style.fontSize = '15px';
    label.style.color = '#FFFFFF';
    label.style.transition = '0.3s';
    label.style.pointerEvents = 'none';
    label.style.lineHeight = '2em';

    const input = document.createElement('input');
    input.type = 'text';
    input.name = 'playerNickname';
    input.placeholder = 'Enter Nickname...';
    input.style.letterSpacing = '2px';
    input.style.fontFamily = 'myFont';
    input.style.width = '284px';
    input.style.height = '52px';
    input.style.backgroundColor = '#CBCBCB';
    input.style.fontSize = '15px';
    input.style.color = '#56748fbe';
    input.style.borderRadius = '10px';
    input.style.padding = '15px';
    input.style.border = 'none';
    input.style.cursor = 'text';
    input.style.boxSizing = 'border-box';
    input.style.marginBottom = '20px';

    const button = document.createElement('button');
    button.innerText = 'Submit';
    button.style.display = 'inline-block';
    button.style.width = '130px';
    button.style.height = '60px';
    button.style.fontFamily = 'myFont';
    button.style.color = '#D9DBBC';
    button.style.fontSize = '24px';
    button.style.background = '#D44444';
    button.style.textAlign = 'center';
    button.style.borderRadius = '20px';
    button.style.letterSpacing = '3px';
    button.style.cursor = 'pointer';
    button.style.border = 'none';
    button.style.position = 'relative';
    button.style.left = '185px';
    button.style.top = '60px';

    playerForm.appendChild(icon);
    playerForm.appendChild(formClass);
    formClass.appendChild(imageContainer);
    inputContainer.appendChild(label);
    inputContainer.appendChild(document.createElement('br'));
    inputContainer.appendChild(input);
    formClass.appendChild(inputContainer);
    formClass.appendChild(button);

    document.body.appendChild(playerForm);
    console.log("hello -> ", formClass)
});
}
