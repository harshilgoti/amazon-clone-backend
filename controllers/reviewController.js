import Review from "../models/Review.js";
import Product from "../models/Products.js";

export const createReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      product: productId,
    });
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, error: "Product already reviewed" });
    }

    const review = await Review.create({
      user: req.user.id,
      product: productId,
      rating: Number(rating),
      comment,
    });

    // Update product average rating
    const reviews = await Review.find({ product: productId });
    product.numReviews = reviews.length;
    product.averageRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).populate("user", "name");
    res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to update this review",
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    // Update product average rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.averageRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    // Make sure user is review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        error: "Not authorized to delete this review",
      });
    }

    await review.remove();

    // Update product average rating
    const product = await Product.findById(review.product);
    const reviews = await Review.find({ product: review.product });
    product.numReviews = reviews.length;
    product.averageRating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;
    await product.save();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
