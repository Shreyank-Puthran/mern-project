import News from "../models/newsModel.js";
import cloudinary from "../cloudinaryConfig.js";
import upload from "../multerCloudinary.js";
import { extractPublicId } from "../utilities/cloudinaryUtil.js";
import mongoose from "mongoose";

const addNews = async (req, res) => {
  try {
    const { title, content, category, tags = [], author = "Admin" } = req.body;

    if (!title || !content || !category || !req.file) {
      return res.status(400).json({
        message: "Title, content, category, and image are required",
      });
    }
    const imageUrl = req.file.path;

    const news = new News({
      title,
      content,
      category,
      tags: Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim()),
      author,
      imageUrl,
    });

    await news.save();
    res.status(201).json({ message: "News added successfully", news });
  } catch (err) {
    res.status(500).json({ message: "Error adding news", error: err.message });
  }
};

const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to fetch news", error: err.message });
  }
};

const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.status(200).json(news);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Unable to fetch article", error: err.message });
  }
};

const updateNews = async (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags = [], author } = req.body;

  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }

    if (req.file) {
      const publicId = extractPublicId(news.imageUrl);
      if (publicId) await cloudinary.uploader.destroy(publicId);

      news.imageUrl = req.file.path;
    }

    if (title) news.title = title;
    if (content) news.content = content;
    if (category) news.category = category;
    if (author) news.author = author;
    if (tags)
      news.tags = Array.isArray(tags)
        ? tags
        : tags.split(",").map((tag) => tag.trim());

    await news.save();
    res.status(200).json({ message: "News updated successfully", news });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating news", error: err.message });
  }
};

const deleteNews = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid news ID" });
  }

  try {
    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }

    const publicId = extractPublicId(news.imageUrl);
    console.log("Deleting image with publicId:", publicId);
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Cloudinary deletion result:", result);
    }

    await News.findByIdAndDelete(id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting news", error: err.message });
  }
};

export { addNews, getAllNews, getNewsById, updateNews, deleteNews };
