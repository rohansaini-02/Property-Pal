import prisma from '../lib/prisma.js'
import jwt from 'jsonwebtoken'

export const getPosts = async (req,res) =>{
    const query = req.query
    try{
        const where = {};

        // City search: case-insensitive partial match
        if (query.city && query.city.trim() !== "") {
            where.city = {
                contains: query.city.trim(),
                mode: "insensitive",
            };
        }

        // Type filter (buy/rent)
        if (query.type && query.type.trim() !== "") {
            where.type = query.type;
        }

        // Property filter (apartment/house/condo/land)
        if (query.property && query.property.trim() !== "") {
            where.property = query.property;
        }

        // Bedroom filter
        if (query.bedroom && parseInt(query.bedroom) > 0) {
            where.bedroom = parseInt(query.bedroom);
        }

        // Price range filter - only apply when explicitly provided
        const minPrice = parseInt(query.minPrice);
        const maxPrice = parseInt(query.maxPrice);
        if ((!isNaN(minPrice) && minPrice > 0) || (!isNaN(maxPrice) && maxPrice > 0)) {
            where.price = {};
            if (!isNaN(minPrice) && minPrice > 0) {
                where.price.gte = minPrice;
            }
            if (!isNaN(maxPrice) && maxPrice > 0) {
                where.price.lte = maxPrice;
            }
        }

        const posts = await prisma.post.findMany({
            where,
            include:{
                savedPosts: {
                    select:{
                        userId: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
        res.status(200).json(posts)
        
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"failed to get posts"})
    }
}

export const getPost = async (req, res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                postDetail: true,
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                },
                savedPosts: {
                    select:{
                        userId: true,    
                    }
                }

            }
        });

        const token = req.cookies?.token;

        if (token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
                if (!err) {
                    const saved = await prisma.savedPost.findUnique({
                        where: {
                            userId_postId: {
                              postId: id,
                              userId: payload.id,
                            },
                          },
                    });
                    res.status(200).json({ ...post, isSaved: saved ? true : false });
                } else {
                    res.status(200).json({ ...post, isSaved: false });
                }
            });
        } else {
            res.status(200).json({ ...post, isSaved: false });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to get posts" });
    }
}


export const addPost = async (req,res) =>{
    const body = req.body
    const tokenUserId = req.userId
    try{
        console.log(tokenUserId)
        const newPost = await prisma.post.create({
            data:{
                ...body.postData,
                // user: {
                //     connect: { id: tokenUserId } // Connect the post to an existing user
                // },
                userId: tokenUserId,
                postDetail:{
                    create:body.postDetail,
                }
            }
        })
        console.log(newPost)
        res.status(200).json(newPost)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"failed to get posts"})
    }
}

export const updatePost = async (req,res) =>{
    try{
        
        res.status(200).json()
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"failed to get posts"})
    }
}

export const deletePost = async (req,res) =>{
    const id = req.params.id
    const tokenUserId = req.userId
    try{
        const post = await prisma.post.findUnique({
            where:{id}
        })

        if(post.userId !== tokenUserId)
        res.status(403).json({message:"Not Authorized"})

        await prisma.post.delete({
            where:{id}
        })
        res.status(200).json({message:"Post Deleted"})

    }
    catch(err){
        console.log(err)
        res.status(500).json({message:"failed to get posts"})
    }
}