//Uncomment for tests
//global.sessionStorage = require('sessionstorage')

const logic = {
    _userId: sessionStorage.getItem('userId') || null,
     _token: sessionStorage.getItem('token') || null,

    url: 'NO-URL',



    registerUser(name, surname, username, password) {
        if (typeof name !== 'string') throw TypeError(`${name} is not a string`)
        if (typeof surname !== 'string') throw TypeError(`${surname} is not a string`)
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!name.trim()) throw Error('name is empty or blank')
        if (!surname.trim()) throw Error('surname is empty or blank')
        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ name, surname, username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })
    },

    login(username, password) {
        if (typeof username !== 'string') throw TypeError(`${username} is not a string`)
        if (typeof password !== 'string') throw TypeError(`${password} is not a string`)

        if (!username.trim()) throw Error('username is empty or blank')
        if (!password.trim()) throw Error('password is empty or blank')

        return fetch(`${this.url}/auth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                const { id, token } = res.data

                this._userId = id
                this._token = token

                sessionStorage.setItem('userId', id)
                sessionStorage.setItem('token', token)
            })
    },

    get loggedIn() {
        return !!this._userId
    },

    get sessionId(){
        return this._userId
    },

    logout() {
        this._postits = []
        this._userId = null
        this._token = null

        sessionStorage.removeItem('userId')
        sessionStorage.removeItem('token')
    },

    createJob(details) {

        const { title, budget, contact, location, tags, description, photo } = details


        if (typeof title !== 'string') throw TypeError(`${title} is not a string`)
        if (typeof budget !== 'string') throw TypeError(`${budget} is not a string`)
        if (typeof contact !== 'string') throw TypeError(`${contact} is not a string`)
        if (typeof location !== 'string') throw TypeError(`${location} is not a string`)
        if (typeof description !== 'string') throw TypeError(`${description} is not a string`)
        if (typeof photo !== 'string') throw TypeError(`${photo} is not a string`)

        if (!photo.trim()) throw Error('photo is empty or blank')
        if (!title.trim()) throw Error('title is empty or blank')
        if (!budget.trim()) throw Error('budget is empty or blank')
        if (!contact.trim()) throw Error('contact is empty or blank')
        if (!location.trim()) throw Error('location is empty or blank')
        if (!description.trim()) throw Error('description is empty or blank')
        
        return fetch(`${this.url}/users/${this._userId}/jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`
            },
            body: JSON.stringify({ title, budget, contact, description, location, tags, photo })
        })
            .then(res => res.json())
            .then(res => {
                
                if (res.error) throw Error(res.error)
            })
    },

    listAllJobs() {

        return fetch(`${this.url}/users/${this._userId}/Alljobs`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            },

        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })


                },

    getJob(userId, jobId) {

        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (typeof jobId !== 'string') throw TypeError(`${jobId} is not a string`)


        if (!userId.trim()) throw Error('user id is empty or blank')
        if (!jobId.trim()) throw Error('job id is empty or blank')

        return fetch(`${this.url}/users/${userId}/jobs/${jobId}/view`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
           
    },

    requestJob(userId, jobId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        if (typeof jobId !== 'string') throw TypeError(`${jobId} is not a string`)

        if (!userId.trim()) throw Error('userId is empty or blank')
        if (!jobId.trim()) throw Error('jobId is empty or blank')

        const requestId = this._userId.toString()
        return fetch(`${this.url}/users/${userId}/jobs/${jobId}/requests`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ requestId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },
    retrieveUser(userId) {
        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)

        if (!userId.trim()) throw Error('user id is empty or blank')

        return fetch(`${this.url}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
           
    },

    assignJob(toAssignId, jobId) {
        if (typeof toAssignId !== 'string') throw TypeError(`${toAssignId} is not a string`)

        if (!toAssignId.trim()) throw Error('to assign id id is empty or blank')

        if (typeof jobId !== 'string') throw TypeError(`${jobId} is not a string`)

        if (!jobId.trim()) throw Error('job id is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/jobs/${jobId}/assign`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ requestId: toAssignId })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },

    /**
     * 
     * @param {object} details 
     */
    modifyJob(details) {
        
        return fetch(`${this.url}/users/${this._userId}/jobs/${details.jobId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify(details)
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },

    removeJob(jobId) {
        
        if (typeof jobId !== 'string') throw TypeError(`${jobId} is not a string`)

        if (!jobId.trim()) throw Error('job id is empty or blank')


        return fetch(`${this.url}/users/${this._userId}/jobs/${jobId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })

    },
    rateJob(rating,ratingText,jobId){
              
        if (typeof jobId !== 'string') throw TypeError(`${jobId} is not a string`)

        if (!jobId.trim()) throw Error('job id is empty or blank')

        if (typeof ratingText !== 'string') throw TypeError(`${ratingText} is not a string`)

        if (typeof rating !== 'number') throw TypeError(`${rating} is not a number`)

        return fetch(`${this.url}/users/${this._userId}/jobs/${jobId}/rate`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${this._token}`

            },
            body: JSON.stringify({ rating, ratingText  })
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)
            })


    },
    retrieveJobsFromUser(userId){

        if (typeof userId !== 'string') throw TypeError(`${userId} is not a string`)
        

        if (!userId.trim()) throw Error('user id is empty or blank')
        
        return fetch(`${this.url}/users/${userId}/jobs/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this._token}`
            }
        })
            .then(res => res.json())
            .then(res => {
                if (res.error) throw Error(res.error)

                return res.data
            })
           


    },
    uploadUserPhoto(base64Image) {
        

        if (typeof base64Image !== 'string') throw TypeError(`${base64Image} is not a string`)
        if (!base64Image.trim()) throw Error('user id is empty or blank')
        
        return fetch(`${this.url}/upload`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${this._token}`,
                'Content-Type': 'application/json; charset=utf-8'

            },
            body: JSON.stringify({ base64Image})
        })
            .then(res => res.json())
            .then(res => {

                if (res.error) throw Error(res.error)

                return res.photo

            })

    }
}

//export default logic
module.exports = logic