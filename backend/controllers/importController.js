exports.importComponents = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "File received successfully",
    file: req.file.filename,
  });
};