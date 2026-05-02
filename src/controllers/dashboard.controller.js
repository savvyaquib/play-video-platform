import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        },
        {
            $group: {
                _id: req.user._id,
                totalViews: { $sum: "$views" },
                totalVideos: { $sum: 1 },
                totalSubscribers: { $sum: { $size: "$subscribers" } },
                totalLikes: { $sum: { $size: "$likes" } }
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, totalViews, "Channel stats fetched successfully"))

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.find({ owner: req.user._id }).sort({ createdAt: -1 })

    if (!videos) {
        return res
            .status(200)
            .json(new ApiResponse(200, null, "No videos found for this channel"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "All videos of the channel are fetched successfully"))

})

export {
    getChannelStats,
    getChannelVideos
}