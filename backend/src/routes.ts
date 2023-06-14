import { FastifyInstance } from 'fastify'
import {z} from 'zod'
import {prisma} from './lib/prisma'
import dayjs from 'dayjs'

export async function AppRoutes(app: FastifyInstance) {
    // rota para criar um user
    app.post('/user', async (request) => {
        const postBody  = z.object({
                username: z.string(),
                password: z.string(),
                email: z.string()
            })
        const {username, password, email} = postBody.parse(request.body)
        const created_at = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        const newUser = await prisma.user.create({
            data: {
                username,
                password,
                email,
                created_at
        }
        })
        return newUser
    })

     // rota para recuperar um user
     app.post('/user/login', async (request) => {
        const postBody  = z.object({
                username: z.string(),
                password: z.string(),
            })
        const {username, password } = postBody.parse(request.body)
        const user = await prisma.user.findMany({
            where: {
                username: username,
                password: password
            }
        })
        return user
    })

    // define uma rota que consulta todos os usuários cadastrados no banco de dados
    app.get('/users', async () => {
        const users = await prisma.user.findMany()
        return users
    })

    // define uma rota que consulta todos os comentários cadastrados no banco de dados
        app.get('/comments', async () => {
            const comments = await prisma.comment.findMany()
            return comments
        })

    // rota para criar um comentario
    // define uma rota que cria um comentario no banco de dados, usando o verbo post, com um usuário

    app.post('/comment', async (request) => {
        // recupera os dados do corpo da requisição
        const createCommentBody = z.object({
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            likesQty: z.number(),
            userId: z.number()
        })
        const {title, content, published, likesQty, userId} = createCommentBody.parse(request.body)
        // insere o comentário no banco de dados
        // recupera a data atual - de hoje
        const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        let newComment = await prisma.comment.create({
            data: {
                title,
                content,
                published,
                likesQty,
                userId
            }
        })
        return newComment
    })


// recupera todos os comentarios de um usuário
    app.get('/comments/:userId', async (request) => {
        const userIdParams = z.object({
            userId: z.string()
        })
        const {userId} = userIdParams.parse(request.params)
        const comments = await prisma.comment.findMany({
            where: {
                userId: Number(userId)
            }
        })
        return comments
    })

    //Adicionar um like
    app.patch('/comment/increase-like', async (request) => {
        const increaseLikeBody = z.object({
            id: z.number(),
            userId: z.number(),
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            like: z.number()
        })
        const {id, userId, title, content, published, like} = increaseLikeBody.parse(request.body)

        let commentUpdated = await prisma.comment.update({
            where: {
                id: id
            },
            data: {
                likesQty: {
                    increment: like
                }
            }
        })

        const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        await prisma.control.create({
            data: {
                type: "I",
                title,
                content: content,
                published: published,
                likesQty: like,
                created_at: today,
                userId,
                commentId: id
            }
        })
        return commentUpdated
    })

    //Adicionar um comentário
    app.patch('/comment/increase-comment', async (request) => {
        const increaseLikeBody = z.object({
            id: z.number(),
            userId: z.number(),
            title: z.string(),
            content: z.string(),
            published: z.boolean(),
            likesQty: z.number()
        })
        const {id, userId, title, content, published, likesQty} = increaseLikeBody.parse(request.body)

        let commentUpdated = await prisma.comment.update({
            where: {
                id: id
            },
            data: {
                title: {
                    increment: title
                },
                content: {
                    increment: content
                },
                published: {
                    increment: published
                }
            }
        })

        const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
        await prisma.control.create({
            data: {
                type: "I",
                title,
                content: content,
                published: published,
                likesQty,
                created_at: today,
                userId,
                commentId: id
            }
        })
        return commentUpdated
    })

    //Passo 5. Lista os controls
    app.get('/controls', async () => {
            const controls = await prisma.control.findMany()
            return controls
        })

    // Passo 6. Lista os controls de um usuário
    app.get('/controls/:userId', async (request) => {
            const userIdParams = z.object({
                userId: z.string()
            })
            const {userId} = userIdParams.parse(request.params)
            const controls = await prisma.control.findMany({
                where: {
                    userId: Number(userId)
                }
            })
            return controls
        })

    // Passo 7. Realiza um deslike de um usuário
    // rota pra atualizar a quantidade de like

    app.patch('/comment/decrease-like', async (request) => {
        const decreaseBody = z.object({
            id: z.number(),
            like: z.number(),
            userId: z.number()
        })
        const {id, like, userId} = decreaseBody.parse(request.body)

        let resp = await prisma.comment.updateMany({
            where: {
                id: id,
                likesQty: {
                    gte: like
                }
            },
            data: {
                likesQty: {
                    decrement: like
                }
            }
        })

    //  return resp.count
        if ((resp.count) > 0){
            const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
            await prisma.control.create({
                data: {
                    type: "D",
                    likesQty: like,
                    created_at: today,
                    userId,
                    commentId: id
                }
            })
            return 1 // indica que o like foi inserido
        }
        else {
            return 0 // indica que o like não foi inserido
        }
    })

    // Editar comentário
    // rota pra editar o comentário

    app.patch('/comment/edit-comment', async (request) => {
        const editCommentBody = z.object({
            id: z.number(),
            title: z.string(),
            content: z.string(),
            likesQty: z.number(),
            published: z.boolean(),
            userId: z.number()
        })
        const {id, title, content, published, likesQty, userId} = editCommentBody.parse(request.body)

        let resp = await prisma.comment.updateMany({
            where: {
                id: id
            },
            data: {
                title: title,
                content: content,
                published: published,
                likesQty: likesQty,
                userId,
            }
        })

    //  return resp.count
        if ((resp.count) > 0){
            const today = dayjs().startOf('day').toDate() // sem hora, minuto e segundo
            await prisma.control.create({
                data: {
                    type: "E",
                    title: title,
                    content: content,
                    published: published,
                    likesQty: likesQty,
                    userId,
                }
            })
            return 1 // indica que o comment foi editado
        }
        else {
            return 0 // indica que o comment não foi editado
        }
    })

    // rota para remover um comment, usando o verbo delete
    app.delete('/comment/:id', async (request) => {
        // recupera o id para remoção
        const idParam = z.object({
            id: z.string()
        })
        const {id} = idParam.parse(request.params)
        // remove o commentario
        let commentDeleted = await prisma.comment.delete({
            where: {
                id: Number(id)
            }
        })
        return commentDeleted
    })

}