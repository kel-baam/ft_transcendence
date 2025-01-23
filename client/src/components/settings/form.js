import{createApp, defineComponent, DOM_TYPES, h,
    hFragment, hSlot, hString,RouterOutlet} from '../../package/index.js'
import { customFetch } from '../../package/fetch.js'

const nationalities = [
            'Afghan', 'Albanian', 'Algerian', 'American', 'Andorran', 'Angolan',
            'Antiguans', 'Argentinean', 'Armenian', 'Australian', 'Austrian',
            'Azerbaijani', 'Bahamian', 'Bahraini', 'Bangladeshi', 'Barbadian',
            'Barbudans', 'Batswana', 'Belarusian', 'Belgian', 'Belizean',
            'Beninese', 'Bhutanese', 'Bolivian', 'Bosnian', 'Brazilian', 'British',
            'Bruneian', 'Bulgarian', 'Burkinabe', 'Burmese', 'Burundian', 'Cambodian',
            'Cameroonian', 'Canadian', 'Cape Verdean', 'Central African', 'Chadian',
            'Chilean', 'Chinese', 'Colombian', 'Comoran', 'Congolese', 'Costa Rican',
            'Croatian', 'Cuban', 'Cypriot', 'Czech', 'Danish', 'Djibouti', 'Dominican',
            'Dutch', 'East Timorese', 'Ecuadorean', 'Egyptian', 'Emirian', 'Equatorial Guinean',
            'Eritrean', 'Estonian', 'Ethiopian', 'Fijian', 'Filipino', 'Finnish', 'French',
            'Gabonese', 'Gambian', 'Georgian', 'German', 'Ghanaian', 'Greek', 'Grenadian',
            'Guatemalan', 'Guinea-Bissauan', 'Guinean', 'Guyanese', 'Haitian', 'Herzegovinian',
            'Honduran', 'Hungarian', 'I-Kiribati', 'Icelander', 'Indian', 'Indonesian', 'Iranian',
            'Iraqi', 'Irish',  'Italian', 'Ivorian', 'Jamaican', 'Japanese', 'Jordanian',
            'Kazakhstani', 'Kenyan', 'Kittian and Nevisian', 'Kuwaiti', 'Kyrgyz', 'Laotian', 'Latvian',
            'Lebanese', 'Liberian', 'Libyan', 'Liechtensteiner', 'Lithuanian', 'Luxembourger',
            'Macedonian', 'Malagasy', 'Malawian', 'Malaysian', 'Maldivian', 'Malian', 'Maltese',
            'Marshallese', 'Mauritanian', 'Mauritian', 'Mexican', 'Micronesian', 'Moldovan',
            'Monacan', 'Mongolian', 'Moroccan', 'Mosotho', 'Motswana', 'Mozambican', 'Namibian',
            'Nauruan', 'Nepalese', 'New Zealander', 'Ni-Vanuatu', 'Nicaraguan', 'Nigerian',
            'Nigerien', 'North Korean', 'Northern Irish', 'Norwegian', 'Omani', 'Pakistani',
            'Palauan', 'Panamanian', 'Papua New Guinean', 'Paraguayan', 'Peruvian', 'Polish',
            'Portuguese', 'Qatari', 'Romanian', 'Russian', 'Rwandan', 'Saint Lucian', 'Salvadoran',
            'Samoan', 'San Marinese', 'Sao Tomean', 'Saudi', 'Scottish', 'Senegalese', 'Serbian',
            'Seychellois', 'Sierra Leonean', 'Singaporean', 'Slovakian', 'Slovenian', 'Solomon Islander',
            'Somali', 'South African', 'South Korean', 'Spanish', 'Sri Lankan', 'Sudanese', 'Surinamer',
            'Swazi', 'Swedish', 'Swiss', 'Syrian', 'Taiwanese', 'Tajik', 'Tanzanian', 'Thai', 'Togolese',
            'Tongan', 'Trinidadian or Tobagonian', 'Tunisian', 'Turkish', 'Tuvaluan', 'Ugandan',
            'Ukrainian', 'Uruguayan', 'Uzbekistani', 'Venezuelan', 'Vietnamese', 'Welsh', 'Yemenite',
            'Zambian', 'Zimbabwean'
]

export const Form = defineComponent({
    state()
    {
        return {
            isLoading : true,
            data : {},
            erros : {}
        }
    },
    render ()
    {
        const {data , isLoading, erros} = this.state
        const formData = new FormData();
        if (isLoading)
            h('div', {}, [" is loading .........."])
        return h('div',
                    {},
                    [h('form',{ on  : {
                        submit : (event)=>
                        {
                            event.preventDefault()
                         
                            for (let [key, value] of formData.entries()) {
                                console.log(`${key}:`, value);
                            }
                            customFetch('http://localhost:3000/api/user/', {
                                method : 'PUT',
                                body : formData
                            }
                           )
                            .then(result =>{
                    
                                if (!result.status == 401)
                                    this.appContext.router.navigateTo('/login')
                                if (!result.ok) {
                                    return result.json().then(errs => {
                                        console.log(">>>>>>>>>>>>>> err : ", errs)
                                        // this.updateState({
                                        //     isLoading: false,
                                        //     // data: null, // Clear data in case of an error
                                        //     errors: errs, // Error details from the response
                                        // });
                                        document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
                                        for (const [field, messages] of Object.entries(errs)) {
                                            console.log(">>>>>>>>>>>>>>>>>> here  : ", `${field}_error`)
                                            const errorElement = document.getElementById(`${field}_error`);
                                            if (errorElement) {
                                                console.log(">>>>>>>>>>>>>>> here the element", errorElement)
                                                errorElement.style.color = '#D44444'
                                                errorElement.textContent = '* ' + messages;
                                                console.log(">>>>>>>>>>>>> errorElement.textContent : ", errorElement.textContent)
                                            }
                                        }
                                        throw new Error(`HTTP Error: ${result.status}`); // To exit the chain
                                    });
                                }
                                return result.json()
                            })
                            .then(res =>{
                                console.log("res is okey")
                                console.log(">>>>>>>>>>>>>>>>>>>>> res here : ", res)
                                document.querySelectorAll(".error").forEach((el) => (el.textContent = ""));
                                this.updateState({
                                        isLoading: false,  
                                        data: res,   
                                        error: null   
                                });
                                
                    
                            })
                            .catch(error => {
                            //     this.updateState({
                            //         isLoading: false,  
                            //         data: data,   
                            //         error: error  
                            // });
                            })
                        }
                    }
                },
                        [
                            h('div', {style : {
                                position: 'relative',
                                width: '100%',       
                                height: '100%'}},[
                            h('img', { src: `http://localhost:8001${data.picture}` , alt: 'profile picture', class: 'profile-pic',
                                id : 'profile-pic',
                                style : {
                                    'object-fit': 'cover'  
                                }
                            }), 
                            h('i', { class: 'fa-solid fa-camera', style: {color: '#5293CB', fontSize : '20px',
                                    position: 'absolute', 
                                    bottom: '7%',         
                                    left : '54.5%'        
                                    } ,
                                    on : {
                                        click : () => document.getElementById('file-input').click()
                                    }
                                }),
                            h('input', {
                                type: 'file',
                                id: 'file-input',
                                style: { display: 'none' }, 
                                accept: 'image/*', 
                                name : 'picture' ,
                                on : {
                                    change : (event)=> 
                                        {
                                            const fileInput = document.getElementById("file-input")
                                            const file = fileInput.files[0]
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (e) =>
                                                document.getElementById('profile-pic').src = e.target.result
                                                reader.readAsDataURL(file);
                                                formData.append(event.target.name, file)
                                            }
                                        }
                                }
                                })
                        ]),
                            h('div', {},[
                                    h('div',{},
                                        [
                                            h('label', { for: 'fname' }, ['First name:']),
                                            h('small', {class : 'error', id : "first_name_error"}),
                                            h('input', { type: 'text', id: 'fname', name: 'first_name', value: `${data.first_name}`,
                                                on : {
                                                        change : (event)=>  formData.append(event.target.name, event.target.value)       
                                                }
                                            }),
                                            h('br'),
                                            h('label', { for: 'Username' }, ['Username:']),
                                            h('small', {class : 'error', id : "username_error"}),
                                            h('input', { type: 'text', id: 'username', name: 'username', value: `${data.username}` ,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            }),
                                            h('br'),
                                            h('label', { for: 'pnumber' }, ['Phone number:']),
                                            h('small', {class : 'error', id : "phone_number_error"}),
                                            h('input', { type: 'text', id: 'pnumber', name: 'phone_number', value: `${data.phone_number}`,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            }),
                                            h('br'),
                                            h('label', { for: 'email' }, ['E-mail:']),
                                            h('small', {class : 'error', id : "email_error"}),
                                            h('input', { type: 'text', id: 'email', name: 'email', value: `${data.email}` ,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            }),                                  
                                            h('br')
                                        ]
                                    ),
                                    h('div',{},
                                        [
                                            h('label', { for: 'lname' }, ['Last name:']),
                                            h('small', {class : 'error', id : "last_name_error"}),
                                            h('input', { type: 'text', id: 'last_name', name: 'last_name', value: `${data.last_name}` ,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            }),
                                            h('br'),
                                            h('label', { for: 'age' }, ['Age:']),
                                            h('small', {class : 'error', id : "age_error", }),
                                            h('input', { type: 'text', id: 'age', name: 'age', value: `${data.age}`,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            }),
                                            h('br'),
                                            h('label', { for: 'nationality' }, ['Nationality:']),
                                            // h('small', {class : 'error', id : "nationality_error"}),
                                            h('select',
                                                { name: 'nationality', id: 'nationality', value : `${data.nationality}` ,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                }     
                                            },
                                                nationalities.map((nat) =>
                                                    h('option', { value: nat }, [nat]),
                                            )
                                            ),
                                            h('br'),
                                            h('label', { for: 'gender' }, ['Gender:']),
                                            // h('small', {class : 'error', id : "gender_error"}),
                                            h('select',
                                                { name: 'gender', id: 'gender', value:`${data.gender}` ,
                                                on : {
                                                    change : (event)=>  formData.append(event.target.name, event.target.value)
                                                } 
                                            },
                                            [
                                                h('option', { value: 'Female' }, ['Female']),
                                                h('option', { value: 'Male' }, ['Male'])
                                            ]
                                            ),
                                            h('br')
                                        ]
                                    )
                                ]
                            ),
                            h('div',{},
                                [
                                    h('button', { type : 'submit'}, ['Submit'])
                                ]
                            )
                        ])
                    ])
                
    },
    onMounted()
    {
        
        customFetch('http://localhost:3000/api/user')
        .then(result =>{

            if (!result.status == 401)
            {
                console.log("res isn't okey ," , " | ", this)
                
                this.appContext.router.navigateTo('/login')
            }

            return result.json()
        })
        .then(res =>{
            console.log(">>>>>>>>>>>>>>> res : ", res,"|",res.status)
            console.log("res is okey")
            this.updateState({
                    isLoading: false,  
                    data: res,   
                    error: null   
            });

        })
        .catch(errors => {
            this.updateState({
                isLoading: false,  
                data: {},   
                errors: this.state.errors  
            });
            // for()
            console.log(">>>>>>>>>>>> error : ", errors)
        })
      
    }
})