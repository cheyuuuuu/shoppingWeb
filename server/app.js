const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Commodity = require("./models/commodity");
const Order = require("./models/order");
const { url } = require("inspector");
const { error } = require("console");
const app = express();

const saltRounds = 10;

mongoose
  .connect("mongodb://localhost:27017/member_db")
  .then(() => {
    console.log("成功連結mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(
  cors({
    origin: "http://localhost:3000", // 或使用環境變數來設置 URL
    credentials: true, // 如果需要包含 cookie，啟用這個選項
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "public/images")));

const upload = multer();

// 會員註冊
app.post("/api/register", async (req, res) => {
  // console.log(req.body);
  const { name, email, password } = req.body;
  let role = req.body.role || "user";
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "該信箱已被註冊" });
    }
    if (name === "admin") {
      //設定管理員
      role = "admin";
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({ name, email, password: hashedPassword, role });

    await newUser.save(); // 將資料儲存到 MongoDB
    console.log("資料儲存成功");
    res
      .status(201)
      .json({ message: "使用者資料成功存入資料庫", user: newUser });
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

//登入
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "用戶不存在，請註冊新帳號" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "密碼錯誤" });
    }
    res.status(200).json({ message: "登入成功", user: user });
  } catch (e) {
    res.status(500).json({ message: "來自後端伺服器錯誤", e });
  }
});

//身分驗證
app.post("/api/auth[...nextauth]", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "用戶不存在，請註冊新帳號" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "密碼錯誤" });
    }
    res.status(200).json({ message: "登入成功", user: user });
  } catch (e) {
    res.status(500).json({ message: "來自後端伺服器錯誤", e });
  }
});

//新增商品
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const { name, description, type, price, number } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "請上傳圖片" });
    }
    const imagePath = path.join(
      __dirname,
      "public/images",
      req.file.originalname
    );
    fs.writeFileSync(imagePath, req.file.buffer);

    const newCommodity = new Commodity({
      name,
      description,
      type,
      price,
      number,
      image: {
        contentType: req.file.mimetype,
        url: `/images/${req.file.originalname}`,
      },
    });

    await newCommodity.save();
    res.status(200).json({ message: "商品上傳成功", data: newCommodity });
  } catch (error) {
    res.status(500).json({ error: "商品上傳失敗", error: error.message });
  }
});

//修改商品
app.patch("/api/edit", async (req, res) => {
  try {
    const { updates } = req.body;
    // 批量更新每個商品
    const updatePromises = Object.keys(updates).map((id) =>
      Commodity.findByIdAndUpdate(id, updates[id], { new: true })
    );
    const updatedCommodities = await Promise.all(updatePromises);
    res.status(200).json({ message: "修改成功", updatedCommodities });
  } catch (e) {
    res.status(500).json({ message: "修改失敗", error: e.message });
  }
});

//刪除商品&後端資料夾中的圖片
app.delete("/api/delete", async (req, res) => {
  try {
    const { deletes } = req.body;
    const deletePromises = deletes.map((id) => Commodity.findByIdAndDelete(id));
    const deleteCommodities = await Promise.all(deletePromises);
    deleteCommodities.forEach((commodity) => {
      const imageUrl = commodity?.image?.url;
      console.log(imageUrl);
      if (imageUrl) {
        const imagePath = path.join(__dirname, "public", imageUrl);

        // 刪除圖片
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`圖片已刪除: ${imagePath}`);
        } else {
          console.warn(`找不到圖片: ${imagePath}`);
        }
      }
    });
    res.status(200).json({ message: "刪除成功", deleteCommodities });
  } catch (e) {
    res.status(500).json({ message: "刪除失敗", e });
  }
});

//獲得商品列表
app.get("/api/commodities", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    const commodities = await Commodity.find({});
    res.status(200).json(commodities);
  } catch (e) {
    res.status(500).json({ message: "資料取得失敗", error: error.message });
  }
});

//獲得依類型分類商品
app.get("/api/commodity/category/:type", async (req, res) => {
  const decodedType = decodeURIComponent(req.params.type);
  try {
    const commodities = await Commodity.find({ type: decodedType });
    if (commodities) {
      res.json(commodities);
    } else {
      res.status(404).json({ message: "商品類別未找到" });
    }
  } catch (e) {
    res.status(500).json({ message: "獲取類別資料失敗", error: e });
  }
});

//獲得單一商品資訊
app.get("/api/commodity/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const commodity = await Commodity.findById(id);
    if (commodity) {
      res.json(commodity);
    } else {
      res.status(404).json({ message: "商品未找到" });
    }
  } catch (error) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

//加入購物車
app.patch("/api/addCart", async (req, res) => {
  try {
    const { userEmail, commodityId, commodityName, count } = req.body;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "用戶不存在" });
    }
    //檢查購物車是否有該商品
    const existingItemIndex = user.cart.findIndex(
      (item) => item.commodityId === commodityId
    );

    if (existingItemIndex !== -1) {
      //商品存在 就增加數量
      user.cart[existingItemIndex].count += count;
      console.log("更新商品數量", user.cart[existingItemIndex]);
    } else {
      //如果商品不存在 就加入商品
      user.cart.push({
        commodityId,
        commodityName,
        count,
      });
      console.log("添加新商品:", { commodityId, commodityName, count });
    }

    await user.save();
    res.status(200).json({ message: "商品加入購物車成功" });
  } catch (error) {
    res.status(500).json({ message: "加入購物車失敗", error: error.message });
  }
});

//獲取會員購物車內容
app.get("/api/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "用戶不存在" });
    }

    res.json({ cart: user.cart });
  } catch (e) {
    console.error("無法獲取用戶購物車:", e);
    res.status(500).json({ message: "獲取用戶購物車失敗", error: e });
  }
});

//會員獲得歷史訂單

app.get("/api/members/oldOrders/:userEmail", async (req, res) => {
  try {
    const { userEmail } = req.params;
    const orders = await Order.find({ userEmail: userEmail });
    if (!orders) {
      return res.status(404).json({ message: "訂單不存在" });
    }
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ message: "獲取訂單失敗", error: e });
  }
});

//管理員獲得訂單列表
app.get("/api/manner/orders", async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res.status(404).json({ message: "訂單不存在" });
    }
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json({ message: "獲取訂單失敗", error: e });
  }
});

//修改購物車商品數量
app.patch("/api/updateCart", async (req, res) => {
  try {
    const { userEmail, commodityId, count } = req.body;

    if (count < 0) {
      return res.status(400).json({ message: "數量不能小於0" });
    }
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "用戶不存在" });
    }
    if (count === 0) {
      user.cart = user.cart.filter((item) => item.commodityId !== commodityId);
    } else {
      const itemIndex = user.cart.findIndex(
        (item) => item.commodityId === commodityId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ message: "商品不在購物車內" });
      }
      user.cart[itemIndex].count = count;
    }
    await user.save();
    res.status(200).json({
      message: "商品數量已更新",
      cart: user.cart,
    });
  } catch (e) {
    console.error("更新購物車數量發生錯誤", e);
    res.status(500).json({ message: "更新購物車數量失敗", error: e.message });
  }
});

//移除購物車內已下架商品
app.delete("/api/userCart/delete", async (req, res) => {
  try {
    const { userEmail, commodityId } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: " 用戶不存在" });
    }
    user.cart = user.cart.filter((item) => item.commodityId !== commodityId);
    await user.save();
    res.json({ message: "刪除購物車商品成功" });
  } catch (e) {
    res.status(500).json({ message: "刪除購物車商品失敗", error: e });
  }
});

//移除購物車商品
app.delete("/api/removeFromCart", async (req, res) => {
  try {
    const { userEmail, commodityId } = req.body;
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: " 用戶不存在" });
    }
    user.cart = user.cart.filter((item) => item.commodityId !== commodityId);
    await user.save();
    res.json({ message: "刪除購物車商品成功" });
  } catch (e) {
    res.status(500).json({ message: "刪除購物車商品失敗", error: e });
  }
});

//建立訂單
app.post("/api/order", async (req, res) => {
  try {
    const { userEmail, name, address, tel, commodities, totalPrice, payment } =
      req.body;
    //檢查必要欄位
    if (
      !userEmail ||
      !name ||
      !address ||
      !tel ||
      !commodities ||
      !totalPrice ||
      !payment
    ) {
      return res.status(400).json({ error: "缺少必要欄位" });
    }
    //查看購買數量有沒有超過庫存
    for (const item of commodities) {
      const commodity = await Commodity.findById(item.commodityId);
      if (!commodity) {
        return res
          .status(404)
          .json({ error: `商品 ${item.commodityName} 不存在` });
      }
      if (commodity.number < item.count) {
        return res
          .status(400)
          .json({ error: `商品 ${item.commodityName} 庫存不足` });
      }
    }
    //建立訂單
    const newOrder = new Order({
      userEmail,
      name,
      address,
      tel,
      commodities,
      totalPrice,
      payment,
    });
    //更新庫存數量
    for (const item of commodities) {
      await Commodity.findByIdAndUpdate(item.commodityId, {
        $inc: { number: -item.count },
      });
    }

    await newOrder.save();
    //更新購物車狀態
    await User.findOneAndUpdate({ email: userEmail }, { $set: { cart: [] } });

    res.status(200).json({ message: "訂單建立成功", data: newOrder });
  } catch (e) {
    res.status(500).json({ error: "訂單建立失敗", error: e.message });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
