const URL = "https://forum2022.codeschool.cloud";

var app = new Vue({
    el: "#app",
    data:{
        page: 'login',
        newName: '',
        newUsername: '',
        newPassword: '',
        loginUsername: '',
        loginPassword: ''
    },
    methods:{
        changePage: function(new_page){
            this.page = new_page;
        },
        getSession: async function() {
            let response = await fetch(`${URL}/session`, {
                method: "GET",
                // this will save the cookie. Keeping people logged in, until the cookie is deleted
                credentials: "include"
            });

            //are we logged in?
            if (response.status == 200){
                console.log("logged in");
                let data = await response.json();
                console.log("data", data);

            } else if(response.status == 401) {
                console.log('not logged in');

            } else {
                console.log('WARNING! WARNING! ERROR when GETTING/session', response.status, response);
            }
        },

        
        // POST/session - attempt login
        postSession: async function() {
            let loginCredentials = {
                username: this.loginUsername,
                password: this.loginPassword
            };
            
            
            let response = await fetch(`${URL}/session`,{
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            //parse response body
            try {
                let body = response.json();
                console.log(body);
            } catch (error){
                console.log("error with parsing body", error)
            }

            if (response.status == 201) {
                console.log("Succesful Login");
                let data = await response.json();
                this.loginUsername = '';
                this.loginPassword = '';

            } else if (response.status == 400){
                console.log("Unsuccesful Login");

                this.loginPassword = '';
            } else {
                console.log("some error when POSTING /session")
            }
        },
        postUser: async function() {
            let loginCredentials = {
                username: this.newUsername,
                password: this.newPassword,
                fullname: this.newName
            };

            response = await fetch(`${URL}/user`, {
                method: "POST",
                body: JSON.stringify(loginCredentials),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.status == 201) {
                console.log("successful login");
                data = await response.json()
                this.changePage('welcome');
                this.newUsername = '';
                this.newPassword = '';
                this.newName = '';
            } else if (response.status == 400 ){
                console.log("idk what this error could be")
            }
            
        }
    },
    //as soon as app is created, created will run
    created: function () {

        this.getSession();
    }
});