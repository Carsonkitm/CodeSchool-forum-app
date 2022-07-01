const URL = "https://forum2022.codeschool.cloud";

var app = new Vue({
    el: "#app",
    data:{
        page: 'welcome',

        newName: '',
        newUsername: '',
        newPassword: '',

        loginUsername: '',
        loginPassword: '',

        threadName: '',
        threadDescription:'',
        threadCategory:'',

        currentThread: '',
        threads: []
    },
    methods:{
        changePage: function(page){
            this.page = page;
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

                this.loadHomePage();
                return;

            } else if(response.status == 401) {
                console.log('not logged in');
                let data = await response.json();
                console.log(data);

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
            let body;
            try {
                let body = response.json();
                console.log(body);
            } catch (error){
                console.log("error with parsing body", error)
            }

            if (response.status == 201) {
                console.log("Succesful Login");
                //let data = await response.json();
                this.loginUsername = '';
                this.loginPassword = '';

                this.loadHomePage();

            } else if (response.status == 401){
                console.log("Unsuccesful Login");
                this.loginPassword = '';
            } else {
                console.log("some error when POSTING /session",response.status, response);
            }
        },
        postUser: async function() {
            let newUser = {
                username: this.newUsername,
                password: this.newPassword,
                fullname: this.newName
            };

            let response = await fetch(`${URL}/user`, {
                method: "POST",
                body: JSON.stringify(newUser),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });

            //parse the body
            let body;
            try {
                body = response.json();
            } catch (error) {
                console.error("ERROR parsing body as JSON", error);
                body = "unknown error occured";
            }

            if (response.status == 201) {
                console.log("successful login");
                this.changePage('login');
                this.newUsername = '';
                this.newPassword = '';
                this.newName = '';

            } else if (response.status == 400 ){
                //error registering user
                this.newPassword = '';

                console.log("idk what this error could be")
            }
            
        },

        loadHomePage: async function() {
            await this.getThread();
            this.changePage('home');
        },
        
        getThread: async function(){
            let response = await fetch(`${URL}/thread`, {
            credentials: 'include'
        }); 

        //check response
        if (response.status == 200) {
            let body = await response.json();
            this.threads = body;
        } else {
            console.error("error fetching threads", response.status);
        }
    },
    loadThreadPage: async function() {
        this.changePage("thread");
    },
    getSingleThread: async function (id) {
        let response = await fetch(`${URL}/thread/${id}`, {
            credentials: "include"
        });

        if (response.status == 200) {
            this.currentThread = await response.json();
            this.loadThreadPage();
        } else {
            console.error("error fetching individual thread id:", id, "-status:", response.status);
        }
        }
    },
    //as soon as app is created, created will run
    created: function () {

        this.getSession();
    }
});