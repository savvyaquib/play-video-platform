import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { createdAt: -1 },

    }


    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }


    const aggregateComments = Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId),
            }
        }
    ])

    const comments = await Comment.aggregatePaginate(aggregateComments, options)

    console.log(comments)


    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params
    const { text } = req.body
    const owner = req.user._id

    const newComment = await Comment.create({
        content: text,
        owner: owner,
        video: videoId
    })

    return res
        .status(201)
        .json(new ApiResponse(201, newComment, "Your comment is uploaded successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params
    const { text } = req.body
    const owner = req.user._id

    const updateComment = await Comment.findOneAndUpdate({
        $and: [{ owner: owner }, { _id: commentId }]
    }, {
        content: text
    },
        { new: true }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, updateComment, "Your comment is updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
