const Phone = require("../Models/phoneModel");

exports.getAllPhones = async (req, res) => {
  try {
    // --------  IF QUERY DATA EXISTS  ----------------
    const { search, brand, minPrice, maxPrice } = req.query;
    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (brand) {
      filter.brand = brand;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    // -------

    //-------Pagination-------
    const totalCount = await Phone.countDocuments(filter);
    let query = Phone.find(filter);

    let pageIndex = +req.query.page || 1;
    let limitSize = +req.query.limit || 10;
    let skip = (pageIndex - 1) * limitSize;

    query = query.skip(skip).limit(limitSize);

    // -----

    const phones = await query;

    res.status(200).json({
      status: "success",
      page: pageIndex,
      totalPages: Math.ceil(totalCount / limitSize),
      limit: limitSize,
      total: totalCount,
      data: phones,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.getSinglePhone = async (req, res) => {
  try {
    const singlePhone = await Phone.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: singlePhone,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.postNewPhone = async (req, res) => {
  try {
    const phone = await Phone.create(req.body);
    res.status(201).json({
      status: "success",
      data: phone,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.patchSinglePhone = async (req, res) => {
  try {
    const phoneToUpdate = await Phone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", runValidators: true },
    );
    res.status(200).json({
      status: "success",
      data: phoneToUpdate,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

exports.deletePhone = async (req, res) => {
  try {
    await Phone.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};
