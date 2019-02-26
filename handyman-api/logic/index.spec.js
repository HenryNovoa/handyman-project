const { mongoose, models: { User, Job, Comment } } = require('handyman-data')
const logic = require('.')
const { AuthError, AlreadyExistsError, ValueError, NotFoundError } = require('../errors')
const chunk = require('./chunk-test')

const cloudinary = require('cloudinary')
const { expect } = require('chai')

const MONGO_URL = 'mongodb://localhost:27017/handyman-test'

const { env: { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } } = process


cloudinary.config({
    cloud_name: 'skylab-handyman',
    api_key: '772161371929274',
    api_secret: '26OshHlvAVT4GLSzSMgzSMLl94M'
})


// running test from CLI
// normal -> $ mocha src/logic.spec.js --timeout 10000
// debug -> $ mocha debug src/logic.spec.js --timeout 10000

describe('logic', () => {
    before(() => mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true }))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Job.deleteMany())


    describe('user', () => {
        describe('register', () => {
            let name, surname, username, password

            beforeEach(() => {
                name = `name-${Math.random()}`
                surname = `surname-${Math.random()}`
                username = `username-${Math.random()}`
                password = `password-${Math.random()}`
            })

            it('should succeed on correct data', async () => {
                const res = await logic.registerUser(name, surname, username, password)

                expect(res).to.be.undefined

                const users = await User.find()

                expect(users.length).to.equal(1)

                const [user] = users

                expect(user.id).to.be.a('string')
                expect(user.name).to.equal(name)
                expect(user.surname).to.equal(surname)
                expect(user.username).to.equal(username)
                expect(user.password).to.equal(password)
            })


            //name
            it('should fail on undefined name', () => {
                expect(() => logic.registerUser(undefined, surname, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser('', surname, username, password)).to.throw(ValueError, 'name is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser('   \t\n', surname, username, password)).to.throw(ValueError, 'name is empty or blank')
            })

            //surname
            it('should fail on undefined surname', () => {
                expect(() => logic.registerUser(name, undefined, username, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty surname', () => {
                expect(() => logic.registerUser(name, '', username, password)).to.throw(ValueError, 'surname is empty or blank')
            })

            it('should fail on blank surname', () => {
                expect(() => logic.registerUser(name, '   \t\n', username, password)).to.throw(ValueError, 'surname is empty or blank')
            })

            //username
            it('should fail on undefined username', () => {
                expect(() => logic.registerUser(name, surname, undefined, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.registerUser(name, surname, '', password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.registerUser(name, surname, '   \t\n', password)).to.throw(ValueError, 'username is empty or blank')
            })

            //password
            it('should fail on undefined password', () => {
                expect(() => logic.registerUser(name, surname, username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty name', () => {
                expect(() => logic.registerUser(name, surname, username, '')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank name', () => {
                expect(() => logic.registerUser(name, surname, username, '   \t\n')).to.throw(ValueError, 'password is empty or blank')
            })




            // TODO other test cases
        })

        describe('authenticate', () => {
            let user

            // beforeEach(() => {
            //     user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

            //     return user.save()
            // })

            // ALT
            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should authenticate on correct credentials', async () => {
                const { username, password } = user

                const id = await logic.authenticateUser(username, password)

                expect(id).to.exist
                expect(id).to.be.a('string')

                const users = await User.find()

                const [_user] = users

                expect(_user.id).to.equal(id)
            })


            it('should fail on incorrect password', async () => {

                const notPassword = `notUserPassword-${Math.random()}`

                const { username, password } = user

                try {
                    await logic.authenticateUser(username, notPassword)
                } catch (err) {
                    expect(err).to.be.an.instanceOf(AuthError)
                    expect(err.message).to.equal('invalid username or password')
                }
            })

            it('should fail on incorrect password', async () => {

                const notUsername = `notUsername-${Math.random()}`

                const { username, password } = user

                try {
                    await logic.authenticateUser(notUsername, password)
                } catch (err) {
                    expect(err).to.be.an.instanceOf(AuthError)
                    expect(err.message).to.equal('invalid username or password')
                }
            })




            //username
            it('should fail on undefined username', () => {
                expect(() => logic.authenticateUser(undefined, user.password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty username', () => {
                expect(() => logic.authenticateUser('', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            it('should fail on blank username', () => {
                expect(() => logic.authenticateUser('   \t\n', user.password)).to.throw(ValueError, 'username is empty or blank')
            })

            //password
            it('should fail on undefined password', () => {
                expect(() => logic.authenticateUser(user.username, undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty password', () => {
                expect(() => logic.authenticateUser(user.username, '')).to.throw(ValueError, 'password is empty or blank')
            })

            it('should fail on blank password', () => {
                expect(() => logic.authenticateUser(user.username, '   \t\n')).to.throw(ValueError, 'password is empty or blank')
            })


        })

        describe('retrieve', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                await user.save()
            })

            it('should succeed on valid id', async () => {
                const _user = await logic.retrieveUser(user.id)

                expect(_user).not.to.be.instanceof(User)

                const { id, name, surname, username, password, jobs } = _user

                expect(id).to.exist
                expect(id).to.be.a('string')
                expect(id).to.equal(user.id)
                expect(name).to.equal(user.name)
                expect(surname).to.equal(user.surname)
                expect(username).to.equal(user.username)
                expect(password).to.be.undefined
                expect(jobs).not.to.exist
            })
            it('should fail on incorrect id', async () => {

                const notCorrectId = `notId-${Math.random()}`

                try {
                    await logic.retrieveUser(notCorrectId)
                } catch (err) {
                    expect(err).to.be.an.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                }
            })


            it('should fail on undefined id', () => {
                expect(() => logic.retrieveUser(undefined)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on empty id', () => {
                expect(() => logic.retrieveUser('')).to.throw(ValueError, 'id is empty or blank')
            })

            it('should fail on blank id', () => {
                expect(() => logic.retrieveUser('   \t\n')).to.throw(ValueError, 'id is empty or blank')
            })
        })

        describe('update', () => {
            let user

            beforeEach(() => (user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })).save())

            it('should update on correct data and password', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`
                const newSurname = `${surname}-${Math.random()}`
                const newUsername = `${username}-${Math.random()}`
                const newPassword = `${password}-${Math.random()}`

                const res = await logic.updateUser(id, newName, newSurname, newUsername, newPassword, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(newUsername)
                expect(_user.password).to.equal(newPassword)
            })

            it('should update on correct id, name and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newName = `${name}-${Math.random()}`

                const res = await logic.updateUser(id, newName, null, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(newName)
                expect(_user.surname).to.equal(surname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            it('should update on correct id, surname and password (other fields null)', async () => {
                const { id, name, surname, username, password } = user

                const newSurname = `${surname}-${Math.random()}`

                const res = await logic.updateUser(id, null, newSurname, null, null, password)

                expect(res).to.be.undefined

                const _users = await User.find()

                const [_user] = _users

                expect(_user.id).to.equal(id)

                expect(_user.name).to.equal(name)
                expect(_user.surname).to.equal(newSurname)
                expect(_user.username).to.equal(username)
                expect(_user.password).to.equal(password)
            })

            // TODO other combinations of valid updates

            it('should fail on undefined id', () => {
                const { id, name, surname, username, password } = user

                expect(() => logic.updateUser(undefined, name, surname, username, password, password)).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on non-existent user Id', async () => {
                const notCorrectId = `notId-${Math.random()}`

                const { id, name, surname, username, password } = user

                try {
                    await logic.updateUser(notCorrectId, name, surname, username, password, password)
                } catch (err) {
                    expect(err).to.be.an.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                }
            })

            it('should fail on incorrect password', async () => {
                const notCorrectPassword = `notPassword-${Math.random()}`

                const { id, name, surname, username, password } = user

                try {
                    await logic.updateUser(id, name, surname, username, password, notCorrectPassword)
                } catch (err) {
                    expect(err).to.be.an.instanceOf(AuthError)
                    expect(err.message).to.equal(`invalid password`)
                }
            })

            // TODO other test cases

            describe('with existing user', () => {
                let user2

                beforeEach(async () => {
                    user2 = new User({ name: 'John', surname: 'Doe', username: 'jd2', password: '123' })

                    await user2.save()
                })

                it('should fail to update on already existing username', async () => {
                    const { id, name, surname, username, password } = user2

                    const newUsername = 'jd'

                    try {
                        const res = await logic.updateUser(id, null, null, newUsername, null, password)

                        expect(true).to.be.false
                    } catch (err) {
                        expect(err).to.be.instanceof(AlreadyExistsError)
                    } finally {
                        const _user = await User.findById(id)

                        expect(_user.id).to.equal(id)

                        expect(_user.name).to.equal(name)
                        expect(_user.surname).to.equal(surname)
                        expect(_user.username).to.equal(username)
                        expect(_user.password).to.equal(password)
                    }
                })


            })
        })

    })

    describe('Jobs', () => {




        describe('add', () => {
            let user, pictures, budget, contact, description, location, tags

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy photo'

                await user.save()
            })

            it('should succeed on correct data', async () => {

                const userId = user.id

                const res = await logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })

                expect(res).to.be.undefined

                const jobs = await Job.find()

                const [job] = jobs

                expect(job.title).to.equal(title)

                expect(job.description).to.equal(description)

                expect(job.budget).to.equal(budget)

                expect(job.contact).to.equal(contact)

                expect(job.location).to.equal(location)

                expect(job.photo).to.equal(photo)

                expect(job.tags).not.to.be.undefined

                expect(tags.length).to.equal(2)

                expect(job.pictures).not.to.be.undefined

                expect(pictures.length).to.equal(2)

                expect(job.user.toString()).to.equal(user.id)
            })


            it('should fail on undefined id', async () => {

                //const userId = user.id

                const userId = undefined

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on non-existent(valid) user Id', async () => {
                const notCorrectId = `notId-${Math.random()}`

                const userId = notCorrectId

                try {
                    await logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })
                } catch (err) {
                    expect(err).to.be.an.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                }
            })
            it('should fail on non-string(number) id', async () => {

                const userId = 5
                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${userId} is not a string`)
            })

            it('should fail on undefined title', async () => {

                const userId = user.id

                const title = undefined

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, 'undefined is not a string')
            })

            it('should fail on non-string(number) title', async () => {

                const userId = user.id

                const title = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${title} is not a string`)
            })

            it('should fail on non-string(number) budget', async () => {

                const userId = user.id

                const budget = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${budget} is not a string`)
            })
            it('should fail on non-string(number) contact', async () => {

                const userId = user.id

                const contact = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${contact} is not a string`)
            })
            it('should fail on non-string(number) description', async () => {

                const userId = user.id

                const description = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${description} is not a string`)
            })
            it('should fail on non-string(number) location', async () => {

                const userId = user.id

                const location = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${location} is not a string`)
            })

            it('should fail on non-string(number) photo url', async () => {

                const userId = user.id

                const photo = 5

                expect(() => logic.createJob({ title, userId, pictures, budget, contact, description, location, tags, photo })).to.throw(TypeError, `${photo} is not a string`)
            })




            // TODO other test cases
        })
        describe('add photo (to already existing job)', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = []

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy2'

                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])
            })
            it('should succed on correct data', async () => {


                const res = await logic.insertPhotoToJob(user.id, job.id, chunk)

                expect(res).to.be.undefined

                const _job = await Job.findById(job.id)

                expect(_job.id).to.equal(job.id)

                expect(_job.pictures.length).to.equal(1)

                expect(_job.pictures[0].toString()).to.exist


            })

        })
        describe('upload photo', () => {
            let user

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = []

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy2'

                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])
            })
            it('should successfully retrieve url', async () => {


                const res = await logic.insertPhotoToJob(user.id, job.id, chunk)

                expect(res).to.be.undefined

                const _job = await Job.findById(job.id)

                expect(_job.id).to.equal(job.id)

                expect(_job.pictures.length).to.equal(1)

                expect(_job.pictures[0].toString()).to.exist


            })

        })




        describe('rate Job', () => {
            let user, user2, job

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'

                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])
            })


            describe('with user requesting to do posted job', () => {

                beforeEach(async () => {

                    const res = await logic.requestJob(user2.id, job.id)

                    expect(res).to.be.undefined

                    const jobs = await Job.find()

                    expect(jobs.length).to.equal(1)

                    const [_job] = jobs

                    expect(_job.requestedBy[0].toString()).to.equal(user2.id)
                })



                describe('with user assigned', () => {

                    beforeEach(async () => {

                        const res = await logic.assignJob(user.id, user2.id, job.id)

                        expect(res).to.be.undefined

                        const jobs = await Job.find()

                        expect(jobs.length).to.equal(1)

                        const [_job] = jobs

                        expect(_job.id).to.equal(job.id)
                        expect(_job.user.toString()).to.equal(user.id)
                        expect(_job.assignedTo.toString()).to.equal(user2.id)
                    })

                    it('should correctly rate job', async () => {
                        const rating = 4

                        const ratingText = 'good job!!'

                        const res = await logic.rateJob(user.id, job.id, rating, ratingText)

                        expect(res).to.be.undefined

                        const jobs = await Job.find()

                        expect(jobs.length).to.equal(1)

                        const [_job] = jobs

                        expect(_job.id).to.equal(job.id)
                        expect(_job.user.toString()).to.equal(user.id)
                        expect(_job.assignedTo.toString()).to.equal(user2.id)

                        expect(_job.rating).to.exist
                        expect(_job.rating).to.equal(rating)
                        expect(_job.ratingText).to.equal(ratingText)


                    })


                    it('should fail on valid non-existent user Id', async () => {
                        const rating = 4
                        const notCorrectId = 'notCorrectId'
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(notCorrectId, job.id, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(NotFoundError)
                            expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                        }
                    })

                    it('should fail on valid non-existant job Id', async () => {
                        const rating = 4
                        const notCorrectId = 'notCorrectId'
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(NotFoundError)
                            expect(err.message).to.equal(`job with id ${notCorrectId} not found`)
                        }
                    })

                    it('should fail on non-valid job Id(number)', async () => {
                        const rating = 4
                        const notCorrectId = 4
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })

                    it('should fail on non-valid job Id(number)', async () => {
                        const rating = 4
                        const notCorrectId = 4
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })
                    it('should fail on non-valid job Id(boolean)', async () => {
                        const rating = 4
                        const notCorrectId = true
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })
                    it('should fail on non-valid job Id(undefined)', async () => {
                        const rating = 4
                        const notCorrectId = undefined
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })
                    it('should fail on non-valid job Id(null)', async () => {
                        const rating = 4
                        const notCorrectId = null
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })


                    
                    it('should fail on valid non-string job Id', async () => {
                        const rating = 4
                        const notCorrectId = 'notCorrectId'
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(user.id, notCorrectId, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(NotFoundError)
                            expect(err.message).to.equal(`job with id ${notCorrectId} not found`)
                        }
                    })
                    it('should fail on valid non-string user Id(number)', async () => {
                        const rating = 4
                        const notCorrectId = 4
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(notCorrectId, job.id, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })

                    it('should fail on valid non-string user Id(boolean)', async () => {
                        const rating = 4
                        const notCorrectId = false
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(notCorrectId, job.id, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })

                    it('should fail on valid non-string user Id(undefined)', async () => {
                        const rating = 4
                        const notCorrectId = undefined
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(notCorrectId, job.id, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })

                    it('should fail on valid non-string user Id(null)', async () => {
                        const rating = 4
                        const notCorrectId = null
                        const ratingText = 'good job!!'
                        try {
                            const res = await logic.rateJob(notCorrectId, job.id, rating, ratingText)
                        } catch (err) {
                            expect(err).to.be.an.instanceOf(TypeError)
                            expect(err.message).to.equal(`${notCorrectId} is not a string`)
                        }
                    })


                })
            })
        })

        describe('list', () => {
            let user, job, job2

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'



                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })
                job2 = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })

                await user.save()
                await job.save()
                await job2.save()
            })

            it('All jobs, should succesfully list no jobs', async () => {

                await Job.deleteMany({})

                const jobs = await logic.listAllJobs()

                expect(jobs.length).to.equal(0)
            })

            it('All jobs, should succesfully list all jobs', async () => {
                const jobs = await logic.listAllJobs()

                const _jobs = await Job.find()

                expect(_jobs.length).to.equal(2)

                expect(jobs.length).to.equal(_jobs.length)

                const [_job, _job2] = _jobs

                expect(_job.id).to.equal(job.id)

                expect(_job.description).to.equal(job.description)

                expect(_job.budget).to.equal(job.budget)

                expect(_job.contact).to.equal(job.contact)

                expect(_job.location).to.equal(job.location)

                expect(_job.tags).not.to.be.undefined

                expect(_job.pictures).not.to.be.undefined


                expect(_job2.id).to.equal(job2.id)

                expect(_job2.description).to.equal(job2.description)

                expect(_job2.budget).to.equal(job2.budget)

                expect(_job2.contact).to.equal(job2.contact)

                expect(_job2.location).to.equal(job2.location)

                expect(_job2.tags).not.to.be.undefined

                expect(_job2.pictures).not.to.be.undefined


                const [__job, __job2] = jobs

                expect(__job).not.to.be.instanceof(Job)
                expect(__job2).not.to.be.instanceof(Job)

                expect(_job.id).to.equal(job.id)

                expect(_job.description).to.equal(job.description)

                expect(_job.budget).to.equal(job.budget)

                expect(_job.contact).to.equal(job.contact)

                expect(_job.location).to.equal(job.location)

                expect(_job.tags).not.to.be.undefined

                expect(_job.pictures).not.to.be.undefined


                expect(_job2.id).to.equal(job2.id)

                expect(_job2.description).to.equal(job2.description)

                expect(_job2.budget).to.equal(job2.budget)

                expect(_job2.contact).to.equal(job2.contact)

                expect(_job2.location).to.equal(job2.location)

                expect(_job2.tags).not.to.be.undefined

                expect(_job2.pictures).not.to.be.undefined
            })


            it('(Get one job) should succeed on correct data', async () => {
                const _jobs = await Job.find()

                const [_job, _job2] = _jobs

                const job = await logic.getJob(user.id, _job.id)

                expect(_job.id).to.equal(job.id)

                expect(_job.description).to.equal(job.description)

                expect(_job.budget).to.equal(job.budget)

                expect(_job.contact).to.equal(job.contact)

                expect(_job.location).to.equal(job.location)

                expect(_job.tags).not.to.be.undefined

                expect(_job.pictures).not.to.be.undefined

                expect(job).not.to.be.instanceof(Job)



            })

            it('(Get one job) should fail on non-valid user Id', async () => {
                const notCorrectUserId = 'notCorrectUserId'

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {

                    const job = await logic.getJob(notCorrectUserId, _job.id)
                } catch (err) {

                    expect(err).to.be.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectUserId} not found`)
                }

            })


            it('(Get one job) should fail on non-valid job Id', async () => {
                const notCorrectJobId = 'notCorrectUserId'

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(user.id, notCorrectJobId)
                } catch (err) {
                    expect(err).to.be.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`job with id ${notCorrectJobId} not found`)
                }

            })

            it('(Get one job) should fail on non-string userId(number)', async () => {
                const notCorrectUserId = 5

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(notCorrectUserId, job.id)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectUserId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string userId(boolean)', async () => {
                const notCorrectUserId = true

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(notCorrectUserId, job.id)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectUserId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string userId(undefined)', async () => {
                const notCorrectUserId = undefined

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(notCorrectUserId, job.id)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectUserId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string userId(null)', async () => {
                const notCorrectUserId = null

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(notCorrectUserId, job.id)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectUserId} is not a string`)
                }

            })

            it('(Get one job) should fail on non-string job Id(number)', async () => {
                const notCorrectJobId = 5

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(user.id, notCorrectJobId)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectJobId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string job Id(boolean)', async () => {
                const notCorrectJobId = true

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(user.id, notCorrectJobId)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectJobId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string job Id(undefined)', async () => {
                const notCorrectJobId = undefined

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(user.id, notCorrectJobId)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectJobId} is not a string`)
                }

            })
            it('(Get one job) should fail on non-string job Id(null)', async () => {
                const notCorrectJobId = 5

                const _jobs = await Job.find()

                const [_job, _job2] = _jobs


                try {
                    await logic.getJob(user.id, notCorrectJobId)
                } catch (err) {
                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectJobId} is not a string`)
                }

            })



            it('(Jobs from one user) should succeed on correct data', async () => {
                const jobs = await logic.listJobs(user.id)

                const _jobs = await Job.find()

                expect(_jobs.length).to.equal(2)

                expect(jobs.length).to.equal(_jobs.length)

                const [_job, _job2] = _jobs

                expect(_job.id).to.equal(job.id)

                expect(_job.description).to.equal(job.description)

                expect(_job.budget).to.equal(job.budget)

                expect(_job.contact).to.equal(job.contact)

                expect(_job.location).to.equal(job.location)

                expect(_job.tags).not.to.be.undefined

                expect(_job.pictures).not.to.be.undefined


                expect(_job2.id).to.equal(job2.id)

                expect(_job2.description).to.equal(job2.description)

                expect(_job2.budget).to.equal(job2.budget)

                expect(_job2.contact).to.equal(job2.contact)

                expect(_job2.location).to.equal(job2.location)

                expect(_job2.tags).not.to.be.undefined

                expect(_job2.pictures).not.to.be.undefined


                const [__job, __job2] = jobs

                expect(__job).not.to.be.instanceof(Job)
                expect(__job2).not.to.be.instanceof(Job)

                expect(_job.id).to.equal(job.id)

                expect(_job.description).to.equal(job.description)

                expect(_job.budget).to.equal(job.budget)

                expect(_job.contact).to.equal(job.contact)

                expect(_job.location).to.equal(job.location)

                expect(_job.tags).not.to.be.undefined

                expect(_job.pictures).not.to.be.undefined


                expect(_job2.id).to.equal(job2.id)

                expect(_job2.description).to.equal(job2.description)

                expect(_job2.budget).to.equal(job2.budget)

                expect(_job2.contact).to.equal(job2.contact)

                expect(_job2.location).to.equal(job2.location)

                expect(_job2.tags).not.to.be.undefined

                expect(_job2.pictures).not.to.be.undefined
            })


            it('(Jobs from one user) should fail on non-existant(valid) userId', async () => {
                const notCorrectId = 'notCorrectId'

                try {

                    const jobs = await logic.listJobs(notCorrectId)
                } catch (err) {

                    expect(err).to.be.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                }


            })

            it('(Jobs from one user) should fail on non-valid userId(number)', async () => {
                const notCorrectId = 5

                try {

                    const jobs = await logic.listJobs(notCorrectId)
                } catch (err) {

                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectId} is not a string`)
                }


            })
            it('(Jobs from one user) should fail on non-valid userId(boolean)', async () => {
                const notCorrectId = true

                try {

                    const jobs = await logic.listJobs(notCorrectId)
                } catch (err) {

                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectId} is not a string`)
                }


            })
            it('(Jobs from one user) should fail on non-valid userId(undefined)', async () => {
                const notCorrectId = undefined

                try {

                    const jobs = await logic.listJobs(notCorrectId)
                } catch (err) {

                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectId} is not a string`)
                }


            })
            it('(Jobs from one user) should fail on non-valid userId(null)', async () => {
                const notCorrectId = null

                try {

                    const jobs = await logic.listJobs(notCorrectId)
                } catch (err) {

                    expect(err).to.be.instanceOf(TypeError)
                    expect(err.message).to.equal(`${notCorrectId} is not a string`)
                }

            })





         
        })

        describe('remove', () => {
            let user, job

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'



                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), job.save()])
            })

            it('should succeed on correct data', async () => {
                const res = await logic.removeJob(user.id, job.id)

                expect(res).to.be.undefined

                const jobs = await Job.find()

                expect(jobs.length).to.equal(0)
            })

            it('should fail on valid non-existent user Id', async () => {
               const notCorrectId ='notCorrectId'
                try{
                const res = await logic.removeJob(notCorrectId, job.id)
                }catch(err){
                    expect(err).to.be.instanceOf(NotFoundError)
                    expect(err.message).to.equal(`user with id ${notCorrectId} not found`)

                }   

            })
            it('should fail on valid non-existent job Id', async () => {
                const notCorrectId ='notCorrectId'
                 try{
                 const res = await logic.removeJob(user.id, notCorrectId)
                 }catch(err){
                     expect(err).to.be.instanceOf(NotFoundError)
                     expect(err.message).to.equal(`job with id ${notCorrectId} not found`)
 
                 }   
 
             })
             it('should fail on non-valid user Id(number)', async () => {
                const notCorrectId =4
                 try{
                 const res = await logic.removeJob(notCorrectId, job.id)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid user Id(boolean)', async () => {
                const notCorrectId =false
                 try{
                 const res = await logic.removeJob(notCorrectId, job.id)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid user Id(undefined)', async () => {
                const notCorrectId =undefined
                 try{
                 const res = await logic.removeJob(notCorrectId, job.id)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid user Id(null)', async () => {
                const notCorrectId =4
                 try{
                 const res = await logic.removeJob(notCorrectId, job.id)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })

             it('should fail on non-valid job id(number)', async () => {
                const notCorrectId =4
                 try{
                 const res = await logic.removeJob(user.id, notCorrectId)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid job id(boolean)', async () => {
                const notCorrectId =false
                 try{
                 const res = await logic.removeJob(user.id, notCorrectId)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid job id(undefined)', async () => {
                const notCorrectId =undefined
                 try{
                 const res = await logic.removeJob(user.id, notCorrectId)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })
             it('should fail on non-valid job id(null)', async () => {
                const notCorrectId =4
                 try{
                 const res = await logic.removeJob(notCorrectId, job.id)
                 }catch(err){
                     expect(err).to.be.instanceOf(TypeError)
                     expect(err.message).to.equal(`${notCorrectId} is not a string`)
 
                 }   
 
             })

        })

        describe('modify', () => {
            let user, job, newBudget, newContact, newDescription, newLocation, newTags, status, rating, assignedTo, requestedBy

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'

                //Modifiers
                newBudget = `30.${Math.random()}`
                newContact = `123-${Math.random()}@456.com`
                newDescription = `chao mondo-${Math.random()}`
                newLocation = `madrid`
                status = 'DOING'
                rating = '4'
                assignedTo = user2.id
                newTags = ['bici', 'vehiculo', 'reudas']





                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags, requestedBy: user2.id })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])


            })

            it('should succeed on correct data', async () => {
                const userId = user.id
                const jobId = job.id
                newBudget = `30.${Math.random()}`
                newContact = `123-${Math.random()}@456.com`
                newDescription = `chao mondo-${Math.random()}`
                newLocation = `madrid`
                newStatus = 'DOING'
                newRating = '4'
                assignedTo = user2.id
                newTags = ['bici', 'vehiculo', 'rueda']

                const res = await logic.modifyJob({ userId, jobId, newBudget, newContact, newDescription, newLocation, newStatus, newRating, assignedTo, newTags })

                expect(res).to.be.undefined

                const jobs = await Job.find()

                expect(jobs.length).to.equal(1)

                const [_job] = jobs

                expect(_job.id).to.equal(jobId)
                expect(_job.user.toString()).to.equal(userId)
                expect(_job.budget).to.equal(newBudget)
                expect(_job.contact).to.equal(newContact)
                expect(_job.description).to.equal(newDescription)
                expect(_job.status).to.equal(newStatus)
                //expect(_job.rating).to.equal(rating)
                expect(_job.tags.length).to.equal(3)
                expect(_job.tags[0].toString()).to.equal('bici')
                expect(_job.tags[1].toString()).to.equal('vehiculo')
                expect(_job.tags[2].toString()).to.equal('rueda')
                expect(_job.assignedTo.toString()).to.equal(assignedTo)
                expect(_job.location).to.equal(newLocation)
                expect(_job.created).to.be.a('number')

            })

            it('should fail on valid non-existent job Id', async () => {
                const userId = user.id
                const jobId = 'notCorrectId'
                newBudget = `30.${Math.random()}`
                newContact = `123-${Math.random()}@456.com`
                newDescription = `chao mondo-${Math.random()}`
                newLocation = `madrid`
                newStatus = 'DOING'
                newRating = '4'
                assignedTo = user2.id
                newTags = ['bici', 'vehiculo', 'rueda']

                
                try{
                    const res = await logic.modifyJob({ userId, jobId, newBudget, newContact, newDescription, newLocation, newStatus, newRating, assignedTo, newTags })
                 
                 }catch(err){
                     expect(err).to.be.instanceOf(NotFoundError)
                     expect(err.message).to.equal(`job with id ${jobId} not found`)
 
                 }   
 
             })

             it('should fail on valid non-existent user id', async () => {
                const userId = 'notCorrectId'
                const jobId = job.id
                newBudget = `30.${Math.random()}`
                newContact = `123-${Math.random()}@456.com`
                newDescription = `chao mondo-${Math.random()}`
                newLocation = `madrid`
                newStatus = 'DOING'
                newRating = '4'
                assignedTo = user2.id
                newTags = ['bici', 'vehiculo', 'rueda']

                
                try{
                    
                    const res = await logic.modifyJob({ userId, jobId, newBudget, newContact, newDescription, newLocation, newStatus, newRating, assignedTo, newTags })
                 
                 }catch(err){
                     expect(err).to.be.instanceOf(NotFoundError)
                     expect(err.message).to.equal(`user with id ${userId} not found`)
 
                 }   
 
             }) 
        })

        describe('request job', () => {
            let user, user2, job

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'

                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])


            })


            it('should succeed on correctly adding to requestedBy', async () => {
                const res = await logic.requestJob(user2.id, job.id)

                expect(res).to.be.undefined

                const jobs = await Job.find()

                expect(jobs.length).to.equal(1)

                const [_job] = jobs

                expect(_job.requestedBy[0].toString()).to.equal(user2.id)
            })

            it('should fail on valid non-existent job Id', async () => {
              
                const jobId = 'notCorrectId'
             

                
                try{
                    debugger
                    const res = await logic.requestJob(user2.id, jobId)
                 
                 }catch(err){
                     expect(err).to.be.instanceOf(NotFoundError)
                     expect(err.message).to.equal(`job with id ${jobId} not found`)
 
                 }   
 
             })

             it('should fail on valid non-existent user id', async () => {
                const userId = 'notCorrectId'
                const jobId = job.id
                

                
                try{
                    const res = await logic.requestJob(userId, jobId)
                 
                 }catch(err){
                     expect(err).to.be.instanceOf(NotFoundError)
                     expect(err.message).to.equal(`user with id ${userId} not found`)
 
                 }   
 
             }) 

            describe('list requested by', () => {

                beforeEach(async () => {
                    const res = await logic.requestJob(user2.id, job.id)

                    expect(res).to.be.undefined

                    const jobs = await Job.find()

                    expect(jobs.length).to.equal(1)

                    const [_job] = jobs

                    expect(_job.requestedBy[0].toString()).to.equal(user2.id)

                })



                it('should correctly list users that request to do job', async () => {

                    const res = await logic.listRequestedBy(user.id, job.id)

                    expect(res).to.exist

                    expect(res[0].id).to.equal(user2.id)
                    expect(res[0].username).to.equal(user2.username)






                })


                it('should fail on non-existant(valid) userId', async () => {
                    const notCorrectId = 'notCorrectId'

                    try {

                        const jobs = await logic.listRequestedBy(notCorrectId, job.id)
                    } catch (err) {

                        expect(err).to.be.instanceOf(NotFoundError)
                        expect(err.message).to.equal(`user with id ${notCorrectId} not found`)
                    }


                })
                it('should fail on non-existant(valid) jobId', async () => {
                    const notCorrectId = 'notCorrectId'

                    try {

                        const jobs = await logic.listRequestedBy(user.id, notCorrectId)
                    } catch (err) {

                        expect(err).to.be.instanceOf(NotFoundError)
                        expect(err.message).to.equal(`job with id ${notCorrectId} not found`)
                    }



                })

                it('should fail on non-valid userId(number)', async () => {
                    const notCorrectId = 5

                    try {

                        const jobs = await logic.listRequestedBy(notCorrectId, job.id)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }


                })

                it('should fail on non-valid userId(boolean)', async () => {
                    const notCorrectId = false

                    try {

                        const jobs = await logic.listRequestedBy(notCorrectId, job.id)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }


                })
                it('should fail on non-valid userId(undefined)', async () => {
                    const notCorrectId = undefined

                    try {

                        const jobs = await logic.listRequestedBy(notCorrectId, job.id)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }


                })
                it('should fail on non-valid userId(null)', async () => {
                    const notCorrectId = null

                    try {

                        const jobs = await logic.listRequestedBy(notCorrectId, job.id)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }


                })
                it('should fail on non-valid jobId(number)', async () => {
                    const notCorrectId = 5

                    try {

                        const jobs = await logic.listRequestedBy(user.id, notCorrectId)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }


                })
                it('should fail on non-valid jobId(boolean)', async () => {
                    const notCorrectId = true

                    try {

                        const jobs = await logic.listRequestedBy(user.id, notCorrectId)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }

                })
                it('should fail on non-valid jobId(undefined)', async () => {
                    const notCorrectId = undefined

                    try {

                        const jobs = await logic.listRequestedBy(user.id, notCorrectId)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }

                })
                it('should fail on non-valid jobId(null)', async () => {
                    const notCorrectId = null

                    try {

                        const jobs = await logic.listRequestedBy(user.id, notCorrectId)
                    } catch (err) {

                        expect(err).to.be.instanceOf(TypeError)
                        expect(err.message).to.equal(`${notCorrectId} is not a string`)
                    }

                })


            })

        })

        describe('assign Job', () => {
            let user, user2, job

            beforeEach(async () => {
                user = new User({ name: 'John', surname: 'Doe', username: 'jd', password: '123' })
                user2 = new User({ name: 'Peter', surname: 'Griffin', username: 'pg', password: '123' })

                pictures = ['dummy1', 'dummy2']

                budget = `50.${Math.random()}`

                contact = '123@456.com'

                description = `hello world-${Math.random()}`

                location = 'barcelona'

                tags = ['nevera', 'frio']

                title = 'nevera'

                photo = 'dummy'

                job = new Job({ title, photo, pictures, user: user.id, budget, contact, description, location, tags })


                await user.save()
                await job.save()
                await Promise.all([user.save(), user2.save(), job.save()])
            })

            describe('with user requesting to do posted job', () => {

                beforeEach(async () => {

                    const res = await logic.requestJob(user2.id, job.id)

                    expect(res).to.be.undefined

                    const jobs = await Job.find()

                    expect(jobs.length).to.equal(1)

                    const [_job] = jobs

                    expect(_job.requestedBy[0].toString()).to.equal(user2.id)
                })



                it('should succeed on correct data', async () => {
                    const res = await logic.assignJob(user.id, user2.id, job.id)

                    expect(res).to.be.undefined

                    const jobs = await Job.find()

                    expect(jobs.length).to.equal(1)

                    const [_job] = jobs

                    expect(_job.id).to.equal(job.id)
                    expect(_job.user.toString()).to.equal(user.id)
                    expect(_job.assignedTo.toString()).to.equal(user2.id)
                })

                it('should fail on valid non-existent job Id', async () => {
              
                    const jobId = 'notCorrectId'
                 
    
                    
                    try{
                        debugger
                        const res = await logic.assignJob(user.id, user2.id, jobId)
                     
                     }catch(err){
                         expect(err).to.be.instanceOf(NotFoundError)
                         expect(err.message).to.equal(`job with id ${jobId} not found`)
     
                     }   
     
                 })
    
                 it('should fail on valid non-existent user id', async () => {
                    const userId = 'notCorrectId'
                    const jobId = job.id
                    
    
                    
                    try{
                       
                        const res = await logic.assignJob(userId, user2.id, jobId)
                        
                     
                     }catch(err){
                         expect(err).to.be.instanceOf(NotFoundError)
                         expect(err.message).to.equal(`user with id ${userId} not found`)
     
                     }   
     
                 }) 
                 it('should fail on valid non-existent user id', async () => {
                    const userId = 'notCorrectId'
                    const jobId = job.id
                    
    
                    
                    try{
                       
                        const res = await logic.assignJob(user.id, userId, jobId)
                        
                     
                     }catch(err){
                         expect(err).to.be.instanceOf(NotFoundError)
                         expect(err.message).to.equal(`user with id ${userId} not found`)
     
                     }   
     
                 }) 


            })
        })
    })


    afterEach(() => User.deleteMany())
    afterEach(() => Job.deleteMany())

    after(() => mongoose.disconnect())
})