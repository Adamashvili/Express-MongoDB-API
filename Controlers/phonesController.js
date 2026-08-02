const Phone = require("../Models/phoneModel");

exports.getAllPhones = async (req, res) => {
  try {
    const phones = await Phone.find();
    res.status(200).json({
      status: "success",
      total: phones.length,
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
