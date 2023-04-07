// Импортируем библиотеку fastify для развертывания веб-сервера
const fastify = require('fastify')({
    logger: true // Эта штука нужна, чтобы в терминале отображались логи запросов
})

const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})
/**
 * 
 * @param {Object} object
 * @param {Array | null}  object.file
 * @param {String}  object.file.filePath
 * @param {String}  object.file.fileName
 * @param {String}  object.subject
 * @param {String}  object.userEmail
 * @param {String}  object.text
 */
async function sendEmail (object) {
    try{
        const emailObject = {
            subject: object.subject,
            from: '"ООО ДОРОГИ УРАЛА" <snowflakeXXXX@yandex.ru>',
            to: object.userEmail,
            html: object.text
        }

        if (object.file) {
            const files = []
            for (const file of object.file) {
                files.push({path: file.filePath, filename: file.fileName + '.pdf'})
            }
            emailObject.attachments = files
        }
        const res = await transporter.sendMail(emailObject)
    }
    catch (e) {
        console.log(e)
    }
}

// Блок кода, который нужен для исправления ошибки с CORS
fastify.register(require('@fastify/cors'), (instance) => {
    return (req, callback) => {
        const corsOptions = {
            // This is NOT recommended for production as it enables reflection exploits
            origin: true
        };

        // do not include CORS headers for requests from localhost
        if (/^localhost$/m.test(req.headers.origin)) {
            corsOptions.origin = false
        }

        // callback expects two parameters: error and options
        callback(null, corsOptions)
    }
})

// Создание маршрута для get запроса
fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
})


// Запускаем сервер на порту 3000
fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})