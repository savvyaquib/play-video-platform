import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

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

    const { videoId } = req.params
    const { text } = req.body
    const owner = req.user._id

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid videoId")
    }

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

    const { commentId } = req.params
    const { text } = req.body
    const owner = req.user._id

    if (!text) {
        throw new ApiError(400, "Comment text is required")
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const updateComment = await Comment.findOneAndUpdate({
        $and: [{ owner: owner }, { _id: commentId }]
    }, {
        content: text
    },
        { new: true }
    )

    console.log(updateComment)
    if (!updateComment) {
        throw new ApiError(401, "User or comment id didn't match")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updateComment, "Your comment is updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params
    const owner = req.user._id

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid commentId")
    }

    const deleteComment = await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200, deleteComment, "Your comment is deleted successfully"))
})

export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
